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
using OneAdvisor.Data.Entities.Client;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Model.Directory.Model.Lookup;
using Microsoft.Extensions.DependencyInjection;
using OneAdvisor.Service.Test;
using OneAdvisor.Model.Commission.Model.CommissionReport;
using Microsoft.Data.Sqlite;
using OneAdvisor.Model.Client.Model.Lookup;
using OneAdvisor.Model.Commission.Model.Lookup;

namespace OneAdvisor.Service.IntegrationTest.Commission
{

    public class CommissionReportServiceTest : TestBase
    {
        [Fact]
        [Trait("Category", "Integration")]
        public async Task GetClientRevenueData()
        {
            var options = await CreateDatabase();

            var company = TestHelper.InsertCompany(options);

            var commissionType1 = TestHelper.InsertCommissionType(options, PolicyType.POLICY_TYPE_INVESTMENT, CommissionEarningsType.EARNINGS_TYPE_ANNUAL_ANNUITY);
            var commissionType2 = TestHelper.InsertCommissionType(options, PolicyType.POLICY_TYPE_INVESTMENT, CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY);
            var commissionType3 = TestHelper.InsertCommissionType(options, PolicyType.POLICY_TYPE_INVESTMENT, CommissionEarningsType.EARNINGS_TYPE_ONCE_OFF);
            var commissionType4 = TestHelper.InsertCommissionType(options, PolicyType.POLICY_TYPE_INVESTMENT, CommissionEarningsType.EARNINGS_TYPE_LIFE_FIRST_YEARS);

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var thisMonth = DateTime.Now.Date;
            var lastMonth = thisMonth.AddMonths(-1);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = company.Id,
                ClientId = client1.Client.Id,
                UserId = user1.User.Id
            };

            //Statement 1 - this month
            //          ANNUAL_ANNUITY  |   MONTHLY_ANNUITY |   ONCE_OFF    |   LIFE_FIRST_YEARS
            //com1      100                 0                   0               0                               
            //com2      0                   200                 0               0                               
            //com3      0                   0                   300             0                               
            //com4      0                   0                   0               400                               

            var cs1 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = company.Id,
                AmountIncludingVAT = 0,
                VAT = 0,
                Date = thisMonth,
                Processed = true,
                OrganisationId = user1.Organisation.Id
            };

