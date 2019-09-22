using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Data;
using OneAdvisor.Service.Commission;
using OneAdvisor.Model.Directory.Model.User;
using System.Collections.Generic;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Commission.Model.CommissionSplitRule;
using OneAdvisor.Service.Directory;

namespace OneAdvisor.Service.Test.Commission
{

    public class CommissionSplitServiceTest
    {

        [Fact]
        public async Task GetCommissionSplitRules()
        {
            var options = TestHelper.GetDbContext("GetCommissionSplitRules");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);
            var user3 = TestHelper.InsertUserDetailed(options);

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
                UserId = user2.User.Id,
                Name = "Com Split Rule 2",
                IsDefault = true,
                Split = new List<CommissionSplit>()
                {
                    new CommissionSplit()
                    {
                        UserId = user2.User.Id,
                        Percentage = 100
                    }
                }
            };

            var csr3 = new CommissionSplitRuleEntity
            {
                Id = Guid.NewGuid(),
                UserId = user3.User.Id,
                Name = "Com Split Rule 3",
                IsDefault = true,
                Split = new List<CommissionSplit>()
                {
                    new CommissionSplit()
                    {
                        UserId = user3.User.Id,
                        Percentage = 100
                    }
                }
            };

            var csr4 = new CommissionSplitRuleEntity
            {
                Id = Guid.NewGuid(),
                UserId = user1.User.Id,
                Name = "Com Split Rule 4",
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
                context.CommissionSplitRule.Add(csr1);
                context.CommissionSplitRule.Add(csr2);
                context.CommissionSplitRule.Add(csr3);
                context.CommissionSplitRule.Add(csr4);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var auditService = new AuditService(context);
                var service = new CommissionSplitService(context, auditService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new CommissionSplitRuleQueryOptions(scope, "", "", 0, 0);
                var rules = await service.GetCommissionSplitRules(queryOptions);

                //Then
                Assert.Equal(3, rules.TotalItems);
                Assert.Equal(3, rules.Items.Count());

                var items = rules.Items.ToList();
                var actual = items[0];
                Assert.Equal(csr1.Id, actual.Id);
                Assert.Equal(csr1.Name, actual.Name);
                Assert.Equal(csr1.UserId, actual.UserId);
                Assert.Equal(csr1.IsDefault, actual.IsDefault);
                Assert.Equal(csr1.Split, actual.Split);

                actual = items[1];
                Assert.Equal(csr2.Id, actual.Id);

                actual = items[2];
                Assert.Equal(csr4.Id, actual.Id);
                Assert.Equal(csr4.IsDefault, actual.IsDefault);

                //Filter check (user id)
                scope = TestHelper.GetScopeOptions(user1);
                queryOptions = new CommissionSplitRuleQueryOptions(scope, "", "", 0, 0);
                queryOptions.UserId.Add(user2.User.Id);
                rules = await service.GetCommissionSplitRules(queryOptions);

                Assert.Single(rules.Items);

                actual = rules.Items.First();
                Assert.Equal(csr2.Id, actual.Id);


                //Check scope
                scope = TestHelper.GetScopeOptions(user3, Scope.Organisation);
                queryOptions = new CommissionSplitRuleQueryOptions(scope, "", "", 0, 0);
                rules = await service.GetCommissionSplitRules(queryOptions);

                Assert.Single(rules.Items);

                actual = rules.Items.First();
                Assert.Equal(csr3.Id, actual.Id);
            }
        }

