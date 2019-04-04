using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Client.Model.Policy;
using OneAdvisor.Service.Client;

namespace OneAdvisor.Service.Test.Client
{

    public class PolicyServiceTest
    {

        [Fact]
        public async Task GetPolicies()
        {
            var options = TestHelper.GetDbContext("GetPolicies");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);
            var client2 = TestHelper.InsertClient(options, user1.Organisation);

            var user3 = TestHelper.InsertUserDetailed(options);
            var client3 = TestHelper.InsertClient(options, user3.Organisation);

            //Given
            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                Number = "123465",
                StartDate = DateTime.Now,
                Premium = 500,
                PolicyTypeId = Guid.NewGuid(),
                PolicyProductTypeId = Guid.NewGuid(),
                PolicyProductId = Guid.NewGuid()
            };

            var policy2 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client2.Client.Id,
                UserId = user2.User.Id,
                Number = "654321",
                PolicyTypeId = Guid.NewGuid(),
                PolicyProductTypeId = Guid.NewGuid(),
                PolicyProductId = Guid.NewGuid()
            };

            var policy3 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client3.Client.Id,
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
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new PolicyQueryOptions(scope, "", "", 0, 0);
                var policies = await service.GetPolicies(queryOptions);

                //Then
                Assert.Equal(2, policies.TotalItems);
                Assert.Equal(2, policies.Items.Count());

                var actual = policies.Items.First();
                Assert.Equal(policy1.Id, actual.Id);
                Assert.Equal(policy1.ClientId, actual.ClientId);
                Assert.Equal(policy1.CompanyId, actual.CompanyId);
                Assert.Equal(policy1.Number, actual.Number);
                Assert.Equal(policy1.StartDate, actual.StartDate);
                Assert.Equal(policy1.Premium, actual.Premium);
                Assert.Equal(policy1.PolicyTypeId, actual.PolicyTypeId);
                Assert.Equal(policy1.PolicyProductTypeId, actual.PolicyProductTypeId);
                Assert.Equal(policy1.PolicyProductId, actual.PolicyProductId);

                actual = policies.Items.Last();
                Assert.Equal(policy2.Id, actual.Id);

                //Check scope
                scope = TestHelper.GetScopeOptions(user1, Scope.User);
                queryOptions = new PolicyQueryOptions(scope, "", "", 0, 0);
                policies = await service.GetPolicies(queryOptions);

                Assert.Single(policies.Items);

                actual = policies.Items.First();
                Assert.Equal(policy1.Id, actual.Id);
            }
        }

        [Fact]
        public async Task GetPolicy()
        {
            var options = TestHelper.GetDbContext("GetPolicy");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            //Given
            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                Number = "123465"
            };

            var policy2 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                Number = "654987",
                StartDate = DateTime.Now,
                Premium = 500,
                PolicyTypeId = Guid.NewGuid(),
                PolicyProductTypeId = Guid.NewGuid(),
                PolicyProductId = Guid.NewGuid()
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
                var scopeOptions = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetPolicy(scopeOptions, policy2.Id);

                //Then
                Assert.Equal(policy2.Id, actual.Id);
                Assert.Equal(policy2.ClientId, actual.ClientId);
                Assert.Equal(policy2.CompanyId, actual.CompanyId);
                Assert.Equal(policy2.UserId, actual.UserId);
                Assert.Equal(policy2.Number, actual.Number);
                Assert.Equal(policy2.StartDate, actual.StartDate);
                Assert.Equal(policy2.Premium, actual.Premium);
                Assert.Equal(policy2.PolicyTypeId, actual.PolicyTypeId);
                Assert.Equal(policy2.PolicyProductTypeId, actual.PolicyProductTypeId);
                Assert.Equal(policy2.PolicyProductId, actual.PolicyProductId);
            }
        }

        [Fact]
        public async Task GetPolicy_CheckScope()
        {
            var options = TestHelper.GetDbContext("GetPolicy_CheckScope");

            var org1 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "Org 1" };
            var org2 = new OrganisationEntity { Id = Guid.NewGuid(), Name = "Org 2" };

            var branch1 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org1.Id, Name = "Branch 1" };
            var branch2 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org1.Id, Name = "Branch 2" };
            var branch3 = new BranchEntity { Id = Guid.NewGuid(), OrganisationId = org2.Id, Name = "Branch 3" };

            var user1 = new UserEntity { Id = Guid.NewGuid(), BranchId = branch1.Id };
            var user2 = new UserEntity { Id = Guid.NewGuid(), BranchId = branch1.Id };
            var user3 = new UserEntity { Id = Guid.NewGuid(), BranchId = branch2.Id };
            var user4 = new UserEntity { Id = Guid.NewGuid(), BranchId = branch3.Id };

            var client1 = new ClientEntity { Id = Guid.NewGuid(), OrganisationId = org1.Id };
            var client2 = new ClientEntity { Id = Guid.NewGuid(), OrganisationId = org2.Id };

            var policy1 = new PolicyEntity { Id = Guid.NewGuid(), ClientId = client1.Id, UserId = user1.Id };
            var policy2 = new PolicyEntity { Id = Guid.NewGuid(), ClientId = client1.Id, UserId = user2.Id };
            var policy3 = new PolicyEntity { Id = Guid.NewGuid(), ClientId = client1.Id, UserId = user3.Id };
            var policy4 = new PolicyEntity { Id = Guid.NewGuid(), ClientId = client2.Id, UserId = user4.Id };
            var policy5 = new PolicyEntity { Id = Guid.NewGuid(), ClientId = client1.Id, UserId = user1.Id };


            using (var context = new DataContext(options))
            {
                context.Organisation.Add(org1);

                context.Branch.Add(branch1);
                context.Branch.Add(branch2);

                context.Users.Add(user1);
                context.Users.Add(user2);
                context.Users.Add(user3);
                context.Users.Add(user4);

                context.Client.Add(client1);
                context.Client.Add(client2);

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
                Assert.Equal(policy1.Id, policy.Id);

                //In scope (org 1 -> policy 3)
                scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.Organisation);
                policy = await service.GetPolicy(scope, policy3.Id);
                Assert.Equal(policy3.Id, policy.Id);

                //Out of scope (org 2 -> policy 1)
                scope = new ScopeOptions(org2.Id, branch3.Id, user4.Id, Scope.Organisation);
                policy = await service.GetPolicy(scope, policy1.Id);
                Assert.Null(policy);

                //In scope (branch 1 -> policy 1)
                scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.Branch);
                policy = await service.GetPolicy(scope, policy1.Id);
                Assert.Equal(policy1.Id, policy.Id);

                //In scope (branch 1 -> policy 2)
                scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.Branch);
                policy = await service.GetPolicy(scope, policy2.Id);
                Assert.Equal(policy2.Id, policy.Id);

                //Out of scope (branch 2 -> policy 1)
                scope = new ScopeOptions(org1.Id, branch2.Id, user3.Id, Scope.Branch);
                policy = await service.GetPolicy(scope, policy1.Id);
                Assert.Null(policy);

                //Out of scope (branch 3 -> policy 1)
                scope = new ScopeOptions(org2.Id, branch3.Id, user4.Id, Scope.Branch);
                policy = await service.GetPolicy(scope, policy1.Id);
                Assert.Null(policy);

                //In scope (user 1 -> policy 1)
                scope = new ScopeOptions(org1.Id, branch1.Id, user1.Id, Scope.User);
                policy = await service.GetPolicy(scope, policy1.Id);
                Assert.Equal(policy1.Id, policy.Id);

                //Out of scope (user 2 -> policy 1)
                scope = new ScopeOptions(org1.Id, branch1.Id, user2.Id, Scope.User);
                policy = await service.GetPolicy(scope, policy1.Id);
                Assert.Null(policy);
            }
        }

        [Fact]
        public async Task GetPolicy_ByClient_Company_Number()
        {
            var options = TestHelper.GetDbContext("GetPolicy_ByClient_Company_Number");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            //Given
            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
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
                var scopeOptions = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetPolicy(scopeOptions, client1.Client.Id, policy1.CompanyId, policy1.Number);

                //Then
                Assert.Equal(policy1.Id, actual.Id);
            }
        }

        [Fact]
        public async Task GetPolicy_ByCompany_Number()
        {
            var options = TestHelper.GetDbContext("GetPolicy_ByCompany_Number");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            //Given
            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
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
                var scopeOptions = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetPolicy(scopeOptions, policy1.CompanyId, policy1.Number);

                //Then
                Assert.Equal(policy1.Id, actual.Id);
            }
        }

        [Fact]
        public async Task GetPolicy_ByNumber()
        {
            var options = TestHelper.GetDbContext("GetPolicy_ByNumber");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            //Given
            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                Number = "AABBCC"
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
                var scopeOptions = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetPolicy(scopeOptions, "aabbcc"); //Shouldnt be case sensitive

                //Then
                Assert.Equal(policy1.Id, actual.Id);
            }
        }



        [Fact]
        public async Task InsertPolicy()
        {
            var options = TestHelper.GetDbContext("InsertPolicy");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            //Given
            var policy1 = new PolicyEdit
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                Number = "123465",
                StartDate = DateTime.Now,
                Premium = 500,
                PolicyTypeId = Guid.NewGuid(),
                PolicyProductTypeId = Guid.NewGuid(),
                PolicyProductId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                var service = new PolicyService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1);
                var result = await service.InsertPolicy(scopeOptions, policy1);

                //Then
                Assert.True(result.Success);

                var actual = await context.Policy.FindAsync(((PolicyEdit)result.Tag).Id);
                Assert.Equal(policy1.Id, actual.Id);
                Assert.Equal(policy1.ClientId, actual.ClientId);
                Assert.Equal(policy1.CompanyId, actual.CompanyId);
                Assert.Equal(policy1.Number, actual.Number);
                Assert.Equal(policy1.StartDate, actual.StartDate);
                Assert.Equal(policy1.Premium, actual.Premium);
                Assert.Equal(policy1.PolicyTypeId, actual.PolicyTypeId);
                Assert.Equal(policy1.PolicyProductTypeId, actual.PolicyProductTypeId);
                Assert.Equal(policy1.PolicyProductId, actual.PolicyProductId);

                //Out of scope 
                scopeOptions = TestHelper.GetScopeOptions(user2);
                result = await service.InsertPolicy(scopeOptions, policy1);
                Assert.False(result.Success);
                Assert.Equal("Client does not exist", result.ValidationFailures.Single().ErrorMessage);
            }
        }

        [Fact]
        public async Task UpdatePolicy()
        {
            var options = TestHelper.GetDbContext("UpdatePolicy");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            //Given
            var policyEntity1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                Number = "123465",
                StartDate = DateTime.Now,
                Premium = 500,
                PolicyTypeId = Guid.NewGuid(),
                PolicyProductTypeId = Guid.NewGuid(),
                PolicyProductId = Guid.NewGuid()
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
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                Number = "528547",
                StartDate = DateTime.Now.AddDays(-10),
                Premium = 600,
                PolicyTypeId = Guid.NewGuid(),
                PolicyProductTypeId = Guid.NewGuid(),
                PolicyProductId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                var service = new PolicyService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1);
                var result = await service.UpdatePolicy(scopeOptions, policy1);

                //Then
                Assert.True(result.Success);

                var actual = await context.Policy.FindAsync(policyEntity1.Id);
                Assert.Equal(policy1.Id, actual.Id);
                Assert.Equal(policy1.ClientId, actual.ClientId);
                Assert.Equal(policy1.CompanyId, actual.CompanyId);
                Assert.Equal(policy1.Number, actual.Number);
                Assert.Equal(policy1.StartDate, actual.StartDate);
                Assert.Equal(policy1.Premium, actual.Premium);
                Assert.Equal(policy1.PolicyTypeId, actual.PolicyTypeId);
                Assert.Equal(policy1.PolicyProductTypeId, actual.PolicyProductTypeId);
                Assert.Equal(policy1.PolicyProductId, actual.PolicyProductId);

                //Out of scope 
                scopeOptions = TestHelper.GetScopeOptions(user2);
                result = await service.UpdatePolicy(scopeOptions, policy1);
                Assert.False(result.Success);
                Assert.Equal("Client does not exist", result.ValidationFailures.Single().ErrorMessage);
            }
        }
    }
}