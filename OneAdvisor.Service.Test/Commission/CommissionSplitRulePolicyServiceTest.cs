using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Service.Commission;
using System.Collections.Generic;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Commission.Model.CommissionSplitRulePolicy;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Model.Commission.Model.CommissionSplitRule;

namespace OneAdvisor.Service.Test.Commission
{

    public class CommissionSplitRulePolicyServiceTest
    {
        [Fact]
        public async Task GetCommissionSplitRulePolicies()
        {
            var options = TestHelper.GetDbContext("GetCommissionSplitRulePolicies");

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
            };

            var policy2 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client2.Client.Id,
                UserId = user2.User.Id,
                Number = "654321",
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
                var service = new CommissionSplitRulePolicyService(context, null);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new CommissionSplitRulePolicyInfoQueryOptions(scope, "", "", 0, 0);
                var rules = await service.GetCommissionSplitRulePolicies(queryOptions);

                //Then
                Assert.Equal(2, rules.TotalItems);
                Assert.Equal(2, rules.Items.Count());

                var items = rules.Items.ToList();
                var actual = items[0];
                Assert.Equal(policy1.Id, actual.PolicyId);
                Assert.Equal(policy1.Number, actual.PolicyNumber);
                Assert.Equal(policy1.UserId, actual.PolicyUserId);
                Assert.Equal(policy1.CompanyId, actual.PolicyCompanyId);

                actual = items[1];
                Assert.Equal(policy2.Id, actual.PolicyId);

                //Check scope
                scope = TestHelper.GetScopeOptions(user3, Scope.Organisation);
                queryOptions = new CommissionSplitRulePolicyInfoQueryOptions(scope, "", "", 0, 0);
                rules = await service.GetCommissionSplitRulePolicies(queryOptions);

                Assert.Single(rules.Items);

