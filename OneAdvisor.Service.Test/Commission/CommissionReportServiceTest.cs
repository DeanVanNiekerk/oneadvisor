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
using OneAdvisor.Model.Commission.Model.Lookup;
using OneAdvisor.Model.Commission.Model.CommissionReport;
using System.Collections.Generic;

namespace OneAdvisor.Service.Test.Commission
{

    public class CommissionReportServiceTest
    {

        [Fact]
        public async Task GetUserEarningsTypeMonthlyCommissionData_Basic()
        {
            var options = TestHelper.GetDbContext("GetUserEarningsTypeMonthlyCommissionData_Basic");

            TestHelper.InsertCommissionEarningsTypes(options);

            var comTypeMonth = TestHelper.InsertCommissionType(options, Guid.NewGuid(), CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY);
            var comTypeAnnual = TestHelper.InsertCommissionType(options, Guid.NewGuid(), CommissionEarningsType.EARNINGS_TYPE_ANNUAL_ANNUITY);

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);
            var client2 = TestHelper.InsertClient(options, user1.Organisation);

            var statement1 = TestHelper.InsertCommissionStatement(options, user1.Organisation);
            var statement2 = TestHelper.InsertCommissionStatement(options, user1.Organisation);

            var user3 = TestHelper.InsertUserDetailed(options);
            var client3 = TestHelper.InsertClient(options, user3.Organisation);
            var statement3 = TestHelper.InsertCommissionStatement(options, user3.Organisation);

            var usr1_policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = statement1.CompanyId,
                ClientId = client1.Client.Id,
                UserId = user1.User.Id
            };