        [Fact]
        public async Task GetCommissionSplitRule()
        {
            var options = TestHelper.GetDbContext("GetCommissionSplitRule");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);
            var user3 = TestHelper.InsertUserDetailed(options);

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
                UserId = user2.User.Id,
                Name = "Com Split Rule 2",
                IsDefault = true,
                Split = new List<CommissionSplit>()
                {
                    new CommissionSplit()
                    {
                        UserId = user2.User.Id,
                        Percentage = 100
                    }
                }
            };

            var csr3 = new CommissionSplitRuleEntity
            {
                Id = Guid.NewGuid(),
                UserId = user3.User.Id,
                Name = "Com Split Rule 3",
                IsDefault = true,
                Split = new List<CommissionSplit>()
                {
                    new CommissionSplit()
                    {
                        UserId = user3.User.Id,
                        Percentage = 100
                    }
                }
            };

            using (var context = new DataContext(options))
            {
                context.CommissionSplitRule.Add(csr2);
                context.CommissionSplitRule.Add(csr1);
                context.CommissionSplitRule.Add(csr3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var auditService = new AuditService(context);
                var service = new CommissionSplitService(context, auditService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetCommissionSplitRule(scope, csr1.Id);

                //Then
                Assert.Equal(csr1.Id, actual.Id);
                Assert.Equal(csr1.Name, actual.Name);
                Assert.Equal(csr1.UserId, actual.UserId);
                Assert.Equal(csr1.IsDefault, actual.IsDefault);
                Assert.Equal(csr1.Split, actual.Split);

                //Check scope
                actual = await service.GetCommissionSplitRule(scope, csr3.Id);
                Assert.Null(actual);
            }
        }

        [Fact]
        public async Task InsertCommissionSplitRule()
        {
            var options = TestHelper.GetDbContext("InsertCommissionSplitRule");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var csr1 = new CommissionSplitRule
                {
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

                var auditService = new AuditService(context);
                var service = new CommissionSplitService(context, auditService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.InsertCommissionSplitRule(scope, csr1);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionSplitRule.FindAsync(((CommissionSplitRule)result.Tag).Id);
                Assert.Equal(csr1.Id, actual.Id);
                Assert.Equal(csr1.Name, actual.Name);
                Assert.Equal(csr1.UserId, actual.UserId);
                Assert.Equal(csr1.IsDefault, actual.IsDefault);
                Assert.Equal(csr1.Split, actual.Split);

                //Out of scope 
                scope = TestHelper.GetScopeOptions(user2, Scope.User);
                result = await service.InsertCommissionSplitRule(scope, csr1);
                Assert.False(result.Success);
                Assert.Equal("'User' does not exist.", result.ValidationFailures.First().ErrorMessage);
            }
        }



        [Fact]
        public async Task UpdateCommissionSplitRule()
        {
            var options = TestHelper.GetDbContext("UpdateCommissionSplitRule");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);
            var user3 = TestHelper.InsertUserDetailed(options);

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
                UserId = user2.User.Id,
                Name = "Com Split Rule 2",
                IsDefault = false,
                Split = new List<CommissionSplit>()
                {
                    new CommissionSplit()
                    {
                        UserId = user2.User.Id,
                        Percentage = 100
                    }
                }
            };

            var csr3 = new CommissionSplitRuleEntity
            {
                Id = Guid.NewGuid(),
                UserId = user3.User.Id,
                Name = "Com Split Rule 3",
                IsDefault = true,
                Split = new List<CommissionSplit>()
                {
                    new CommissionSplit()
                    {
                        UserId = user3.User.Id,
                        Percentage = 100
                    }
                }
            };

            using (var context = new DataContext(options))
            {
                context.CommissionSplitRule.Add(csr2);
                context.CommissionSplitRule.Add(csr1);
                context.CommissionSplitRule.Add(csr3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var csr2Updated = new CommissionSplitRule
                {
                    Id = csr2.Id,
                    UserId = user1.User.Id,
                    Name = "Com Split Rule 2 updated",
                    IsDefault = true,
                    Split = new List<CommissionSplit>()
                    {
                        new CommissionSplit()
                        {
                            UserId = user1.User.Id,
                            Percentage = 50
                        },
                        new CommissionSplit()
                        {
                            UserId = user2.User.Id,
                            Percentage = 50
                        }
                    }
                };

                var auditService = new AuditService(context);
                var service = new CommissionSplitService(context, auditService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.UpdateCommissionSplitRule(scope, csr2Updated);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionSplitRule.FindAsync(csr2Updated.Id);
                Assert.Equal(csr2Updated.Id, actual.Id);
                Assert.Equal(csr2Updated.Name, actual.Name);
                Assert.Equal(csr2Updated.UserId, actual.UserId);
                Assert.Equal(csr2Updated.IsDefault, actual.IsDefault);
                Assert.Equal(csr2Updated.Split, actual.Split);

                //Check is default clear from csr1
                actual = await context.CommissionSplitRule.FindAsync(csr1.Id);
                Assert.False(actual.IsDefault);

                //Out of scope 
                scope = TestHelper.GetScopeOptions(user3, Scope.User);
                result = await service.UpdateCommissionSplitRule(scope, csr2Updated);
                Assert.False(result.Success);
                Assert.Equal("'User' does not exist.", result.ValidationFailures.First().ErrorMessage);
            }
        }



        [Fact]
        public async Task DeleteCommissionSplitRule()
        {
            var options = TestHelper.GetDbContext("DeleteCommissionSplitRule");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);
            var user3 = TestHelper.InsertUserDetailed(options);

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

            var csrp1 = new CommissionSplitRulePolicyEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = Guid.NewGuid(),
                CommissionSplitRuleId = csr1.Id
            };

            var csr2 = new CommissionSplitRuleEntity
            {
                Id = Guid.NewGuid(),
                UserId = user2.User.Id,
                Name = "Com Split Rule 2",
                IsDefault = true,
                Split = new List<CommissionSplit>()
                {
                    new CommissionSplit()
                    {
                        UserId = user2.User.Id,
                        Percentage = 100
                    }
                }
            };

            var csr3 = new CommissionSplitRuleEntity
            {
                Id = Guid.NewGuid(),
                UserId = user3.User.Id,
                Name = "Com Split Rule 3",
                IsDefault = true,
                Split = new List<CommissionSplit>()
                {
                    new CommissionSplit()
                    {
                        UserId = user3.User.Id,
                        Percentage = 100
                    }
                }
            };

            using (var context = new DataContext(options))
            {
                context.CommissionSplitRule.Add(csr2);
                context.CommissionSplitRule.Add(csr1);
                context.CommissionSplitRule.Add(csr3);

                context.CommissionSplitRulePolicy.Add(csrp1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var auditService = new AuditService(context);
                var service = new CommissionSplitService(context, auditService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.DeleteCommissionSplitRule(scope, csr1.Id);

                //Then
                Assert.True(result.Success);

                var actual = await context.CommissionSplitRule.FindAsync(csr1.Id);
                Assert.Null(actual);

                var actualDep = await context.CommissionSplitRulePolicy.FindAsync(csrp1.Id);
                Assert.Null(actualDep);

                //Out of scope 
                scope = TestHelper.GetScopeOptions(user3, Scope.User);
                result = await service.DeleteCommissionSplitRule(scope, csr2.Id);
                Assert.False(result.Success);

                actual = await context.CommissionSplitRule.FindAsync(csr2.Id);
                Assert.NotNull(actual);
            }
        }

    }
}