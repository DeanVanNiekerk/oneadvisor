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
using OneAdvisor.Service.Directory;
using OneAdvisor.Service.Test.Directory.Mocks;

namespace OneAdvisor.Service.Test.Commission
{

    public class CommissionServiceTest
    {

        [Fact]
        public async Task GetCommissions()
        {
            var options = TestHelper.GetDbContext("GetCommissions");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);
            var client2 = TestHelper.InsertClient(options, user1.Organisation);

            var user3 = TestHelper.InsertUserDetailed(options);
            var client3 = TestHelper.InsertClient(options, user3.Organisation);

            var statement1 = TestHelper.InsertCommissionStatement(options, user1.Organisation);
            var statement2 = TestHelper.InsertCommissionStatement(options, user1.Organisation);

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
                CompanyId = statement1.CompanyId,
                ClientId = client2.Client.Id,
                UserId = user2.User.Id
            };

            var policy3 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = statement1.CompanyId,
                ClientId = client3.Client.Id,
                UserId = user3.User.Id
            };

            //Given
            var commission1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 100,
                VAT = 10,
                CommissionStatementId = statement1.Id,
                UserId = user1.User.Id,
            };

            var commission2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy2.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 200,
                VAT = 20,
                CommissionStatementId = statement1.Id,
                UserId = user2.User.Id,
            };

            var commission3 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy2.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 300,
                VAT = 30,
                CommissionStatementId = statement1.Id,
                UserId = user2.User.Id,
            };

            var commission4 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy3.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 40,
                VAT = 400,
                CommissionStatementId = statement2.Id,
                UserId = user3.User.Id,
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);
                context.Policy.Add(policy2);
                context.Policy.Add(policy3);

                context.Commission.Add(commission1);
                context.Commission.Add(commission2);
                context.Commission.Add(commission3);
                context.Commission.Add(commission4);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var service = new CommissionService(context, auditService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new CommissionQueryOptions(scope, "", "", 0, 0);
                var commissions = await service.GetCommissions(queryOptions);

                //Then
                Assert.Equal(3, commissions.TotalItems);
                Assert.Equal(3, commissions.Items.Count());

                Assert.Equal(600, commissions.SumAmountIncludingVAT);
                Assert.Equal(60, commissions.SumVAT);

                var items = commissions.Items.ToList();
                var actual = items[0];
                Assert.Equal(commission1.Id, actual.Id);
                Assert.Equal(commission1.PolicyId, actual.PolicyId);
                Assert.Equal(commission1.CommissionTypeId, actual.CommissionTypeId);
                Assert.Equal(commission1.AmountIncludingVAT, actual.AmountIncludingVAT);
                Assert.Equal(commission1.VAT, actual.VAT);
                Assert.Equal(commission1.CommissionStatementId, actual.CommissionStatementId);
                Assert.Equal(policy1.Number, actual.PolicyNumber);

                Assert.Equal(statement1.Date, actual.CommissionStatementDate);
                Assert.Equal(client1.Client.LastName, actual.PolicyClientLastName);
                Assert.Equal(client1.Client.Initials, actual.PolicyClientInitials);
                Assert.Equal(client1.Client.DateOfBirth, actual.PolicyClientDateOfBirth);
                Assert.Equal(statement1.CompanyId, actual.PolicyCompanyId);

                actual = items[1];
                Assert.Equal(commission2.Id, actual.Id);

                actual = items[2];
                Assert.Equal(commission3.Id, actual.Id);

                //Check scope
                scope = TestHelper.GetScopeOptions(user1, Scope.User);
                queryOptions = new CommissionQueryOptions(scope, "", "", 0, 0);
                commissions = await service.GetCommissions(queryOptions);

                Assert.Single(commissions.Items);

                actual = commissions.Items.First();
                Assert.Equal(commission1.Id, actual.Id);
            }
        }

        [Fact]
        public async Task GetCommission()
        {
            var options = TestHelper.GetDbContext("GetCommission");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);

            var user3 = TestHelper.InsertUserDetailed(options);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id
            };


            var commission1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 99,
                VAT = 14,
                CommissionStatementId = Guid.NewGuid(),
                SourceData = new Model.Commission.Model.ImportCommission.ImportCommission()
                {
                    PolicyNumber = "123",
                    AmountIncludingVAT = "50",
                    VAT = "10"
                }
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);

                context.Commission.Add(commission1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var service = new CommissionService(context, auditService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetCommission(scope, commission1.Id);

                //Then
                Assert.Equal(commission1.Id, actual.Id);
                Assert.Equal(commission1.PolicyId, actual.PolicyId);
                Assert.Equal(commission1.CommissionTypeId, actual.CommissionTypeId);
                Assert.Equal(commission1.AmountIncludingVAT, actual.AmountIncludingVAT);
                Assert.Equal(commission1.VAT, actual.VAT);
                Assert.Equal(commission1.CommissionStatementId, actual.CommissionStatementId);
                Assert.Equal(commission1.SourceData, actual.SourceData);

                //Check scope
                scope = TestHelper.GetScopeOptions(user2, Scope.User);
                actual = await service.GetCommission(scope, commission1.Id);
                Assert.Null(actual);

                scope = TestHelper.GetScopeOptions(user3, Scope.Organisation);
                actual = await service.GetCommission(scope, commission1.Id);
                Assert.Null(actual);
            }
        }

        [Fact]
        public async Task InsertCommission()
        {
            var options = TestHelper.GetDbContext("InsertCommission");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);

            var user3 = TestHelper.InsertUserDetailed(options);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id
            };

            //Given
            var commission1 = new CommissionEdit
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                UserId = policy1.UserId,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 99,
                VAT = 14,
                CommissionStatementId = Guid.NewGuid(),
                SourceData = new Model.Commission.Model.ImportCommission.ImportCommission()
                {
                    PolicyNumber = "123",
                    AmountIncludingVAT = "50",
                    VAT = "10"
                }
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);
                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var service = new CommissionService(context, auditService);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1);
                var result = await service.InsertCommission(scopeOptions, commission1);

                //Then
                Assert.True(result.Success);

                var actual = await context.Commission.FindAsync(((CommissionEdit)result.Tag).Id);
                Assert.Equal(commission1.Id, actual.Id);
                Assert.Equal(commission1.PolicyId, actual.PolicyId);
                Assert.Equal(commission1.CommissionTypeId, actual.CommissionTypeId);
                Assert.Equal(commission1.AmountIncludingVAT, actual.AmountIncludingVAT);
                Assert.Equal(commission1.VAT, actual.VAT);
                Assert.Equal(commission1.CommissionStatementId, actual.CommissionStatementId);
                Assert.Equal(commission1.SourceData, actual.SourceData);

                //Out of scope 
                scopeOptions = TestHelper.GetScopeOptions(user2, Scope.User);
                result = await service.InsertCommission(scopeOptions, commission1);
                Assert.False(result.Success);

                scopeOptions = TestHelper.GetScopeOptions(user3, Scope.Organisation);
                result = await service.InsertCommission(scopeOptions, commission1);
                Assert.False(result.Success);
            }
        }


        [Fact]
        public async Task UpdateCommission()
        {
            var options = TestHelper.GetDbContext("UpdateCommission");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);

            var user3 = TestHelper.InsertUserDetailed(options);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id
            };

            var commission = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                UserId = policy1.UserId,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 99,
                VAT = 14,
                CommissionStatementId = Guid.NewGuid(),
                SourceData = new Model.Commission.Model.ImportCommission.ImportCommission()
                {
                    PolicyNumber = "123",
                    AmountIncludingVAT = "50",
                    VAT = "10"
                }
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);
                context.Commission.Add(commission);

                context.SaveChanges();
            }

            var commission1 = new CommissionEdit
            {
                Id = commission.Id,
                PolicyId = policy1.Id,
                UserId = policy1.UserId,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 109,
                VAT = 15,
                CommissionStatementId = commission.CommissionStatementId,
                SourceData = new Model.Commission.Model.ImportCommission.ImportCommission()
                {
                    PolicyNumber = "123",
                    AmountIncludingVAT = "55",
                    VAT = "11"
                }
            };

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var service = new CommissionService(context, auditService);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1);
                var result = await service.UpdateCommission(scopeOptions, commission1);

                //Then
                Assert.True(result.Success);

                var actual = await context.Commission.FindAsync(commission.Id);
                Assert.Equal(commission1.Id, actual.Id);
                Assert.Equal(commission1.PolicyId, actual.PolicyId);
                Assert.Equal(commission1.CommissionTypeId, actual.CommissionTypeId);
                Assert.Equal(commission1.AmountIncludingVAT, actual.AmountIncludingVAT);
                Assert.Equal(commission1.VAT, actual.VAT);
                Assert.Equal(commission1.CommissionStatementId, actual.CommissionStatementId);
                Assert.Equal(commission1.SourceData, actual.SourceData);

                //Out of scope 
                scopeOptions = TestHelper.GetScopeOptions(user2, Scope.User);
                result = await service.UpdateCommission(scopeOptions, commission1);
                Assert.False(result.Success);

                scopeOptions = TestHelper.GetScopeOptions(user3, Scope.Organisation);
                result = await service.UpdateCommission(scopeOptions, commission1);
                Assert.False(result.Success);
            }
        }


    }
}