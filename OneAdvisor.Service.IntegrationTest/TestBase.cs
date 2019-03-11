using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using OneAdvisor.Data;
using EFCore.BulkExtensions;
using System.Threading.Tasks;

namespace OneAdvisor.Service.IntegrationTest
{
    public abstract class TestBase : IDisposable
    {
        protected DataContext _context;
        protected DbContextOptions<DataContext> _options;

        public TestBase()
        {
            var serviceProvider = new ServiceCollection()
                .AddEntityFrameworkSqlServer()
                .BuildServiceProvider();

            var builder = new DbContextOptionsBuilder<DataContext>();

            builder.UseSqlServer($"Server=tcp:oneadvisor-sql.database.windows.net,1433;Initial Catalog=OneAdvisorIntegrationTest;Persist Security Info=False;User ID=oneadvisor@oneadvisor-sql;Password=rob!nh00d;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;")
                    .ConfigureWarnings(warnings => warnings.Throw(RelationalEventId.QueryClientEvaluationWarning))
                    .UseInternalServiceProvider(serviceProvider);

            _context = new DataContext(builder.Options);
            _context.Database.Migrate();
            _options = builder.Options;
        }

        public void Dispose()
        {
            _context.Commission.BatchDelete();
            _context.CommissionError.BatchDelete();
            _context.CommissionStatement.BatchDelete();
            _context.CommissionStatementTemplate.BatchDelete();

            _context.Contact.BatchDelete();
            _context.Policy.BatchDelete();
            _context.Member.BatchDelete();

            _context.AuditLog.BatchDelete();
            _context.RoleToUseCase.BatchDelete();
            _context.UseCase.BatchDelete();
            _context.Organisation.BatchDelete();
            _context.Application.BatchDelete();

            _context.Company.BatchDelete();
            _context.CommissionType.BatchDelete();
            _context.MarritalStatus.BatchDelete();
            _context.ContactType.BatchDelete();
            _context.PolicyType.BatchDelete();

            _context.UserClaims.BatchDelete();
            _context.UserRoles.BatchDelete();
            _context.UserLogins.BatchDelete();
            _context.UserTokens.BatchDelete();
            _context.Users.BatchDelete();
            _context.RoleClaims.BatchDelete();
            _context.Roles.BatchDelete();
        }
    }
}