                actual = rules.Items.Single();
                Assert.Equal(policy3.Id, actual.PolicyId);
            }
        }

        [Fact]
        public async Task GetCommissionSplitRulePolicy()
        {
            var options = TestHelper.GetDbContext("GetCommissionSplitRulePolicy");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                Number = "123465",
            };

            var csr1 = new CommissionSplitRulePolicyEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionSplitRuleId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);

                context.CommissionSplitRulePolicy.Add(csr1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var commissionSplitService = new CommissionSplitService(context);
                var service = new CommissionSplitRulePolicyService(context, commissionSplitService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetCommissionSplitRulePolicy(scope, csr1.PolicyId);

                //Then
                Assert.Equal(csr1.Id, actual.Id);
                Assert.Equal(csr1.PolicyId, actual.PolicyId);
                Assert.Equal(csr1.CommissionSplitRuleId, actual.CommissionSplitRuleId);

                //Check scope
                scope = TestHelper.GetScopeOptions(user2);
                actual = await service.GetCommissionSplitRulePolicy(scope, csr1.PolicyId);
                Assert.Null(actual.CommissionSplitRuleId);
            }
        }

        [Fact]
        public async Task GetCommissionSplitRulePolicy_UseDefault()
        {
            var options = TestHelper.GetDbContext("GetCommissionSplitRulePolicy_UseDefault");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                Number = "123465",
            };

            var csr1 = new CommissionSplitRuleEntity
            {
                Id = Guid.NewGuid(),
                UserId = user1.User.Id,
                Name = "Com Split Rule 1",
                IsDefault = true,
                Split = new List<CommissionSplit>()
                {
                    new CommissionSplit()
                    {
                        UserId = user1.User.Id,
                        Percentage = 100
                    }
                }
            };

            var csr2 = new CommissionSplitRuleEntity
            {
                Id = Guid.NewGuid(),
                UserId = user1.User.Id,
                Name = "Com Split Rule 2",
                IsDefault = false,
                Split = new List<CommissionSplit>()
                {
                    new CommissionSplit()
                    {
                        UserId = user1.User.Id,
                        Percentage = 100
                    }
                }
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);

                context.CommissionSplitRule.Add(csr2);
                context.CommissionSplitRule.Add(csr1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var commissionSplitService = new CommissionSplitService(context);
                var service = new CommissionSplitRulePolicyService(context, commissionSplitService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetCommissionSplitRulePolicy(scope, policy1.Id);

                //Then
                Assert.Null(actual.Id);
                Assert.Equal(policy1.Id, actual.PolicyId);
                Assert.Equal(csr1.Id, actual.CommissionSplitRuleId);
            }
        }

        [Fact]
        public async Task InsertCommissionSplitRulePolicy()
        {
            var options = TestHelper.GetDbContext("InsertCommissionSplitRulePolicy");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                Number = "123465",
            };

            var csr1 = new CommissionSplitRuleEntity
            {
                Id = Guid.NewGuid(),
                UserId = user1.User.Id,
                Name = "Com Split Rule 1",
                IsDefault = false,
                Split = new List<CommissionSplit>()
                {
                    new CommissionSplit()
                    {
                        UserId = user1.User.Id,
                        Percentage = 100
                    }
                }
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);
                context.CommissionSplitRule.Add(csr1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var csrp1 = new CommissionSplitRulePolicy
                {
                    Id = Guid.NewGuid(),
                    PolicyId = policy1.Id,
                    CommissionSplitRuleId = csr1.Id
                };

                var commissionSplitService = new CommissionSplitService(context);
                var service = new CommissionSplitRulePolicyService(context, commissionSplitService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.InsertCommissionSplitRulePolicy(scope, csrp1);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionSplitRulePolicy.FindAsync(((CommissionSplitRulePolicy)result.Tag).Id);
                Assert.Equal(csrp1.Id, actual.Id);
                Assert.Equal(csrp1.PolicyId, actual.PolicyId);
                Assert.Equal(csrp1.CommissionSplitRuleId, actual.CommissionSplitRuleId);

                //Out of scope 
                scope = TestHelper.GetScopeOptions(user2, Scope.User);
                result = await service.InsertCommissionSplitRulePolicy(scope, csrp1);
                Assert.False(result.Success);
                Assert.Equal("'Policy' does not exist.", result.ValidationFailures.First().ErrorMessage);
            }
        }

        [Fact]
        public async Task InsertCommissionSplitRulePolicy_IsDefault_NotInserted()
        {
            var options = TestHelper.GetDbContext("InsertCommissionSplitRulePolicy_IsDefault_NotInserted");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                Number = "123465",
            };

            var csr1 = new CommissionSplitRuleEntity
            {
                Id = Guid.NewGuid(),
                UserId = user1.User.Id,
                Name = "Com Split Rule 1",
                IsDefault = true, //Is default
                Split = new List<CommissionSplit>()
                {
                    new CommissionSplit()
                    {
                        UserId = user1.User.Id,
                        Percentage = 100
                    }
                }
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);
                context.CommissionSplitRule.Add(csr1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var csrp1 = new CommissionSplitRulePolicy
                {
                    Id = Guid.NewGuid(),
                    PolicyId = policy1.Id,
                    CommissionSplitRuleId = csr1.Id
                };

                var commissionSplitService = new CommissionSplitService(context);
                var service = new CommissionSplitRulePolicyService(context, commissionSplitService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.InsertCommissionSplitRulePolicy(scope, csrp1);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionSplitRulePolicy.FirstOrDefaultAsync();
                Assert.Null(actual);
            }
        }

        [Fact]
        public async Task UpdateCommissionSplitRule()
        {
            var options = TestHelper.GetDbContext("UpdateCommissionSplitRule");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                Number = "123465",
            };

            var policy2 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                Number = "123465",
            };

            var csr2 = new CommissionSplitRuleEntity
            {
                Id = Guid.NewGuid(),
                UserId = user1.User.Id,
                Name = "Com Split Rule 2",
                IsDefault = false,
                Split = new List<CommissionSplit>()
                {
                    new CommissionSplit()
                    {
                        UserId = user1.User.Id,
                        Percentage = 100
                    }
                }
            };

            var csrp1 = new CommissionSplitRulePolicyEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionSplitRuleId = Guid.NewGuid()
            };

            var csrp2 = new CommissionSplitRulePolicyEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionSplitRuleId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);
                context.Policy.Add(policy2);

                context.CommissionSplitRule.Add(csr2);

                context.CommissionSplitRulePolicy.Add(csrp1);
                context.CommissionSplitRulePolicy.Add(csrp2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var csrp2Updated = new CommissionSplitRulePolicy
                {
                    Id = csrp2.Id,
                    PolicyId = policy2.Id,
                    CommissionSplitRuleId = csr2.Id
                };

                var commissionSplitService = new CommissionSplitService(context);
                var service = new CommissionSplitRulePolicyService(context, commissionSplitService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.UpdateCommissionSplitRulePolicy(scope, csrp2Updated);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionSplitRulePolicy.FindAsync(csrp2Updated.Id);
                Assert.Equal(csrp2Updated.Id, actual.Id);
                Assert.Equal(csrp2Updated.PolicyId, actual.PolicyId);
                Assert.Equal(csrp2Updated.CommissionSplitRuleId, actual.CommissionSplitRuleId);

                //Out of scope 
                scope = TestHelper.GetScopeOptions(user2, Scope.User);
                result = await service.InsertCommissionSplitRulePolicy(scope, csrp2Updated);
                Assert.False(result.Success);
                Assert.Equal("'Policy' does not exist.", result.ValidationFailures.First().ErrorMessage);
            }
        }

        [Fact]
        public async Task UpdateCommissionSplitRule_IsDefault_Deleted()
        {
            var options = TestHelper.GetDbContext("UpdateCommissionSplitRule_IsDefault_Deleted");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                Number = "123465",
            };

            var csr2 = new CommissionSplitRuleEntity
            {
                Id = Guid.NewGuid(),
                UserId = user1.User.Id,
                Name = "Com Split Rule 2",
                IsDefault = true, //Is Default
                Split = new List<CommissionSplit>()
                {
                    new CommissionSplit()
                    {
                        UserId = user1.User.Id,
                        Percentage = 100
                    }
                }
            };

            var csrp1 = new CommissionSplitRulePolicyEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionSplitRuleId = Guid.NewGuid()
            };

            var csrp2 = new CommissionSplitRulePolicyEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionSplitRuleId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);

                context.CommissionSplitRule.Add(csr2);

                context.CommissionSplitRulePolicy.Add(csrp1);
                context.CommissionSplitRulePolicy.Add(csrp2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var csrp2Updated = new CommissionSplitRulePolicy
                {
                    Id = csrp2.Id,
                    PolicyId = policy1.Id,
                    CommissionSplitRuleId = csr2.Id
                };

                var commissionSplitService = new CommissionSplitService(context);
                var service = new CommissionSplitRulePolicyService(context, commissionSplitService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.UpdateCommissionSplitRulePolicy(scope, csrp2Updated);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionSplitRulePolicy.FindAsync(csrp2Updated.Id);
                Assert.Null(actual);

                actual = await context.CommissionSplitRulePolicy.FindAsync(csrp1.Id);
                Assert.NotNull(actual);
            }
        }

        [Fact]
        public async Task DeleteCommissionSplitRulePolicy()
        {
            var options = TestHelper.GetDbContext("DeleteCommissionSplitRulePolicy");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                Number = "123465",
            };

            var policy2 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                ClientId = client1.Client.Id,
                UserId = user1.User.Id,
                Number = "123465",
            };

            var csrp1 = new CommissionSplitRulePolicyEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionSplitRuleId = Guid.NewGuid()
            };

            var csrp2 = new CommissionSplitRulePolicyEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionSplitRuleId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);
                context.Policy.Add(policy2);

                context.CommissionSplitRulePolicy.Add(csrp1);
                context.CommissionSplitRulePolicy.Add(csrp2);

                context.SaveChanges();
            }
            using (var context = new DataContext(options))
            {
                var service = new CommissionSplitRulePolicyService(context, null);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.DeleteCommissionSplitRulePolicy(scope, csrp2.Id);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionSplitRulePolicy.FindAsync(csrp2.Id);
                Assert.Null(actual);

                //Out of scope 
                scope = TestHelper.GetScopeOptions(user2, Scope.User);
                result = await service.DeleteCommissionSplitRulePolicy(scope, csrp1.Id);
                Assert.False(result.Success);

                actual = await context.CommissionSplitRulePolicy.FindAsync(csrp1.Id);
                Assert.NotNull(actual);
            }
        }

    }
}