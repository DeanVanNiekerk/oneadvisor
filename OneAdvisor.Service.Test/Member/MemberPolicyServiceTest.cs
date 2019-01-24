using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Model.Policy;
using OneAdvisor.Service.Member;

namespace OneAdvisor.Service.Test.Member
{
    [TestClass]
    public class PolicyServiceTest
    {

        [TestMethod]
        public async Task GetPolicies()
        {
            var options = TestHelper.GetDbContext("GetPolicies");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options, user1.Organisation);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);
            var member2 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var user3 = TestHelper.InsertDefaultUserDetailed(options);
            var member3 = TestHelper.InsertDefaultMember(options, user3.Organisation);

            //Given
            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user1.User.Id,
                Number = "123465",
                StartDate = DateTime.Now,
                Premium = 500,
                PolicyTypeId = Guid.NewGuid()
            };

            var policy2 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member2.Member.Id,
                UserId = user2.User.Id,
                Number = "654321",
                PolicyTypeId = Guid.NewGuid()
            };

            var policy3 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member3.Member.Id,
                UserId = user3.User.Id,
                Number = "987654"
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);
                context.Policy.Add(policy2);
                context.Policy.Add(policy3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new PolicyService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var queryOptions = new PolicyQueryOptions(scope, "", "", 0, 0);
                var policies = await service.GetPolicies(queryOptions);

                //Then
                Assert.AreEqual(2, policies.TotalItems);
                Assert.AreEqual(2, policies.Items.Count());

                var actual = policies.Items.First();
                Assert.AreEqual(policy1.Id, actual.Id);
                Assert.AreEqual(policy1.MemberId, actual.MemberId);
                Assert.AreEqual(policy1.CompanyId, actual.CompanyId);
                Assert.AreEqual(policy1.Number, actual.Number);
                Assert.AreEqual(policy1.StartDate, actual.StartDate);
                Assert.AreEqual(policy1.Premium, actual.Premium);
                Assert.AreEqual(policy1.PolicyTypeId, actual.PolicyTypeId);

                actual = policies.Items.Last();
                Assert.AreEqual(policy2.Id, actual.Id);

                //Check scope
                scope = TestHelper.GetScopeOptions(user1, Scope.User);
                queryOptions = new PolicyQueryOptions(scope, "", "", 0, 0);
                policies = await service.GetPolicies(queryOptions);

                Assert.AreEqual(1, policies.Items.Count());

                actual = policies.Items.First();
                Assert.AreEqual(policy1.Id, actual.Id);
            }
        }

        [TestMethod]
        public async Task GetPolicy()
        {
            var options = TestHelper.GetDbContext("GetPolicy");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            //Given
            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user1.User.Id,
                Number = "123465"
            };

            var policy2 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user1.User.Id,
                Number = "654987",
                StartDate = DateTime.Now,
                Premium = 500,
                PolicyTypeId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);
                context.Policy.Add(policy2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new PolicyService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var actual = await service.GetPolicy(scopeOptions, policy2.Id);

                //Then
                Assert.AreEqual(policy2.Id, actual.Id);
                Assert.AreEqual(policy2.MemberId, actual.MemberId);
                Assert.AreEqual(policy2.CompanyId, actual.CompanyId);
                Assert.AreEqual(policy2.UserId, actual.UserId);
                Assert.AreEqual(policy2.Number, actual.Number);
                Assert.AreEqual(policy2.StartDate, actual.StartDate);
                Assert.AreEqual(policy2.Premium, actual.Premium);
                Assert.AreEqual(policy2.PolicyTypeId, actual.PolicyTypeId);
            }
        }

        [TestMethod]
        public async Task GetPolicy_CheckScope()
        {
            var options = TestHelper.GetDbContext("GetPolicy_CheckScope");

            var org1 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "Org 1" };
            var org2 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "Org 2" };

            var branch1 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org1.Id, Name = "Branch 1" };
            var branch2 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org1.Id, Name = "Branch 2" };
            var branch3 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org2.Id, Name = "Branch 3" };

            var user1 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch1.Id };
            var user2 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch1.Id };
            var user3 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch2.Id };
            var user4 = new UserEntity { Id = Guid.NewGuid().ToString(), BranchId = branch3.Id };

            var member1 = new MemberEntity { Id = Guid.NewGuid(), OrganisationId = org1.Id };
            var member2 = new MemberEntity { Id = Guid.NewGuid(), OrganisationId = org2.Id };

            var policy1 = new PolicyEntity { Id = Guid.NewGuid(), MemberId = member1.Id, UserId = user1.Id };
            var policy2 = new PolicyEntity { Id = Guid.NewGuid(), MemberId = member1.Id, UserId = user2.Id };
            var policy3 = new PolicyEntity { Id = Guid.NewGuid(), MemberId = member1.Id, UserId = user3.Id };
            var policy4 = new PolicyEntity { Id = Guid.NewGuid(), MemberId = member2.Id, UserId = user4.Id };
            var policy5 = new PolicyEntity { Id = Guid.NewGuid(), MemberId = member1.Id, UserId = user1.Id };


            using (var context = new DataContext(options))
            {
                context.Organisation.Add(org1);

                context.Branch.Add(branch1);
                context.Branch.Add(branch2);

                context.User.Add(user1);
                context.User.Add(user2);
                context.User.Add(user3);

                context.Member.Add(member1);
                context.Member.Add(member2);

                context.Policy.Add(policy1);
                context.Policy.Add(policy2);
                context.Policy.Add(policy3);
                context.Policy.Add(policy4);
                context.Policy.Add(policy5);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new PolicyService(context);

                //When

                //In scope (org 1 -> policy 1)
                var scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.Organisation);
                var policy = await service.GetPolicy(scope, policy1.Id);
                Assert.AreEqual(policy1.Id, policy.Id);

                //In scope (org 1 -> policy 3)
                scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.Organisation);
                policy = await service.GetPolicy(scope, policy3.Id);
                Assert.AreEqual(policy3.Id, policy.Id);

                //Out of scope (org 2 -> policy 1)
                scope = new ScopeOptions(org2.Id, branch3.Id, user4.Id, Scope.Organisation);
                policy = await service.GetPolicy(scope, policy1.Id);
                Assert.IsNull(policy);

                //In scope (branch 1 -> policy 1)
                scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.Branch);
                policy = await service.GetPolicy(scope, policy1.Id);
                Assert.AreEqual(policy1.Id, policy.Id);

                //In scope (branch 1 -> policy 2)
                scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.Branch);
                policy = await service.GetPolicy(scope, policy2.Id);
                Assert.AreEqual(policy2.Id, policy.Id);

                //Out of scope (branch 2 -> policy 1)
                scope = new ScopeOptions(org1.Id, branch2.Id, user3.Id, Scope.Branch);
                policy = await service.GetPolicy(scope, policy1.Id);
                Assert.IsNull(policy);

                //Out of scope (branch 3 -> policy 1)
                scope = new ScopeOptions(org2.Id, branch3.Id, user4.Id, Scope.Branch);
                policy = await service.GetPolicy(scope, policy1.Id);
                Assert.IsNull(policy);

                //In scope (user 1 -> policy 1)
                scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.User);
                policy = await service.GetPolicy(scope, policy1.Id);
                Assert.AreEqual(policy1.Id, policy.Id);

                //Out of scope (user 2 -> policy 1)
                scope = new ScopeOptions(org1.Id, branch1.Id, user2.Id, Scope.User);
                policy = await service.GetPolicy(scope, policy1.Id);
                Assert.IsNull(policy);
            }
        }

        [TestMethod]
        public async Task GetPolicy_ByNumber()
        {
            var options = TestHelper.GetDbContext("GetPolicy_ByNumber");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            //Given
            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user1.User.Id,
                Number = "123465"
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new PolicyService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var actual = await service.GetPolicy(scopeOptions, member1.Member.Id, policy1.CompanyId, policy1.Number);

                //Then
                Assert.AreEqual(policy1.Id, actual.Id);
            }
        }



        [TestMethod]
        public async Task InsertPolicy()
        {
            var options = TestHelper.GetDbContext("InsertPolicy");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            //Given
            var policy1 = new PolicyEdit
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user1.User.Id,
                Number = "123465",
                StartDate = DateTime.Now,
                Premium = 500,
                PolicyTypeId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                var service = new PolicyService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = await service.InsertPolicy(scopeOptions, policy1);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Policy.FindAsync(((PolicyEdit)result.Tag).Id);
                Assert.AreEqual(policy1.Id, actual.Id);
                Assert.AreEqual(policy1.MemberId, actual.MemberId);
                Assert.AreEqual(policy1.CompanyId, actual.CompanyId);
                Assert.AreEqual(policy1.Number, actual.Number);
                Assert.AreEqual(policy1.StartDate, actual.StartDate);
                Assert.AreEqual(policy1.Premium, actual.Premium);
                Assert.AreEqual(policy1.PolicyTypeId, actual.PolicyTypeId);

                //Out of scope 
                scopeOptions = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                result = await service.InsertPolicy(scopeOptions, policy1);
                Assert.IsFalse(result.Success);
                Assert.AreEqual("Member does not exist", result.ValidationFailures.Single().ErrorMessage);
            }
        }

        [TestMethod]
        public async Task UpdatePolicy()
        {
            var options = TestHelper.GetDbContext("UpdatePolicy");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            //Given
            var policyEntity1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user1.User.Id,
                Number = "123465",
                StartDate = DateTime.Now,
                Premium = 500,
                PolicyTypeId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policyEntity1);

                context.SaveChanges();
            }

            var policy1 = new PolicyEdit
            {
                Id = policyEntity1.Id,
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user1.User.Id,
                Number = "528547",
                StartDate = DateTime.Now.AddDays(-10),
                Premium = 600,
                PolicyTypeId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                var service = new PolicyService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = await service.UpdatePolicy(scopeOptions, policy1);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Policy.FindAsync(policyEntity1.Id);
                Assert.AreEqual(policy1.Id, actual.Id);
                Assert.AreEqual(policy1.MemberId, actual.MemberId);
                Assert.AreEqual(policy1.CompanyId, actual.CompanyId);
                Assert.AreEqual(policy1.Number, actual.Number);
                Assert.AreEqual(policy1.StartDate, actual.StartDate);
                Assert.AreEqual(policy1.Premium, actual.Premium);
                Assert.AreEqual(policy1.PolicyTypeId, actual.PolicyTypeId);

                //Out of scope 
                scopeOptions = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                result = await service.UpdatePolicy(scopeOptions, policy1);
                Assert.IsFalse(result.Success);
                Assert.AreEqual("Member does not exist", result.ValidationFailures.Single().ErrorMessage);
            }
        }
    }
}