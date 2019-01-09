using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Model.MemberPolicy;
using OneAdvisor.Service.Member;

namespace OneAdvisor.Service.Test.Member
{
    [TestClass]
    public class MemberPolicyServiceTest
    {
        [TestMethod]
        public async Task GetPolicies()
        {
            var options = TestHelper.GetDbContext("GetPolicies");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.User);
            var member2 = TestHelper.InsertDefaultMember(options, user1.User);

            var member3 = TestHelper.InsertDefaultMember(options);

            //Given
            var policy1 = new MemberPolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                Number = "123465"
            };

            var policy2 = new MemberPolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member2.Member.Id,
                Number = "654321"
            };

            //Different organisation, should be out of scope
            var policy3 = new MemberPolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member3.Member.Id,
                Number = "987654"
            };

            using (var context = new DataContext(options))
            {
                context.MemberPolicy.Add(policy1);
                context.MemberPolicy.Add(policy2);
                context.MemberPolicy.Add(policy3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberPolicyService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var queryOptions = new MemberPolicyQueryOptions(scopeOptions, "", "", 0, 0);
                var policies = await service.GetPolicies(queryOptions);

                //Then
                Assert.AreEqual(2, policies.TotalItems);
                Assert.AreEqual(2, policies.Items.Count());

                var actual = policies.Items.First();
                Assert.AreEqual(policy1.Id, actual.Id);
                Assert.AreEqual(policy1.MemberId, actual.MemberId);
                Assert.AreEqual(policy1.CompanyId, actual.CompanyId);
                Assert.AreEqual(policy1.Number, actual.Number);

                actual = policies.Items.Last();
                Assert.AreEqual(policy2.Id, actual.Id);
            }
        }

        [TestMethod]
        public async Task GetPolicy()
        {
            var options = TestHelper.GetDbContext("GetPolicy");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.User);

            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            //Given
            var policy1 = new MemberPolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                Number = "123465"
            };

            using (var context = new DataContext(options))
            {
                context.MemberPolicy.Add(policy1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberPolicyService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var actual = await service.GetPolicy(scopeOptions, policy1.Id);

                //Then
                Assert.AreEqual(policy1.Id, actual.Id);
                Assert.AreEqual(policy1.MemberId, actual.MemberId);
                Assert.AreEqual(policy1.CompanyId, actual.CompanyId);
                Assert.AreEqual(policy1.Number, actual.Number);

                //Out of scope 
                scopeOptions = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                actual = await service.GetPolicy(scopeOptions, policy1.Id);
                Assert.IsNull(actual);
            }
        }

        [TestMethod]
        public async Task GetPolicy_ByNumber()
        {
            var options = TestHelper.GetDbContext("GetPolicy_ByNumber");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.User);

            //Given
            var policy1 = new MemberPolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                Number = "123465"
            };

            using (var context = new DataContext(options))
            {
                context.MemberPolicy.Add(policy1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberPolicyService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var actual = await service.GetPolicy(scopeOptions, policy1.Number);

                //Then
                Assert.AreEqual(policy1.Id, actual.Id);
            }
        }

        [TestMethod]
        public async Task InsertPolicy()
        {
            var options = TestHelper.GetDbContext("InsertPolicy");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.User);

            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            //Given
            var policy1 = new MemberPolicyEdit
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                Number = "123465"
            };

            using (var context = new DataContext(options))
            {
                var service = new MemberPolicyService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = await service.InsertPolicy(scopeOptions, policy1);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.MemberPolicy.FindAsync(((MemberPolicyEdit)result.Tag).Id);
                Assert.AreEqual(policy1.Id, actual.Id);
                Assert.AreEqual(policy1.MemberId, actual.MemberId);
                Assert.AreEqual(policy1.CompanyId, actual.CompanyId);
                Assert.AreEqual(policy1.Number, actual.Number);

                //Out of scope 
                scopeOptions = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                result = await service.InsertPolicy(scopeOptions, policy1);
                Assert.IsFalse(result.Success);
                Assert.AreEqual(result.ValidationFailures.Single().ErrorMessage, "Member exists but is out of scope");
            }
        }

        [TestMethod]
        public async Task UpdatePolicy()
        {
            var options = TestHelper.GetDbContext("UpdatePolicy");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.User);

            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            //Given
            var policyEntity1 = new MemberPolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                Number = "123465"
            };

            using (var context = new DataContext(options))
            {
                context.MemberPolicy.Add(policyEntity1);

                context.SaveChanges();
            }

            var policy1 = new MemberPolicyEdit
            {
                Id = policyEntity1.Id,
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                Number = "528547"
            };

            using (var context = new DataContext(options))
            {
                var service = new MemberPolicyService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = await service.UpdatePolicy(scopeOptions, policy1);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.MemberPolicy.FindAsync(policyEntity1.Id);
                Assert.AreEqual(policy1.Id, actual.Id);
                Assert.AreEqual(policy1.MemberId, actual.MemberId);
                Assert.AreEqual(policy1.CompanyId, actual.CompanyId);
                Assert.AreEqual(policy1.Number, actual.Number);

                //Out of scope 
                scopeOptions = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                result = await service.UpdatePolicy(scopeOptions, policy1);
                Assert.IsFalse(result.Success);
                Assert.AreEqual(result.ValidationFailures.Single().ErrorMessage, "Member exists but is out of scope");
            }
        }
    }
}