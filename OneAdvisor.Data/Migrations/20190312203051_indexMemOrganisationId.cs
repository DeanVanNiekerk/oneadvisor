using Microsoft.EntityFrameworkCore.Migrations;

namespace OneAdvisor.Data.Migrations
{
    public partial class indexMemOrganisationId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //THIS INDEX ALREADY EXISTS.... (AS A FK INDEX)

            //             migrationBuilder.Sql(@"
            // IF NOT EXISTS(SELECT * FROM sys.indexes WHERE name = 'mem_member_OrganisationId_Index')
            // BEGIN
            //     CREATE NONCLUSTERED INDEX [mem_member_OrganisationId_Index] ON [dbo].[mem_Member] ([OrganisationId])
            // END
            //             ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
