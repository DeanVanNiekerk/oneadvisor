using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Service.Commission;
using OneAdvisor.Data.Entities.Member;

namespace OneAdvisor.Service.Test.Commission
{
    [TestClass]
    public class CommissionServiceTest
    {

        [TestMethod]
        public async Task GetCommissions()
        {
            var options = TestHelper.GetDbContext("GetCommissions");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options, user1.Organisation);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);
            var member2 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var user3 = TestHelper.InsertDefaultUserDetailed(options);
            var member3 = TestHelper.InsertDefaultMember(options, user3.Organisation);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user1.User.Id
            };

            var policy2 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member2.Member.Id,
                UserId = user2.User.Id
            };

            var policy3 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member3.Member.Id,
                UserId = user3.User.Id
            };

            //Given
            var csId = Guid.NewGuid();
            var commission1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 100,
                VAT = 10,
                CommissionStatementId = csId
            };

            var commission2 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy2.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 200,
                VAT = 20,
                CommissionStatementId = csId
            };

            var commission3 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy2.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 300,
                VAT = 30,
                CommissionStatementId = csId
            };

            var commission4 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy3.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 40,
                VAT = 400,
                CommissionStatementId = Guid.NewGuid()
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
                var service = new CommissionService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var queryOptions = new CommissionQueryOptions(scope, "", "", 0, 0);
                var commissions = await service.GetCommissions(queryOptions);

                //Then
                Assert.AreEqual(3, commissions.TotalItems);
                Assert.AreEqual(3, commissions.Items.Count());

                Assert.AreEqual(200, commissions.AverageAmountIncludingVAT);
                Assert.AreEqual(20, commissions.AverageVAT);
                Assert.AreEqual(600, commissions.SumAmountIncludingVAT);
                Assert.AreEqual(60, commissions.SumVAT);

                var items = commissions.Items.ToList();
                var actual = items[0];
                Assert.AreEqual(commission1.Id, actual.Id);
                Assert.AreEqual(commission1.PolicyId, actual.PolicyId);
                Assert.AreEqual(commission1.CommissionTypeId, actual.CommissionTypeId);
                Assert.AreEqual(commission1.AmountIncludingVAT, actual.AmountIncludingVAT);
                Assert.AreEqual(commission1.VAT, actual.VAT);
                Assert.AreEqual(commission1.CommissionStatementId, actual.CommissionStatementId);

                actual = items[1];
                Assert.AreEqual(commission2.Id, actual.Id);

                actual = items[2];
                Assert.AreEqual(commission3.Id, actual.Id);

                //Check scope
                scope = TestHelper.GetScopeOptions(user1, Scope.User);
                queryOptions = new CommissionQueryOptions(scope, "", "", 0, 0);
                commissions = await service.GetCommissions(queryOptions);

                Assert.AreEqual(1, commissions.Items.Count());

                actual = commissions.Items.First();
                Assert.AreEqual(commission1.Id, actual.Id);
            }
        }

        [TestMethod]
        public async Task GetCommission()
        {
            var options = TestHelper.GetDbContext("GetCommission");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var user2 = TestHelper.InsertDefaultUserDetailed(options, user1.Organisation);

            var user3 = TestHelper.InsertDefaultUserDetailed(options);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user1.User.Id
            };


            var commission1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 99,
                VAT = 14,
                CommissionStatementId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);

                context.Commission.Add(commission1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var actual = await service.GetCommission(scope, commission1.Id);

                //Then
                Assert.AreEqual(commission1.Id, actual.Id);
                Assert.AreEqual(commission1.PolicyId, actual.PolicyId);
                Assert.AreEqual(commission1.CommissionTypeId, actual.CommissionTypeId);
                Assert.AreEqual(commission1.AmountIncludingVAT, actual.AmountIncludingVAT);
                Assert.AreEqual(commission1.VAT, actual.VAT);
                Assert.AreEqual(commission1.CommissionStatementId, actual.CommissionStatementId);

                //Check scope
                scope = TestHelper.GetScopeOptions(user2, Scope.User);
                actual = await service.GetCommission(scope, commission1.Id);
                Assert.IsNull(actual);

                scope = TestHelper.GetScopeOptions(user3, Scope.Organisation);
                actual = await service.GetCommission(scope, commission1.Id);
                Assert.IsNull(actual);
            }
        }

        [TestMethod]
        public async Task CommissionExists()
        {
            var options = TestHelper.GetDbContext("CommissionExists");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user1.User.Id
            };


            var commission1 = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 99,
                VAT = 14,
                CommissionStatementId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);

                context.Commission.Add(commission1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var actual = await service.CommissionExists(scope, commission1.CommissionStatementId, policy1.Number);
                Assert.IsTrue(actual);

                actual = await service.CommissionExists(scope, commission1.CommissionStatementId, "POL-1212");
                Assert.IsFalse(actual);

                //Check scope
                scope = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                actual = await service.CommissionExists(scope, commission1.CommissionStatementId, policy1.Number);
                Assert.IsFalse(actual);
            }
        }

        [TestMethod]
        public async Task InsertCommission()
        {
            var options = TestHelper.GetDbContext("InsertCommission");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var user2 = TestHelper.InsertDefaultUserDetailed(options, user1.Organisation);

            var user3 = TestHelper.InsertDefaultUserDetailed(options);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user1.User.Id
            };

            //Given
            var commission1 = new CommissionEdit
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 99,
                VAT = 14,
                CommissionStatementId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);
                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = await service.InsertCommission(scopeOptions, commission1);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Commission.FindAsync(((CommissionEdit)result.Tag).Id);
                Assert.AreEqual(commission1.Id, actual.Id);
                Assert.AreEqual(commission1.PolicyId, actual.PolicyId);
                Assert.AreEqual(commission1.CommissionTypeId, actual.CommissionTypeId);
                Assert.AreEqual(commission1.AmountIncludingVAT, actual.AmountIncludingVAT);
                Assert.AreEqual(commission1.VAT, actual.VAT);
                Assert.AreEqual(commission1.CommissionStatementId, actual.CommissionStatementId);

                //Out of scope 
                scopeOptions = TestHelper.GetScopeOptions(user2, Scope.User);
                result = await service.InsertCommission(scopeOptions, commission1);
                Assert.IsFalse(result.Success);
                Assert.AreEqual("Out of scope", result.ValidationFailures.Single().ErrorMessage);

                scopeOptions = TestHelper.GetScopeOptions(user3, Scope.Organisation);
                result = await service.InsertCommission(scopeOptions, commission1);
                Assert.IsFalse(result.Success);
            }
        }


        [TestMethod]
        public async Task UpdateCommission()
        {
            var options = TestHelper.GetDbContext("UpdateCommission");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var user2 = TestHelper.InsertDefaultUserDetailed(options, user1.Organisation);

            var user3 = TestHelper.InsertDefaultUserDetailed(options);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user1.User.Id
            };

            var commission = new CommissionEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 99,
                VAT = 14,
                CommissionStatementId = Guid.NewGuid()
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
                CommissionTypeId = Guid.NewGuid(),
                AmountIncludingVAT = 109,
                VAT = 15,
                CommissionStatementId = commission.CommissionStatementId
            };

            using (var context = new DataContext(options))
            {
                var service = new CommissionService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = await service.UpdateCommission(scopeOptions, commission1);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Commission.FindAsync(commission.Id);
                Assert.AreEqual(commission1.Id, actual.Id);
                Assert.AreEqual(commission1.PolicyId, actual.PolicyId);
                Assert.AreEqual(commission1.CommissionTypeId, actual.CommissionTypeId);
                Assert.AreEqual(commission1.AmountIncludingVAT, actual.AmountIncludingVAT);
                Assert.AreEqual(commission1.VAT, actual.VAT);
                Assert.AreEqual(commission1.CommissionStatementId, actual.CommissionStatementId);

                //Out of scope 
                scopeOptions = TestHelper.GetScopeOptions(user2, Scope.User);
                result = await service.UpdateCommission(scopeOptions, commission1);
                Assert.IsFalse(result.Success);
                Assert.AreEqual("Out of scope", result.ValidationFailures.Single().ErrorMessage);

                scopeOptions = TestHelper.GetScopeOptions(user3, Scope.Organisation);
                result = await service.UpdateCommission(scopeOptions, commission1);
                Assert.IsFalse(result.Success);
            }
        }
    }
}