            var commission1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = commissionType1.Id,
                AmountIncludingVAT = 100,
                VAT = 0,
                CommissionStatementId = cs1.Id
            };

            var commission2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = commissionType2.Id,
                AmountIncludingVAT = 200,
                VAT = 0,
                CommissionStatementId = cs1.Id
            };

            var commission3 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = commissionType3.Id,
                AmountIncludingVAT = 300,
                VAT = 0,
                CommissionStatementId = cs1.Id
            };

            var commission4 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = commissionType4.Id,
                AmountIncludingVAT = 400,
                VAT = 0,
                CommissionStatementId = cs1.Id
            };

            //Statement 2 - last month
            //          ANNUAL_ANNUITY  |   MONTHLY_ANNUITY |   ONCE_OFF    |   LIFE_FIRST_YEARS
            //com5      500                 0                   0               0                               
            //com6      0                   600                 0               0                               
            //com7      0                   0                   700             0                               
            //com8      0                   0                   0               800                               

            var cs2 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = company.Id,
                AmountIncludingVAT = 0,
                VAT = 0,
                Date = lastMonth,
                Processed = true,
                OrganisationId = user1.Organisation.Id
            };

            var commission5 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = commissionType1.Id,
                AmountIncludingVAT = 500,
                VAT = 0,
                CommissionStatementId = cs2.Id
            };

            var commission6 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = commissionType2.Id,
                AmountIncludingVAT = 600,
                VAT = 0,
                CommissionStatementId = cs2.Id
            };

            var commission7 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = commissionType3.Id,
                AmountIncludingVAT = 700,
                VAT = 0,
                CommissionStatementId = cs2.Id
            };

            var commission8 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = commissionType4.Id,
                AmountIncludingVAT = 800,
                VAT = 0,
                CommissionStatementId = cs2.Id
            };

            //Statement 3 - 2 months age
            //          ANNUAL_ANNUITY  |   MONTHLY_ANNUITY |   ONCE_OFF    |   LIFE_FIRST_YEARS
            //com9      900                 0                   0               0                               
            //com10     0                   1000                0               0                               
            //com11     0                   0                   1100            0                               
            //com12     0                   0                   0               1200                               

            var cs3 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = company.Id,
                AmountIncludingVAT = 0,
                VAT = 0,
                Date = lastMonth.AddMonths(-1),
                Processed = true,
                OrganisationId = user1.Organisation.Id
            };

            var commission9 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = commissionType1.Id,
                AmountIncludingVAT = 900,
                VAT = 0,
                CommissionStatementId = cs3.Id
            };

            var commission10 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = commissionType2.Id,
                AmountIncludingVAT = 1000,
                VAT = 0,
                CommissionStatementId = cs3.Id
            };

            var commission11 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = commissionType3.Id,
                AmountIncludingVAT = 1100,
                VAT = 0,
                CommissionStatementId = cs3.Id
            };

            var commission12 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = commissionType4.Id,
                AmountIncludingVAT = 1200,
                VAT = 0,
                CommissionStatementId = cs3.Id
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);

                context.CommissionStatement.Add(cs1);
                context.Commission.Add(commission1);
                context.Commission.Add(commission2);
                context.Commission.Add(commission3);
                context.Commission.Add(commission4);

                context.CommissionStatement.Add(cs2);
                context.Commission.Add(commission5);
                context.Commission.Add(commission6);
                context.Commission.Add(commission7);
                context.Commission.Add(commission8);

                context.CommissionStatement.Add(cs3);
                context.Commission.Add(commission9);
                context.Commission.Add(commission10);
                context.Commission.Add(commission11);
                context.Commission.Add(commission12);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionReportService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new ClientRevenueQueryOptions(scope, "", "", 0, 0);
                queryOptions.YearEnding = thisMonth.Year;
                queryOptions.MonthEnding = thisMonth.Month;
                var data = await service.GetClientRevenueData(queryOptions);

                //Then
                var results = data.Items.ToList();
                Assert.Equal(1, data.TotalItems);

                Assert.Single(results);

                var actual = results[0];
                Assert.Equal(client1.Client.Id, actual.ClientId);
                Assert.Equal(client1.Client.LastName, actual.ClientLastName);
                Assert.Equal(client1.Client.Initials, actual.ClientInitials);
                Assert.Equal(client1.Client.DateOfBirth, actual.ClientDateOfBirth);

                Assert.Equal(200, actual.MonthlyAnnuityMonth); // com2
                Assert.Equal(125, actual.AnnualAnnuityAverage); // (100 + 500 + 900) / 12
                Assert.Equal(325, actual.TotalMonthlyEarnings); // 125 + 200

                Assert.Equal(2100, actual.OnceOff); //300 + 700 + 1100
                Assert.Equal(2400, actual.LifeFirstYears); //400 + 800 + 1200

                Assert.Equal(8400, actual.GrandTotal); // (325 * 12) + 2100 + 2400
            }
        }


        [Fact]
        [Trait("Category", "Integration")]
        public async Task GetClientRevenueData_Sorting()
        {
            var options = await CreateDatabase();

            var company = TestHelper.InsertCompany(options);
            var commissionType1 = TestHelper.InsertCommissionType(options, PolicyType.POLICY_TYPE_INVESTMENT, CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY);

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);
            var client2 = TestHelper.InsertClient(options, user1.Organisation);
            var client3 = TestHelper.InsertClient(options, user1.Organisation);

            var thisMonth = DateTime.Now.Date;

            var cs1 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = company.Id,
                AmountIncludingVAT = 0,
                VAT = 0,
                Date = thisMonth,
                Processed = true,
                OrganisationId = user1.Organisation.Id
            };

            //------------------------------------------------------------------------

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = company.Id,
                ClientId = client1.Client.Id,
                UserId = user1.User.Id
            };

            var commission1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = commissionType1.Id,
                AmountIncludingVAT = 200,
                VAT = 0,
                CommissionStatementId = cs1.Id
            };

            //------------------------------------------------------------------------

            var policy2 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = company.Id,
                ClientId = client2.Client.Id,
                UserId = user1.User.Id
            };

            var commission2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy2.Id,
                CommissionTypeId = commissionType1.Id,
                AmountIncludingVAT = 100,
                VAT = 0,
                CommissionStatementId = cs1.Id
            };

            //------------------------------------------------------------------------

            var policy3 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = company.Id,
                ClientId = client3.Client.Id,
                UserId = user1.User.Id
            };

            var commission3 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy3.Id,
                CommissionTypeId = commissionType1.Id,
                AmountIncludingVAT = 300,
                VAT = 0,
                CommissionStatementId = cs1.Id
            };

            //------------------------------------------------------------------------


            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);
                context.Policy.Add(policy2);
                context.Policy.Add(policy3);

                context.CommissionStatement.Add(cs1);
                context.Commission.Add(commission1);
                context.Commission.Add(commission2);
                context.Commission.Add(commission3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionReportService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new ClientRevenueQueryOptions(scope, "MonthlyAnnuityMonth", "desc", 0, 0);
                queryOptions.YearEnding = thisMonth.Year;
                queryOptions.MonthEnding = thisMonth.Month;
                var data = await service.GetClientRevenueData(queryOptions);

                //Then
                var results = data.Items.ToList();
                Assert.Equal(3, data.TotalItems);

                var resultsCount = results.Count();
                Assert.Equal(3, resultsCount);

                var actual = results[0];
                Assert.Equal(client3.Client.Id, actual.ClientId);
                Assert.Equal(300, actual.MonthlyAnnuityMonth);

                actual = results[1];
                Assert.Equal(client1.Client.Id, actual.ClientId);
                Assert.Equal(200, actual.MonthlyAnnuityMonth);

                actual = results[2];
                Assert.Equal(client2.Client.Id, actual.ClientId);
                Assert.Equal(100, actual.MonthlyAnnuityMonth);
            }
        }

        [Fact]
        [Trait("Category", "Integration")]
        public async Task GetClientRevenueData_Paging()
        {
            var options = await CreateDatabase();

            var company = TestHelper.InsertCompany(options);
            var commissionType1 = TestHelper.InsertCommissionType(options, PolicyType.POLICY_TYPE_INVESTMENT, CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY);

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);
            var client2 = TestHelper.InsertClient(options, user1.Organisation);
            var client3 = TestHelper.InsertClient(options, user1.Organisation);
            var client4 = TestHelper.InsertClient(options, user1.Organisation);
            var client5 = TestHelper.InsertClient(options, user1.Organisation);

            var thisMonth = DateTime.Now.Date;

            var cs1 = new CommissionStatementEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = company.Id,
                AmountIncludingVAT = 0,
                VAT = 0,
                Date = thisMonth,
                Processed = true,
                OrganisationId = user1.Organisation.Id
            };

            //------------------------------------------------------------------------

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = company.Id,
                ClientId = client1.Client.Id,
                UserId = user1.User.Id
            };

            var commission1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = commissionType1.Id,
                AmountIncludingVAT = 100,
                VAT = 0,
                CommissionStatementId = cs1.Id
            };

            //------------------------------------------------------------------------

            var policy2 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = company.Id,
                ClientId = client2.Client.Id,
                UserId = user1.User.Id
            };

            var commission2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy2.Id,
                CommissionTypeId = commissionType1.Id,
                AmountIncludingVAT = 200,
                VAT = 0,
                CommissionStatementId = cs1.Id
            };

            //------------------------------------------------------------------------

            var policy3 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = company.Id,
                ClientId = client3.Client.Id,
                UserId = user1.User.Id
            };

            var commission3 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy3.Id,
                CommissionTypeId = commissionType1.Id,
                AmountIncludingVAT = 300,
                VAT = 0,
                CommissionStatementId = cs1.Id
            };

            //------------------------------------------------------------------------

            //------------------------------------------------------------------------

            var policy4 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = company.Id,
                ClientId = client4.Client.Id,
                UserId = user1.User.Id
            };

            var commission4 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy4.Id,
                CommissionTypeId = commissionType1.Id,
                AmountIncludingVAT = 400,
                VAT = 0,
                CommissionStatementId = cs1.Id
            };

            //------------------------------------------------------------------------

            var policy5 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = company.Id,
                ClientId = client5.Client.Id,
                UserId = user1.User.Id
            };

            var commission5 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy5.Id,
                CommissionTypeId = commissionType1.Id,
                AmountIncludingVAT = 500,
                VAT = 0,
                CommissionStatementId = cs1.Id
            };

            //------------------------------------------------------------------------


            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy4);
                context.Policy.Add(policy1);
                context.Policy.Add(policy2);
                context.Policy.Add(policy5);
                context.Policy.Add(policy3);

                context.CommissionStatement.Add(cs1);
                context.Commission.Add(commission3);
                context.Commission.Add(commission1);
                context.Commission.Add(commission4);
                context.Commission.Add(commission5);
                context.Commission.Add(commission2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionReportService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new ClientRevenueQueryOptions(scope, "MonthlyAnnuityMonth", "asc", 2, 2);
                queryOptions.YearEnding = thisMonth.Year;
                queryOptions.MonthEnding = thisMonth.Month;
                var data = await service.GetClientRevenueData(queryOptions);

                //Then
                var results = data.Items.ToList();
                Assert.Equal(5, data.TotalItems);

                var resultsCount = results.Count();
                Assert.Equal(2, resultsCount);

                var actual = results[0];
                Assert.Equal(client3.Client.Id, actual.ClientId);
                Assert.Equal(300, actual.MonthlyAnnuityMonth);

                actual = results[1];
                Assert.Equal(client4.Client.Id, actual.ClientId);
                Assert.Equal(400, actual.MonthlyAnnuityMonth);
            }
        }


    }

}