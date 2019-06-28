using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using OneAdvisor.Data;
using System.Threading.Tasks;
using System.Collections.Generic;
using Xunit;

[assembly: CollectionBehavior(DisableTestParallelization = true)]
namespace OneAdvisor.Service.IntegrationTest
{
    public abstract class TestBase : IDisposable
    {
        private List<DataContext> _contexts = new List<DataContext>();

        protected async Task<DbContextOptions<DataContext>> CreateDatabaseSqlServer()
        {
            var serviceProvider = new ServiceCollection()
                .AddEntityFrameworkSqlServer()
                .BuildServiceProvider();

            var builder = new DbContextOptionsBuilder<DataContext>();

            var dbName = "OneAdvisorTest";

            builder.UseSqlServer($"Server=tcp:oneadvisor-dev-sql.database.windows.net,1433;Initial Catalog={dbName};User ID=oneadvisor@oneadvisor-dev-sql;Password=Ul7Q7VgNxWFWRi60;;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30")
            //Uncomment for quicker local testing
            //builder.UseSqlServer($"Server=127.0.0.1,1433;Database={dbName};User ID=sa;Password=2x&%bLn3c47Y!y&hv7;Connection Timeout=60")
                    .ConfigureWarnings(warnings => warnings.Throw(RelationalEventId.QueryClientEvaluationWarning))
                    .UseInternalServiceProvider(serviceProvider);

            var context = new DataContext(builder.Options);

            //Create foreach table proc (so that we can use when deleting...)
            await context.Database.ExecuteSqlCommandAsync(GetMSForeachWorkerProc());
            await context.Database.ExecuteSqlCommandAsync(GetMSForeachTableProc());

            //Disable all referential integrity constraints
            await context.Database.ExecuteSqlCommandAsync($"EXEC [dbo].[sp_msforeachtable] 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'");

            //Drop all PKs and FKs
            await context.Database.ExecuteSqlCommandAsync(@"
            DECLARE @sql nvarchar(max)
            SELECT @sql = STUFF((SELECT '; ' + 'ALTER TABLE ' + Table_Name  +'  drop constraint ' + Constraint_Name  from Information_Schema.CONSTRAINT_TABLE_USAGE ORDER BY Constraint_Name FOR XML PATH('')),1,1,'')
            EXECUTE (@sql)
            ");

            //Drop all tables
            await context.Database.ExecuteSqlCommandAsync($"EXEC [dbo].[sp_msforeachtable] 'DROP TABLE ?'");

            await context.Database.MigrateAsync();

            _contexts.Add(context);

            return builder.Options;
        }

        private string GetMSForeachTableProc()
        {
            return @"
            create or alter proc [dbo].[sp_MSforeachtable]
                @command1 nvarchar(2000), @replacechar nchar(1) = N'?', @command2 nvarchar(2000) = null,
            @command3 nvarchar(2000) = null, @whereand nvarchar(2000) = null,
                @precommand nvarchar(2000) = null, @postcommand nvarchar(2000) = null
            as
                /* This proc returns one or more rows for each table (optionally, matching @where), with each table defaulting to its own result set */
                /* @precommand and @postcommand may be used to force a single result set via a temp table. */

                /* Preprocessor won't replace within quotes so have to use str(). */
                declare @mscat nvarchar(12)
                select @mscat = ltrim(str(convert(int, 0x0002)))

                if (@precommand is not null)
                    exec(@precommand)

                /* Create the select */
            exec(N'declare hCForEachTable cursor global for select ''['' + REPLACE(schema_name(syso.schema_id), N'']'', N'']]'') + '']'' + ''.'' + ''['' + REPLACE(object_name(o.id), N'']'', N'']]'') + '']'' from dbo.sysobjects o join sys.all_objects syso on o.id = syso.object_id '
                    + N' where OBJECTPROPERTY(o.id, N''IsUserTable'') = 1 ' + N' and o.category & ' + @mscat + N' = 0 '
                    + @whereand)
                declare @retval int
                select @retval = @@error
                if (@retval = 0)
                    exec @retval = [dbo].[sp_MSforeach_worker] @command1, @replacechar, @command2, @command3, 0

                if (@retval = 0 and @postcommand is not null)
                    exec(@postcommand)

                return @retval
            ";
        }

        private string GetMSForeachWorkerProc()
        {
            return @"
            create or alter proc [dbo].[sp_MSforeach_worker]
                @command1 nvarchar(2000), @replacechar nchar(1) = N'?', @command2 nvarchar(2000) = null, @command3 nvarchar(2000) = null, @worker_type int =1
            as

                create table #qtemp (	/* Temp command storage */
                    qnum				int				NOT NULL,
                    qchar				nvarchar(2000)	COLLATE database_default NULL
                )

                set nocount on
                declare @name nvarchar(517), @namelen int, @q1 nvarchar(2000), @q2 nvarchar(2000)
            declare @q3 nvarchar(2000), @q4 nvarchar(2000), @q5 nvarchar(2000)
                declare @q6 nvarchar(2000), @q7 nvarchar(2000), @q8 nvarchar(2000), @q9 nvarchar(2000), @q10 nvarchar(2000)
                declare @cmd nvarchar(2000), @replacecharindex int, @useq tinyint, @usecmd tinyint, @nextcmd nvarchar(2000)
            declare @namesave nvarchar(517), @nametmp nvarchar(517), @nametmp2 nvarchar(258)

                declare @local_cursor cursor
                if @worker_type=1	
                    set @local_cursor = hCForEachDatabase
                else
                    set @local_cursor = hCForEachTable
                
                open @local_cursor
                fetch @local_cursor into @name

                /* Loop for each database */
                while (@@fetch_status >= 0) begin
                    /* Initialize. */

                /* save the original dbname */
                select @namesave = @name
                    select @useq = 1, @usecmd = 1, @cmd = @command1, @namelen = datalength(@name)
                    while (@cmd is not null) begin		/* Generate @q* for exec() */
                        /*
                        * Parse each @commandX into a single executable batch.
                        * Because the expanded form of a @commandX may be > OSQL_MAXCOLLEN_SET, we'll need to allow overflow.
                        * We also may append @commandX's (signified by '++' as first letters of next @command).
                        */
                        select @replacecharindex = charindex(@replacechar, @cmd)
                        while (@replacecharindex <> 0) begin

                        /* 7.0, if name contains ' character, and the name has been single quoted in command, double all of them in dbname */
                        /* if the name has not been single quoted in command, do not doulbe them */
                        /* if name contains ] character, and the name has been [] quoted in command, double all of ] in dbname */
                        select @name = @namesave
                        select @namelen = datalength(@name)
                        declare @tempindex int
                        if (substring(@cmd, @replacecharindex - 1, 1) = N'''') begin
                        /* if ? is inside of '', we need to double all the ' in name */
                        select @name = REPLACE(@name, N'''', N'''''')
                        end else if (substring(@cmd, @replacecharindex - 1, 1) = N'[') begin
                        /* if ? is inside of [], we need to double all the ] in name */
                        select @name = REPLACE(@name, N']', N']]')
                        end else if ((@name LIKE N'%].%]') and (substring(@name, 1, 1) = N'[')) begin
                        /* ? is NOT inside of [] nor '', and the name is in [owner].[name] format, handle it */
                        /* !!! work around, when using LIKE to find string pattern, can't use '[', since LIKE operator is treating '[' as a wide char */
                        select @tempindex = charindex(N'].[', @name)
                        select @nametmp  = substring(@name, 2, @tempindex-2 )
                        select @nametmp2 = substring(@name, @tempindex+3, len(@name)-@tempindex-3 )
                        select @nametmp  = REPLACE(@nametmp, N']', N']]')
                        select @nametmp2 = REPLACE(@nametmp2, N']', N']]')
                        select @name = N'[' + @nametmp + N'].[' + @nametmp2 + ']'
                        end else if ((@name LIKE N'%]') and (substring(@name, 1, 1) = N'[')) begin
                        /* ? is NOT inside of [] nor '', and the name is in [name] format, handle it */
                        /* j.i.c., since we should not fall into this case */
                        /* !!! work around, when using LIKE to find string pattern, can't use '[', since LIKE operator is treating '[' as a wide char */
                        select @nametmp = substring(@name, 2, len(@name)-2 )
                        select @nametmp = REPLACE(@nametmp, N']', N']]')
                        select @name = N'[' + @nametmp + N']'
                        end
                        /* Get the new length */
                        select @namelen = datalength(@name)

                        /* start normal process */
                            if (datalength(@cmd) + @namelen - 1 > 2000) begin
                                /* Overflow; put preceding stuff into the temp table */
                                if (@useq > 9) begin
                                    close @local_cursor
                                    if @worker_type=1	
                                        deallocate hCForEachDatabase
                                    else
                                        deallocate hCForEachTable
                                        
                                    RAISERROR(55555, 16, 1); -- N'sp_MSforeach_worker assert failed:  command too long'
                                    return 1
                                end
                                if (@replacecharindex < @namelen) begin
                                    /* If this happened close to beginning, make sure expansion has enough room. */
                                    /* In this case no trailing space can occur as the row ends with @name. */
                                    select @nextcmd = substring(@cmd, 1, @replacecharindex)
                                    select @cmd = substring(@cmd, @replacecharindex + 1, 2000)
                                    select @nextcmd = stuff(@nextcmd, @replacecharindex, 1, @name)
                                    select @replacecharindex = charindex(@replacechar, @cmd)
                                    insert #qtemp values (@useq, @nextcmd)
                                    select @useq = @useq + 1
                                    continue
                                end
                                /* Move the string down and stuff() in-place. */
                                /* Because varchar columns trim trailing spaces, we may need to prepend one to the following string. */
                                /* In this case, the char to be replaced is moved over by one. */
                                insert #qtemp values (@useq, substring(@cmd, 1, @replacecharindex - 1))
                                if (substring(@cmd, @replacecharindex - 1, 1) = N' ') begin
                                    select @cmd = N' ' + substring(@cmd, @replacecharindex, 2000)
                                    select @replacecharindex = 2
                                end else begin
                                    select @cmd = substring(@cmd, @replacecharindex, 2000)
                                    select @replacecharindex = 1
                                end
                                select @useq = @useq + 1
                            end
                            select @cmd = stuff(@cmd, @replacecharindex, 1, @name)
                            select @replacecharindex = charindex(@replacechar, @cmd)
                        end

                        /* Done replacing for current @cmd.  Get the next one and see if it's to be appended. */
                        select @usecmd = @usecmd + 1
                        select @nextcmd = case (@usecmd) when 2 then @command2 when 3 then @command3 else null end
                        if (@nextcmd is not null and substring(@nextcmd, 1, 2) = N'++') begin
                            insert #qtemp values (@useq, @cmd)
                            select @cmd = substring(@nextcmd, 3, 2000), @useq = @useq + 1
                            continue
                        end

                        /* Now exec() the generated @q*, and see if we had more commands to exec().  Continue even if errors. */
                        /* Null them first as the no-result-set case won't. */
                        select @q1 = null, @q2 = null, @q3 = null, @q4 = null, @q5 = null, @q6 = null, @q7 = null, @q8 = null, @q9 = null, @q10 = null
                        select @q1 = qchar from #qtemp where qnum = 1
                        select @q2 = qchar from #qtemp where qnum = 2
                        select @q3 = qchar from #qtemp where qnum = 3
                        select @q4 = qchar from #qtemp where qnum = 4
                        select @q5 = qchar from #qtemp where qnum = 5
                        select @q6 = qchar from #qtemp where qnum = 6
                        select @q7 = qchar from #qtemp where qnum = 7
                        select @q8 = qchar from #qtemp where qnum = 8
                        select @q9 = qchar from #qtemp where qnum = 9
                        select @q10 = qchar from #qtemp where qnum = 10
                        truncate table #qtemp
                        exec (@q1 + @q2 + @q3 + @q4 + @q5 + @q6 + @q7 + @q8 + @q9 + @q10 + @cmd)
                        select @cmd = @nextcmd, @useq = 1
                    end /* while @cmd is not null, generating @q* for exec() */

                    /* All commands done for this name.  Go to next one. */
                    fetch @local_cursor into @name
                end /* while FETCH_SUCCESS */
                close @local_cursor
                if @worker_type=1	
                    deallocate hCForEachDatabase
                else
                    deallocate hCForEachTable
                    
                return 0
            ";
        }
        public void Dispose()
        {
            foreach (var context in _contexts)
            {
                context.Database.CloseConnection();
            }
        }
    }
}