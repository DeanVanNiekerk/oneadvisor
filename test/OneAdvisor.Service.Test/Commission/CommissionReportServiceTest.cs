using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Service.Commission;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Commission.Model.Lookup;
using OneAdvisor.Model.Commission.Model.CommissionReport;

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
                UserId = user1.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 110,
                VAT = 10,
                CommissionStatementId = statement1.Id
            };

            var usr2_policy1_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                UserId = user2.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 220,
                VAT = 20,
                CommissionStatementId = statement1.Id
            };

            var usr2_policy1_comm2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                UserId = user2.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 330,
                VAT = 30,
                CommissionStatementId = statement1.Id
            };

            var usr2_policy1_comm3 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                UserId = user2.User.Id,
                CommissionTypeId = comTypeAnnual.Id,
                AmountIncludingVAT = 440,
                VAT = 40,
                CommissionStatementId = statement1.Id
            };

            var usr3_policy1_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr3_policy1.Id,
                UserId = user3.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 550,
                VAT = 50,
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
                var items = (await service.GetUserEarningsTypeMonthlyCommissionData(queryOptions)).ToList();

                //Then
                Assert.Equal(2, items.Count());

                var actual = items[0];
                Assert.Equal(CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY, actual.CommissionEarningsTypeId);
                Assert.Equal(600, actual.AmountExcludingVAT); //100 + 200 + 300

                actual = items[1];
                Assert.Equal(CommissionEarningsType.EARNINGS_TYPE_ANNUAL_ANNUITY, actual.CommissionEarningsTypeId);
                Assert.Equal(400, actual.AmountExcludingVAT);

                //Check scope
                scope = TestHelper.GetScopeOptions(user3);
                queryOptions = new UserEarningsTypeMonthlyCommissionQueryOptions(scope, "", "", 0, 0);
                items = (await service.GetUserEarningsTypeMonthlyCommissionData(queryOptions)).ToList();

                Assert.Single(items);

                actual = items[0];
                Assert.Equal(CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY, actual.CommissionEarningsTypeId);
                Assert.Equal(500, actual.AmountExcludingVAT);
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
                UserId = user1.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 110,
                VAT = 10,
                CommissionStatementId = statement1.Id
            };

            var s2_com1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                UserId = user1.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 220,
                VAT = 20,
                CommissionStatementId = statement2.Id
            };

            var s2_com2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                UserId = user1.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 330,
                VAT = 30,
                CommissionStatementId = statement2.Id
            };

            var s3_com1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                UserId = user1.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 440,
                VAT = 40,
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
                queryOptions.StartDate = new DateTime(lastMonth.Year, lastMonth.Month, 1);
                queryOptions.EndDate = lastMonth.AddMonths(1).AddDays(-1);
                var items = (await service.GetUserEarningsTypeMonthlyCommissionData(queryOptions)).ToList();

                //Then
                Assert.Single(items);

                var actual = items[0];
                Assert.Equal(CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY, actual.CommissionEarningsTypeId);
                Assert.Equal(500, actual.AmountExcludingVAT); //200 + 300
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
                UserId = user1.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 110,
                VAT = 10,
                CommissionStatementId = statement1.Id
            };

            var com2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy2.Id,
                UserId = user2.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 220,
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
                var items = (await service.GetUserEarningsTypeMonthlyCommissionData(queryOptions)).ToList();

                //Then
                Assert.Single(items);

                var actual = items[0];
                Assert.Equal(CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY, actual.CommissionEarningsTypeId);
                Assert.Equal(200, actual.AmountExcludingVAT);
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
                UserId = user1.User.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 110,
                VAT = 10,
                CommissionStatementId = statement1.Id
            };

            var usr2_policy1_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                UserId = user2.User.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 220,
                VAT = 20,
                CommissionStatementId = statement2.Id
            };

            var usr2_policy1_comm2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                UserId = user2.User.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 330,
                VAT = 30,
                CommissionStatementId = statement2.Id
            };

            var usr2_policy1_comm3 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                UserId = user2.User.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 440,
                VAT = 40,
                CommissionStatementId = statement2.Id
            };

            var usr3_policy1_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr3_policy1.Id,
                UserId = user3.User.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 550,
                VAT = 50,
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
                var items = (await service.GetUserCompanyMonthlyCommissionData(queryOptions)).ToList();

                //Then
                Assert.Equal(2, items.Count());

                var actual = items[0];
                Assert.Equal(statement1.CompanyId, actual.CompanyId);
                Assert.Equal(100, actual.AmountExcludingVAT);

                actual = items[1];
                Assert.Equal(statement2.CompanyId, actual.CompanyId);
                Assert.Equal(900, actual.AmountExcludingVAT); //200 + 300 + 400

                //Check scope
                scope = TestHelper.GetScopeOptions(user3);
                queryOptions = new UserCompanyMonthlyCommissionQueryOptions(scope, "", "", 0, 0);
                items = (await service.GetUserCompanyMonthlyCommissionData(queryOptions)).ToList();

                //Then
                Assert.Single(items);

                actual = items[0];
                Assert.Equal(500, actual.AmountExcludingVAT);
            }
        }

        [Fact]
        public async Task GetUserCompanyMonthlyCommissionData_UserFilter()
        {
            var options = TestHelper.GetDbContext("GetUserCompanyMonthlyCommissionData_UserFilter");

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
                UserId = user1.User.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 110,
                VAT = 10,
                CommissionStatementId = statement1.Id
            };

            var usr2_policy1_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                UserId = user2.User.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 220,
                VAT = 20,
                CommissionStatementId = statement2.Id
            };

            var usr2_policy1_comm2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                UserId = user2.User.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 330,
                VAT = 30,
                CommissionStatementId = statement2.Id
            };

            var usr2_policy1_comm3 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                UserId = user2.User.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 440,
                VAT = 40,
                CommissionStatementId = statement2.Id
            };

            var usr3_policy1_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr3_policy1.Id,
                UserId = user3.User.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 550,
                VAT = 50,
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
                queryOptions.UserId.Add(user2.User.Id);
                var items = (await service.GetUserCompanyMonthlyCommissionData(queryOptions)).ToList();

                //Then
                Assert.Single(items);

                var actual = items[0];
                Assert.Equal(statement2.CompanyId, actual.CompanyId);
                Assert.Equal(900, actual.AmountExcludingVAT); //200 + 300 + 400
            }
        }

        [Fact]
        public async Task GetPastRevenueCommissionData_Basic()
        {
            var options = TestHelper.GetDbContext("GetPastRevenueCommissionData_Basic");

            TestHelper.InsertCommissionEarningsTypes(options);

            var comTypeMonth = TestHelper.InsertCommissionType(options, Guid.NewGuid(), CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY);
            var comTypeAnnual = TestHelper.InsertCommissionType(options, Guid.NewGuid(), CommissionEarningsType.EARNINGS_TYPE_ANNUAL_ANNUITY);

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);
            var client2 = TestHelper.InsertClient(options, user1.Organisation);

            var policyTypeId1 = Guid.NewGuid();
            var policyTypeId2 = Guid.NewGuid();

            var statement1 = TestHelper.InsertCommissionStatement(options, user1.Organisation);
            var statement2 = TestHelper.InsertCommissionStatement(options, user1.Organisation);
            var statement4 = TestHelper.InsertCommissionStatement(options, user1.Organisation, statement1.CompanyId, statement1.Date.AddMonths(-1));

            var user3 = TestHelper.InsertUserDetailed(options);
            var client3 = TestHelper.InsertClient(options, user3.Organisation);
            var statement3 = TestHelper.InsertCommissionStatement(options, user3.Organisation);

            var usr1_policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = statement1.CompanyId,
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                PolicyTypeId = policyTypeId1,
            };

            var usr2_policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = statement1.CompanyId,
                ClientId = client2.Client.Id,
                UserId = user2.User.Id,
                PolicyTypeId = policyTypeId1,
            };

            var usr2_policy2 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = statement1.CompanyId,
                ClientId = client2.Client.Id,
                UserId = user2.User.Id,
                PolicyTypeId = policyTypeId2,
            };

            var usr3_policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = statement3.CompanyId,
                ClientId = client3.Client.Id,
                UserId = user3.User.Id,
                PolicyTypeId = policyTypeId1,
            };

            //Given
            var usr1_policy1_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr1_policy1.Id,
                UserId = user1.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 110,
                VAT = 10,
                CommissionStatementId = statement1.Id
            };

            var usr2_policy1_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                UserId = user2.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 220,
                VAT = 20,
                CommissionStatementId = statement1.Id
            };

            var usr2_policy1_comm2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                UserId = user2.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 330,
                VAT = 30,
                CommissionStatementId = statement1.Id
            };

            var usr2_policy1_comm3 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                UserId = user2.User.Id,
                CommissionTypeId = comTypeAnnual.Id,
                AmountIncludingVAT = 440,
                VAT = 40,
                CommissionStatementId = statement1.Id
            };

            var usr2_policy1_comm4 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                UserId = user2.User.Id,
                CommissionTypeId = comTypeAnnual.Id,
                AmountIncludingVAT = 660,
                VAT = 60,
                CommissionStatementId = statement4.Id
            };

            var usr2_policy2_comm5 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy2.Id,
                UserId = user2.User.Id,
                CommissionTypeId = comTypeAnnual.Id,
                AmountIncludingVAT = 770,
                VAT = 70,
                CommissionStatementId = statement4.Id
            };

            var usr3_policy1_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr3_policy1.Id,
                UserId = user3.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 550,
                VAT = 50,
                CommissionStatementId = statement3.Id
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(usr1_policy1);
                context.Policy.Add(usr2_policy1);
                context.Policy.Add(usr3_policy1);
                context.Policy.Add(usr2_policy2);

                context.Commission.Add(usr1_policy1_comm1);
                context.Commission.Add(usr2_policy1_comm1);
                context.Commission.Add(usr2_policy1_comm2);
                context.Commission.Add(usr2_policy1_comm3);
                context.Commission.Add(usr3_policy1_comm1);
                context.Commission.Add(usr2_policy1_comm4);
                context.Commission.Add(usr2_policy2_comm5);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionReportService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new PastRevenueCommissionQueryOptions(scope, "", "", 0, 0);
                var items = (await service.GetPastRevenueCommissionData(queryOptions)).ToList();

                //Then
                Assert.Equal(4, items.Count());

                var actual = items[0];
                Assert.Equal(CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY, actual.CommissionEarningsTypeId);
                Assert.Equal(statement1.CompanyId, actual.CompanyId);
                Assert.Equal(policyTypeId1, actual.PolicyTypeId);
                Assert.Equal(statement1.DateYear, actual.DateYear);
                Assert.Equal(statement1.DateMonth, actual.DateMonth);
                Assert.Equal(600, actual.AmountExcludingVAT); //100 + 200 + 300

                actual = items[1];
                Assert.Equal(CommissionEarningsType.EARNINGS_TYPE_ANNUAL_ANNUITY, actual.CommissionEarningsTypeId);
                Assert.Equal(statement1.CompanyId, actual.CompanyId);
                Assert.Equal(policyTypeId1, actual.PolicyTypeId);
                Assert.Equal(statement1.DateYear, actual.DateYear);
                Assert.Equal(statement1.DateMonth, actual.DateMonth);
                Assert.Equal(400, actual.AmountExcludingVAT);

                actual = items[2];
                Assert.Equal(CommissionEarningsType.EARNINGS_TYPE_ANNUAL_ANNUITY, actual.CommissionEarningsTypeId);
                Assert.Equal(statement4.CompanyId, actual.CompanyId);
                Assert.Equal(policyTypeId1, actual.PolicyTypeId);
                Assert.Equal(statement4.DateYear, actual.DateYear);
                Assert.Equal(statement4.DateMonth, actual.DateMonth);
                Assert.Equal(600, actual.AmountExcludingVAT);

                actual = items[3];
                Assert.Equal(CommissionEarningsType.EARNINGS_TYPE_ANNUAL_ANNUITY, actual.CommissionEarningsTypeId);
                Assert.Equal(statement4.CompanyId, actual.CompanyId);
                Assert.Equal(policyTypeId2, actual.PolicyTypeId);
                Assert.Equal(statement4.DateYear, actual.DateYear);
                Assert.Equal(statement4.DateMonth, actual.DateMonth);
                Assert.Equal(700, actual.AmountExcludingVAT);

                //Check scope
                scope = TestHelper.GetScopeOptions(user3);
                queryOptions = new PastRevenueCommissionQueryOptions(scope, "", "", 0, 0);
                items = (await service.GetPastRevenueCommissionData(queryOptions)).ToList();

                Assert.Single(items);

                actual = items[0];
                Assert.Equal(CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY, actual.CommissionEarningsTypeId);
                Assert.Equal(500, actual.AmountExcludingVAT);
            }
        }

        [Fact]
        public async Task GetCommissionLapseData_Basic()
        {
            var options = TestHelper.GetDbContext("GetCommissionLapseData_Basic");

            TestHelper.InsertCommissionEarningsTypes(options);

            var comTypeMonth = TestHelper.InsertCommissionType(options, Guid.NewGuid(), CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY);
            var company = TestHelper.InsertCompany(options);

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var now = DateTime.UtcNow;
            var lastMonth = DateTime.UtcNow.AddMonths(-1);
            var twoMonthsAgo = DateTime.UtcNow.AddMonths(-2);

            var statement1 = TestHelper.InsertCommissionStatement(options, user1.Organisation, company.Id, now);
            var statement2 = TestHelper.InsertCommissionStatement(options, user1.Organisation, company.Id, lastMonth);
            var statement4 = TestHelper.InsertCommissionStatement(options, user1.Organisation, company.Id, twoMonthsAgo);

            var user2 = TestHelper.InsertUserDetailed(options);
            var client2 = TestHelper.InsertClient(options, user2.Organisation);
            var statement3 = TestHelper.InsertCommissionStatement(options, user2.Organisation, company.Id, lastMonth);

            var usr1_policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = company.Id,
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                PolicyTypeId = Guid.NewGuid(),
            };

            var usr1_policy2 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = company.Id,
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                PolicyTypeId = Guid.NewGuid(),
            };

            var usr2_policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = company.Id,
                ClientId = client2.Client.Id,
                UserId = user2.User.Id,
                PolicyTypeId = Guid.NewGuid(),
            };

            //This month commmission
            var usr1_policy1_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr1_policy1.Id,
                UserId = user1.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 110,
                VAT = 10,
                CommissionStatementId = statement1.Id
            };

            //Last month Commission
            var usr1_policy1_comm2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr1_policy1.Id,
                UserId = user1.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 220,
                VAT = 20,
                CommissionStatementId = statement2.Id
            };

            var usr1_policy2_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr1_policy2.Id,
                UserId = user1.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 330,
                VAT = 30,
                CommissionStatementId = statement2.Id
            };

            //Two months ago commission
            var usr1_policy2_comm2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr1_policy2.Id,
                UserId = user1.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 440,
                VAT = 40,
                CommissionStatementId = statement4.Id
            };

            //Last month commission - different company
            var usr2_policy1_comm1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = usr2_policy1.Id,
                UserId = user2.User.Id,
                CommissionTypeId = comTypeMonth.Id,
                AmountIncludingVAT = 660,
                VAT = 60,
                CommissionStatementId = statement3.Id
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(usr1_policy1);
                context.Policy.Add(usr1_policy2);
                context.Policy.Add(usr2_policy1);

                context.Commission.Add(usr1_policy1_comm1);
                context.Commission.Add(usr1_policy1_comm2);
                context.Commission.Add(usr1_policy2_comm1);
                context.Commission.Add(usr1_policy2_comm2);
                context.Commission.Add(usr2_policy1_comm1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionReportService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new CommissionLapseQueryOptions(scope, "", "", 0, 0);
                var result = await service.GetCommissionLapseData(queryOptions);

                //Then
                var items = result.Items.ToList();
                Assert.Single(items);

                var actual = items[0];
                Assert.Equal(usr1_policy2.Id, actual.PolicyId);
                Assert.Equal(client1.Client.Id, actual.ClientId);
                Assert.Equal(usr1_policy2.Number, actual.Number);
                Assert.Equal(usr1_policy2.CompanyId, actual.CompanyId);
                Assert.Equal(usr1_policy2.UserId, actual.UserId);
                Assert.Equal(usr1_policy2.Premium, actual.Premium);
                Assert.Equal(usr1_policy2.StartDate, actual.StartDate);
                Assert.Equal(usr1_policy2.PolicyTypeId, actual.PolicyTypeId);
                Assert.Equal(client1.Client.LastName, actual.ClientLastName);
                Assert.Equal(client1.Client.Initials, actual.ClientInitials);
                Assert.Equal(company.Name, actual.CompanyName);

                //Check scope
                scope = TestHelper.GetScopeOptions(user2);
                queryOptions = new CommissionLapseQueryOptions(scope, "", "", 0, 0);
                result = (await service.GetCommissionLapseData(queryOptions));

                items = result.Items.ToList();

                Assert.Single(items);

                actual = items[0];
                Assert.Equal(usr2_policy1.Id, actual.PolicyId);
            }
        }
    }
}