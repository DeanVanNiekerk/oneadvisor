using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Service.Commission;
using OneAdvisor.Data.Entities.Member;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite;
using OneAdvisor.Model.Directory.Model.Lookup;

namespace OneAdvisor.Service.Test.Commission
{

    public class CommissionReportServiceTest
    {

        [Fact]
        public async Task GetCommissions()
        {
            // In-memory database only exists while the connection is open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            try
            {
                var options = new DbContextOptionsBuilder<DataContext>()
                    .UseSqlite(connection)
                    .Options;

                // Create the schema in the database
                using (var context = new DataContext(options))
                {
                    context.Database.EnsureCreated();
                }

                TestHelper.InsertCommissionEarningsTypes(options);

                var company = TestHelper.InsertCompany(options);
                var policyType = TestHelper.InsertPolicyType(options);
                var commissionType = TestHelper.InsertCommissionType(options, policyType.Id, CommissionEarningsType.EARNINGS_TYPE_ANNUAL_ANNUITY);

                var user1 = TestHelper.InsertUserDetailed(options);
                var member1 = TestHelper.InsertMember(options, user1.Organisation);

                var policy1 = new PolicyEntity
                {
                    Id = Guid.NewGuid(),
                    Number = Guid.NewGuid().ToString(),
                    CompanyId = company.Id,
                    MemberId = member1.Member.Id,
                    UserId = user1.User.Id
                };

                var cs1 = new CommissionStatementEntity
                {
                    Id = Guid.NewGuid(),
                    CompanyId = company.Id,
                    AmountIncludingVAT = 0,
                    VAT = 0,
                    Date = DateTime.Now.Date,
                    Processed = true,
                    OrganisationId = user1.Organisation.Id
                };

                //Given
                var commission1 = new CommissionEntity
                {
                    Id = Guid.NewGuid(),
                    PolicyId = policy1.Id,
                    CommissionTypeId = commissionType.Id,
                    AmountIncludingVAT = 100,
                    VAT = 10,
                    CommissionStatementId = cs1.Id
                };

                using (var context = new DataContext(options))
                {
                    context.Policy.Add(policy1);
                    context.CommissionStatement.Add(cs1);
                    context.Commission.Add(commission1);

                    context.SaveChanges();
                }

                using (var context = new DataContext(options))
                {
                    var service = new CommissionReportService(context);

                    //When
                    var scope = TestHelper.GetScopeOptions(user1);
                    var data = await service.GetMemberRevenueData(scope, cs1.Date.AddMonths(-12), cs1.Date);

                    //Then
                    var results = data.ToList();

                    Assert.Equal(1, results.Count());

                    var actual = results[0];
                    Assert.Equal(member1.Member.Id, actual.MemberId);
                }
            }
            finally
            {
                connection.Close();
            }
        }
    }
}