            var usr2_policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = statement1.CompanyId,
                ClientId = client2.Client.Id,
                UserId = user2.User.Id
            };

            var usr3_policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = statement3.CompanyId,
                ClientId = client3.Client.Id,
                UserId = user3.User.Id
            };

            //Given
            var usr1_policy1_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr1_policy1.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 100,
                VAT = 10,
                CommissionStatementId = statement1.Id
            };

            var usr2_policy1_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 200,
                VAT = 20,
                CommissionStatementId = statement1.Id
            };

            var usr2_policy1_comm2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 300,
                VAT = 30,
                CommissionStatementId = statement1.Id
            };

            var usr2_policy1_comm3 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                CommissionTypeId = comTypeAnnual.Id,
                AmountIncludingVAT = 400,
                VAT = 40,
                CommissionStatementId = statement1.Id
            };

            var usr3_policy1_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr3_policy1.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 40,
                VAT = 400,
                CommissionStatementId = statement3.Id
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(usr1_policy1);
                context.Policy.Add(usr2_policy1);
                context.Policy.Add(usr3_policy1);

                context.Commission.Add(usr1_policy1_comm1);
                context.Commission.Add(usr2_policy1_comm1);
                context.Commission.Add(usr2_policy1_comm2);
                context.Commission.Add(usr2_policy1_comm3);
                context.Commission.Add(usr3_policy1_comm1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionReportService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new UserEarningsTypeMonthlyCommissionQueryOptions(scope, "", "", 0, 0);
                var records = await service.GetUserEarningsTypeMonthlyCommissionData(queryOptions);

                //Then
                Assert.Equal(3, records.TotalItems);
                Assert.Equal(3, records.Items.Count());

                var items = records.Items.ToList();
                var actual = items[0];
                Assert.Equal(user1.User.Id, actual.UserId);
                Assert.Equal(user1.User.FirstName, actual.UserFirstName);
                Assert.Equal(user1.User.LastName, actual.UserLastName);
                Assert.Equal(statement1.DateYear, actual.Year);
                Assert.Equal(statement1.DateMonth, actual.Month);
                Assert.Equal(CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY, actual.CommissionEarningsTypeId);
                Assert.Equal(100, actual.AmountIncludingVAT);

                actual = items[1];
                Assert.Equal(user2.User.Id, actual.UserId);
                Assert.Equal(user2.User.FirstName, actual.UserFirstName);
                Assert.Equal(user2.User.LastName, actual.UserLastName);
                Assert.Equal(statement1.DateYear, actual.Year);
                Assert.Equal(statement1.DateMonth, actual.Month);
                Assert.Equal(CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY, actual.CommissionEarningsTypeId);
                Assert.Equal(500, actual.AmountIncludingVAT); //200 + 300

                actual = items[2];
                Assert.Equal(user2.User.Id, actual.UserId);
                Assert.Equal(user2.User.FirstName, actual.UserFirstName);
                Assert.Equal(user2.User.LastName, actual.UserLastName);
                Assert.Equal(statement1.DateYear, actual.Year);
                Assert.Equal(statement1.DateMonth, actual.Month);
                Assert.Equal(CommissionEarningsType.EARNINGS_TYPE_ANNUAL_ANNUITY, actual.CommissionEarningsTypeId);
                Assert.Equal(400, actual.AmountIncludingVAT);

                //Check scope
                scope = TestHelper.GetScopeOptions(user3);
                queryOptions = new UserEarningsTypeMonthlyCommissionQueryOptions(scope, "", "", 0, 0);
                records = await service.GetUserEarningsTypeMonthlyCommissionData(queryOptions);

                Assert.Single(records.Items);

                items = records.Items.ToList();
                actual = items[0];
                Assert.Equal(user3.User.Id, actual.UserId);

            }
        }


        [Fact]
        public async Task GetUserEarningsTypeMonthlyCommissionData_YearMonthFilter()
        {
            var options = TestHelper.GetDbContext("GetUserEarningsTypeMonthlyCommissionData_YearMonthFilter");

            TestHelper.InsertCommissionEarningsTypes(options);

            var comTypeMonth = TestHelper.InsertCommissionType(options, Guid.NewGuid(), CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY);

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var now = DateTime.Now;
            var thisMonth = now;
            var lastMonth = now.AddMonths(-1);
            var lastYear = lastMonth.AddYears(-1);

            var statement1 = TestHelper.InsertCommissionStatement(options, user1.Organisation, null, thisMonth);
            var statement2 = TestHelper.InsertCommissionStatement(options, user1.Organisation, null, lastMonth);
            var statement3 = TestHelper.InsertCommissionStatement(options, user1.Organisation, null, lastYear);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = statement1.CompanyId,
                ClientId = client1.Client.Id,
                UserId = user1.User.Id
            };

            //Given
            var s1_com1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 100,
                VAT = 10,
                CommissionStatementId = statement1.Id
            };

            var s2_com1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 200,
                VAT = 20,
                CommissionStatementId = statement2.Id
            };

            var s2_com2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 300,
                VAT = 30,
                CommissionStatementId = statement2.Id
            };

            var s3_com1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 40,
                VAT = 400,
                CommissionStatementId = statement3.Id
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);

                context.Commission.Add(s1_com1);
                context.Commission.Add(s2_com1);
                context.Commission.Add(s2_com2);
                context.Commission.Add(s3_com1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionReportService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new UserEarningsTypeMonthlyCommissionQueryOptions(scope, "", "", 0, 0);
                queryOptions.Year = new List<int>() { lastMonth.Year };
                queryOptions.Month = new List<int>() { lastMonth.Month };
                var records = await service.GetUserEarningsTypeMonthlyCommissionData(queryOptions);

                //Then
                Assert.Equal(1, records.TotalItems);
                Assert.Single(records.Items);

                var items = records.Items.ToList();
                var actual = items[0];
                Assert.Equal(user1.User.Id, actual.UserId);
                Assert.Equal(user1.User.FirstName, actual.UserFirstName);
                Assert.Equal(user1.User.LastName, actual.UserLastName);
                Assert.Equal(statement2.DateYear, actual.Year);
                Assert.Equal(statement2.DateMonth, actual.Month);
                Assert.Equal(CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY, actual.CommissionEarningsTypeId);
                Assert.Equal(500, actual.AmountIncludingVAT); //200 + 300
            }
        }

        [Fact]
        public async Task GetUserEarningsTypeMonthlyCommissionData_UserFilter()
        {
            var options = TestHelper.GetDbContext("GetUserEarningsTypeMonthlyCommissionData_UserFilter");

            TestHelper.InsertCommissionEarningsTypes(options);

            var comTypeMonth = TestHelper.InsertCommissionType(options, Guid.NewGuid(), CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY);

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var statement1 = TestHelper.InsertCommissionStatement(options, user1.Organisation);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = statement1.CompanyId,
                ClientId = client1.Client.Id,
                UserId = user1.User.Id
            };

            var policy2 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = statement1.CompanyId,
                ClientId = client1.Client.Id,
                UserId = user2.User.Id
            };

            //Given
            var com1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 100,
                VAT = 10,
                CommissionStatementId = statement1.Id
            };

            var com2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy2.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 200,
                VAT = 20,
                CommissionStatementId = statement1.Id
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);
                context.Policy.Add(policy2);

                context.Commission.Add(com1);
                context.Commission.Add(com2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionReportService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new UserEarningsTypeMonthlyCommissionQueryOptions(scope, "", "", 0, 0);
                queryOptions.UserId.Add(user2.User.Id);
                var records = await service.GetUserEarningsTypeMonthlyCommissionData(queryOptions);

                //Then
                Assert.Equal(1, records.TotalItems);
                Assert.Single(records.Items);

                var items = records.Items.ToList();
                var actual = items[0];
                Assert.Equal(user2.User.Id, actual.UserId);
                Assert.Equal(user2.User.FirstName, actual.UserFirstName);
                Assert.Equal(user2.User.LastName, actual.UserLastName);
                Assert.Equal(statement1.DateYear, actual.Year);
                Assert.Equal(statement1.DateMonth, actual.Month);
                Assert.Equal(CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY, actual.CommissionEarningsTypeId);
                Assert.Equal(200, actual.AmountIncludingVAT);
            }
        }

        [Fact]
        public async Task GetUserCompanyMonthlyCommissionData_Basic()
        {
            var options = TestHelper.GetDbContext("GetUserCompanyMonthlyCommissionData_Basic");

            var companyId1 = Guid.NewGuid();
            var companyId2 = Guid.NewGuid();

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);
            var client2 = TestHelper.InsertClient(options, user1.Organisation);

            var statement1 = TestHelper.InsertCommissionStatement(options, user1.Organisation);
            var statement2 = TestHelper.InsertCommissionStatement(options, user1.Organisation);

            var user3 = TestHelper.InsertUserDetailed(options);
            var client3 = TestHelper.InsertClient(options, user3.Organisation);
            var statement3 = TestHelper.InsertCommissionStatement(options, user3.Organisation);

            var usr1_policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = statement1.CompanyId,
                ClientId = client1.Client.Id,
                UserId = user1.User.Id
            };

            var usr2_policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = statement2.CompanyId,
                ClientId = client2.Client.Id,
                UserId = user2.User.Id
            };

            var usr3_policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = statement3.CompanyId,
                ClientId = client3.Client.Id,
                UserId = user3.User.Id
            };

            //Given
            var usr1_policy1_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr1_policy1.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 100,
                VAT = 10,
                CommissionStatementId = statement1.Id
            };

            var usr2_policy1_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 200,
                VAT = 20,
                CommissionStatementId = statement2.Id
            };

            var usr2_policy1_comm2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 300,
                VAT = 30,
                CommissionStatementId = statement2.Id
            };

            var usr2_policy1_comm3 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 400,
                VAT = 40,
                CommissionStatementId = statement2.Id
            };

            var usr3_policy1_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr3_policy1.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 40,
                VAT = 400,
                CommissionStatementId = statement3.Id
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(usr1_policy1);
                context.Policy.Add(usr2_policy1);
                context.Policy.Add(usr3_policy1);

                context.Commission.Add(usr1_policy1_comm1);
                context.Commission.Add(usr2_policy1_comm1);
                context.Commission.Add(usr2_policy1_comm2);
                context.Commission.Add(usr2_policy1_comm3);
                context.Commission.Add(usr3_policy1_comm1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionReportService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new UserCompanyMonthlyCommissionQueryOptions(scope, "", "", 0, 0);
                var records = await service.GetUserCompanyMonthlyCommissionData(queryOptions);

                //Then
                Assert.Equal(2, records.TotalItems);
                Assert.Equal(2, records.Items.Count());

                var items = records.Items.ToList();
                var actual = items[0];
                Assert.Equal(user1.User.Id, actual.UserId);
                Assert.Equal(user1.User.FirstName, actual.UserFirstName);
                Assert.Equal(user1.User.LastName, actual.UserLastName);
                Assert.Equal(statement1.DateYear, actual.Year);
                Assert.Equal(statement1.DateMonth, actual.Month);
                Assert.Equal(statement1.CompanyId, actual.CompanyId);
                Assert.Equal(100, actual.AmountIncludingVAT);

                actual = items[1];
                Assert.Equal(user2.User.Id, actual.UserId);
                Assert.Equal(user2.User.FirstName, actual.UserFirstName);
                Assert.Equal(user2.User.LastName, actual.UserLastName);
                Assert.Equal(statement2.DateYear, actual.Year);
                Assert.Equal(statement2.DateMonth, actual.Month);
                Assert.Equal(statement2.CompanyId, actual.CompanyId);
                Assert.Equal(900, actual.AmountIncludingVAT); //200 + 300 + 400

                //Check scope
                scope = TestHelper.GetScopeOptions(user3);
                queryOptions = new UserCompanyMonthlyCommissionQueryOptions(scope, "", "", 0, 0);
                records = await service.GetUserCompanyMonthlyCommissionData(queryOptions);

                Assert.Single(records.Items);

                items = records.Items.ToList();
                actual = items[0];
                Assert.Equal(user3.User.Id, actual.UserId);

            }
        }
    }
}