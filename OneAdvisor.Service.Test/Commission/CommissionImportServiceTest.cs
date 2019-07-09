using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Service.Commission;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Service.Client;
using OneAdvisor.Service.Directory;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Data.Entities.Directory.Lookup;
using System.Collections.Generic;
using Moq;
using OneAdvisor.Service.Common.BulkActions;
using OneAdvisor.Data.Entities.Commission.Lookup;
using OneAdvisor.Model.Commission.Model.CommissionSplitRule;
using OneAdvisor.Model;

namespace OneAdvisor.Service.Test.Commission
{

    public class CommissionImportServiceTest
    {
        [Fact]
        public async Task ImportCommissions_ScopeCheck()
        {
            var options = TestHelper.GetDbContext("ImportCommissions_ScopeCheck");

            var user1 = TestHelper.InsertUserDetailed(options);
            var statement = TestHelper.InsertCommissionStatement(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var lookupService = new DirectoryLookupService(context);
                var commissionLookupService = new CommissionLookupService(context);
                var policyService = new PolicyService(context);
                var commissionSplitService = new CommissionSplitService(context);
                var commissionSplitRulePolicyService = new CommissionSplitRulePolicyService(context, commissionSplitService);
                var statementService = new CommissionStatementService(context, null);

                var bulkActions = new Mock<IBulkActions>(MockBehavior.Strict);
                bulkActions.Setup(c => c.BulkInsertCommissionErrorsAsync(It.IsAny<DataContext>(), It.IsAny<IList<CommissionErrorEntity>>()))
                    .Returns(Task.CompletedTask);

                var service = new CommissionImportService(
                    context,
                    bulkActions.Object,
                    statementService,
                    policyService,
                    lookupService,
                    commissionLookupService,
                    commissionSplitService,
                    commissionSplitRulePolicyService);

                //When
                var import1 = new ImportCommission
                {
                    PolicyNumber = "123456",
                    CommissionTypeCode = "gap_cover",
                    AmountIncludingVAT = "abc",
                    VAT = "zzz"
                };

                var imports = new List<ImportCommission>() { import1 };

                var scope = TestHelper.GetScopeOptions(user2);
                var results = await service.ImportCommissions(scope, statement.Id, imports);

                //Then
                Assert.Empty(results);

                scope = TestHelper.GetScopeOptions(user1);
                results = await service.ImportCommissions(scope, statement.Id, imports);

                //Then
                Assert.Single(results);
            }
        }

        [Fact]
        public async Task ImportCommission_BadFormat_InsertError()
        {
            var options = TestHelper.GetDbContext("ImportCommission_BadFormat_InsertError");

            var user1 = TestHelper.InsertUserDetailed(options);
            var statement = TestHelper.InsertCommissionStatement(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var lookupService = new DirectoryLookupService(context);
                var commissionLookupService = new CommissionLookupService(context);
                var policyService = new PolicyService(context);
                var commissionSplitService = new CommissionSplitService(context);
                var commissionSplitRulePolicyService = new CommissionSplitRulePolicyService(context, commissionSplitService);
                var statementService = new CommissionStatementService(context, null);

                var bulkActions = new Mock<IBulkActions>(MockBehavior.Strict);
                var insertedErrors = new List<CommissionErrorEntity>();
                bulkActions.Setup(c => c.BulkInsertCommissionErrorsAsync(It.IsAny<DataContext>(), It.IsAny<IList<CommissionErrorEntity>>()))
                    .Callback((DataContext c, IList<CommissionErrorEntity> l) => insertedErrors = l.ToList())
                    .Returns(Task.CompletedTask);

                var service = new CommissionImportService(
                    context,
                    bulkActions.Object,
                    statementService,
                    policyService,
                    lookupService,
                    commissionLookupService,
                    commissionSplitService,
                    commissionSplitRulePolicyService);

                //When
                var import1 = new ImportCommission
                {
                    PolicyNumber = "123456",
                    CommissionTypeCode = "gap_cover",
                    AmountIncludingVAT = "abc", //Bad format
                    VAT = "zzz" //Bad format
                };

                var scope = TestHelper.GetScopeOptions(user1);
                var result = (await service.ImportCommissions(scope, statement.Id, new List<ImportCommission>() { import1 })).Single();

                //Then
                Assert.False(result.Success);
                Assert.Equal(2, result.ValidationFailures.Count);
                Assert.Equal("'Amount' must be a number", result.ValidationFailures[0].ErrorMessage);
                Assert.Equal("'VAT' must be a number", result.ValidationFailures[1].ErrorMessage);

                //Check error record
                var actual = insertedErrors.Single();

                Assert.Null(actual.ClientId);
                Assert.Null(actual.PolicyId);
                Assert.Null(actual.CommissionTypeId);

                Assert.Equal(statement.Id, actual.CommissionStatementId);

                Assert.False(actual.IsFormatValid);
                Assert.Equal(import1, actual.Data);
            }
        }


        [Fact]
        public async Task ImportCommission_NoMapping_SetCommisionType()
        {
            var options = TestHelper.GetDbContext("ImportCommission_SetCommisionType");

            var user1 = TestHelper.InsertUserDetailed(options);
            var statement = TestHelper.InsertCommissionStatement(options, user1.Organisation);

            var commissionType = new CommissionTypeEntity
            {
                Id = Guid.NewGuid(),
                Code = "gap_cover"
            };

            using (var context = new DataContext(options))
            {
                context.CommissionType.Add(commissionType);
                context.SaveChanges();

                var statementService = new CommissionStatementService(context, null);
                var lookupService = new DirectoryLookupService(context);
                var commissionLookupService = new CommissionLookupService(context);
                var commissionSplitService = new CommissionSplitService(context);
                var commissionSplitRulePolicyService = new CommissionSplitRulePolicyService(context, commissionSplitService);
                var policyService = new PolicyService(context);

                var bulkActions = new Mock<IBulkActions>(MockBehavior.Strict);
                var insertedErrors = new List<CommissionErrorEntity>();
                bulkActions.Setup(c => c.BulkInsertCommissionErrorsAsync(It.IsAny<DataContext>(), It.IsAny<IList<CommissionErrorEntity>>()))
                    .Callback((DataContext c, IList<CommissionErrorEntity> l) => insertedErrors = l.ToList())
                    .Returns(Task.CompletedTask);

                var service = new CommissionImportService(
                    context,
                    bulkActions.Object,
                    statementService,
                    policyService,
                    lookupService,
                    commissionLookupService,
                    commissionSplitService,
                    commissionSplitRulePolicyService);

                //When
                var import1 = new ImportCommission
                {
                    PolicyNumber = "123  456", // has spaces, should be removed
                    CommissionTypeCode = "gap_cover", //existing cover
                    AmountIncludingVAT = "100",
                    VAT = "14"
                };

                var scope = TestHelper.GetScopeOptions(user1);
                var result = (await service.ImportCommissions(scope, statement.Id, new List<ImportCommission>() { import1 })).Single();

                //Then
                Assert.False(result.Success);
                Assert.Empty(result.ValidationFailures);

                //Check error record
                var actual = insertedErrors.Single();

                Assert.Null(actual.ClientId);
                Assert.Null(actual.PolicyId);
                Assert.Equal(commissionType.Id, actual.CommissionTypeId);

                Assert.Equal(statement.Id, actual.CommissionStatementId);

                Assert.True(actual.IsFormatValid);

                import1.PolicyNumber = import1.PolicyNumber.TrimWhiteSpace();
                Assert.Equal(import1, actual.Data);
            }
        }

        [Fact]
        public async Task ImportCommission_NoMapping_SetPolicyAndClient()
        {
            var options = TestHelper.GetDbContext("ImportCommission_SetPolicyAndClient");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var company = TestHelper.InsertCompany(options);
            var statement = TestHelper.InsertCommissionStatement(options, user1.Organisation, company.Id);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = company.Id,
                ClientId = client1.Client.Id,
                UserId = user1.User.Id
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);
                context.SaveChanges();

                var statementService = new CommissionStatementService(context, null);
                var lookupService = new DirectoryLookupService(context);
                var commissionLookupService = new CommissionLookupService(context);
                var commissionSplitService = new CommissionSplitService(context);
                var commissionSplitRulePolicyService = new CommissionSplitRulePolicyService(context, commissionSplitService);
                var policyService = new PolicyService(context);

                var bulkActions = new Mock<IBulkActions>(MockBehavior.Strict);
                var insertedErrors = new List<CommissionErrorEntity>();
                bulkActions.Setup(c => c.BulkInsertCommissionErrorsAsync(It.IsAny<DataContext>(), It.IsAny<IList<CommissionErrorEntity>>()))
                    .Callback((DataContext c, IList<CommissionErrorEntity> l) => insertedErrors = l.ToList())
                    .Returns(Task.CompletedTask);

                var service = new CommissionImportService(
                    context,
                    bulkActions.Object,
                    statementService,
                    policyService,
                    lookupService,
                    commissionLookupService,
                    commissionSplitService,
                    commissionSplitRulePolicyService);

                //When
                var import1 = new ImportCommission
                {
                    PolicyNumber = policy1.Number,
                    CommissionTypeCode = "gap_cover",
                    AmountIncludingVAT = "100",
                    VAT = "14"
                };

                var scope = TestHelper.GetScopeOptions(user1);
                var result = (await service.ImportCommissions(scope, statement.Id, new List<ImportCommission>() { import1 })).Single();

                //Then
                Assert.False(result.Success);
                Assert.Empty(result.ValidationFailures);

                //Check error record
                var actual = insertedErrors.Single();

                Assert.Equal(policy1.ClientId, actual.ClientId);
                Assert.Equal(policy1.Id, actual.PolicyId);
                Assert.Null(actual.CommissionTypeId);

                Assert.Equal(statement.Id, actual.CommissionStatementId);

                Assert.True(actual.IsFormatValid);
                Assert.Equal(import1, actual.Data);
            }
        }

        [Fact]
        public async Task ImportCommission_InsertCommission()
        {
            var options = TestHelper.GetDbContext("ImportCommission_InsertCommission");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var company = TestHelper.InsertCompany(options);
            var statement = TestHelper.InsertCommissionStatement(options, user1.Organisation, company.Id);

            var commissionType = new CommissionTypeEntity
            {
                Id = Guid.NewGuid(),
                Code = "gap_cover"
            };

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = company.Id,
                ClientId = client1.Client.Id,
                UserId = user1.User.Id
            };

            using (var context = new DataContext(options))
            {
                context.CommissionType.Add(commissionType);
                context.Policy.Add(policy1);
                context.SaveChanges();

                var statementService = new CommissionStatementService(context, null);
                var lookupService = new DirectoryLookupService(context);
                var commissionLookupService = new CommissionLookupService(context);
                var policyService = new PolicyService(context);
                var commissionSplitService = new CommissionSplitService(context);
                var commissionSplitRulePolicyService = new CommissionSplitRulePolicyService(context, commissionSplitService);
                var commissionService = new CommissionService(context);

                var bulkActions = new Mock<IBulkActions>(MockBehavior.Strict);
                var insertedCommissions = new List<CommissionEntity>();
                bulkActions.Setup(c => c.BulkInsertCommissionsAsync(It.IsAny<DataContext>(), It.IsAny<IList<CommissionEntity>>()))
                    .Callback((DataContext c, IList<CommissionEntity> l) => insertedCommissions = l.ToList())
                    .Returns(Task.CompletedTask);

                var service = new CommissionImportService(
                    context,
                    bulkActions.Object,
                    statementService,
                    policyService,
                    lookupService,
                    commissionLookupService,
                    commissionSplitService,
                    commissionSplitRulePolicyService);

                //When
                var import1 = new ImportCommission
                {
                    PolicyNumber = policy1.Number.Insert(5, " "), //Add a space in (should still match)
                    CommissionTypeCode = commissionType.Code,
                    AmountIncludingVAT = "100",
                    VAT = "14"
                };

                var scope = TestHelper.GetScopeOptions(user1);
                var result = (await service.ImportCommissions(scope, statement.Id, new List<ImportCommission>() { import1 })).Single();

                //Then
                Assert.True(result.Success);

                var actual = insertedCommissions.Single();
                Assert.Equal(policy1.Id, actual.PolicyId);
                Assert.Equal(commissionType.Id, actual.CommissionTypeId);
                Assert.Equal(100, actual.AmountIncludingVAT);
                Assert.Equal(14, actual.VAT);
                Assert.Equal(statement.Id, actual.CommissionStatementId);
                Assert.Equal(import1, actual.SourceData);
                Assert.Equal(policy1.UserId, actual.UserId);
                Assert.Null(actual.SplitGroupId);
            }
        }

        [Fact]
        public async Task ImportCommission_InsertCommission_MatchUsingPolicyPrefix()
        {
            var options = TestHelper.GetDbContext("ImportCommission_InsertCommission_MatchUsingPolicyPrefix");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var company = new CompanyEntity
            {
                Id = Guid.NewGuid(),
                Name = Guid.NewGuid().ToString(),
                CommissionPolicyNumberPrefixes = new List<string>() { "px" }
            };

            var statement = TestHelper.InsertCommissionStatement(options, user1.Organisation, company.Id);

            var commissionType = new CommissionTypeEntity
            {
                Id = Guid.NewGuid(),
                Code = "gap_cover"
            };

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = company.Id,
                ClientId = client1.Client.Id,
                UserId = user1.User.Id
            };

            using (var context = new DataContext(options))
            {
                context.Company.Add(company);
                context.CommissionType.Add(commissionType);
                context.Policy.Add(policy1);
                context.SaveChanges();

                var statementService = new CommissionStatementService(context, null);
                var lookupService = new DirectoryLookupService(context);
                var commissionLookupService = new CommissionLookupService(context);
                var policyService = new PolicyService(context);
                var commissionSplitService = new CommissionSplitService(context);
                var commissionSplitRulePolicyService = new CommissionSplitRulePolicyService(context, commissionSplitService);
                var commissionService = new CommissionService(context);

                var bulkActions = new Mock<IBulkActions>(MockBehavior.Strict);
                var insertedCommissions = new List<CommissionEntity>();
                bulkActions.Setup(c => c.BulkInsertCommissionsAsync(It.IsAny<DataContext>(), It.IsAny<IList<CommissionEntity>>()))
                    .Callback((DataContext c, IList<CommissionEntity> l) => insertedCommissions = l.ToList())
                    .Returns(Task.CompletedTask);

                var service = new CommissionImportService(
                    context,
                    bulkActions.Object,
                    statementService,
                    policyService,
                    lookupService,
                    commissionLookupService,
                    commissionSplitService,
                    commissionSplitRulePolicyService);

                //When
                var import1 = new ImportCommission
                {
                    PolicyNumber = $"px {policy1.Number}",
                    CommissionTypeCode = commissionType.Code,
                    AmountIncludingVAT = "100",
                    VAT = "14"
                };

                var scope = TestHelper.GetScopeOptions(user1);
                var result = (await service.ImportCommissions(scope, statement.Id, new List<ImportCommission>() { import1 })).Single();

                //Then
                Assert.True(result.Success);

                var actual = insertedCommissions.Single();
                Assert.Equal(policy1.Id, actual.PolicyId);
                Assert.Equal(commissionType.Id, actual.CommissionTypeId);
                Assert.Equal(100, actual.AmountIncludingVAT);
                Assert.Equal(14, actual.VAT);
                Assert.Equal(statement.Id, actual.CommissionStatementId);
                Assert.Equal(import1, actual.SourceData);
                Assert.Equal(policy1.UserId, actual.UserId);
                Assert.Null(actual.SplitGroupId);
            }
        }

        [Fact]
        public async Task ImportCommission_InsertCommission_NegitiveAmmount()
        {
            var options = TestHelper.GetDbContext("ImportCommission_InsertCommission_NegitiveAmmount");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);

            var company = TestHelper.InsertCompany(options);
            var statement = TestHelper.InsertCommissionStatement(options, user1.Organisation, company.Id);

            var commissionType = new CommissionTypeEntity
            {
                Id = Guid.NewGuid(),
                Code = "gap_cover"
            };

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = company.Id,
                ClientId = client1.Client.Id,
                UserId = user1.User.Id
            };

            using (var context = new DataContext(options))
            {
                context.CommissionType.Add(commissionType);
                context.Policy.Add(policy1);
                context.SaveChanges();

                var statementService = new CommissionStatementService(context, null);
                var lookupService = new DirectoryLookupService(context);
                var commissionLookupService = new CommissionLookupService(context);
                var policyService = new PolicyService(context);
                var commissionSplitService = new CommissionSplitService(context);
                var commissionSplitRulePolicyService = new CommissionSplitRulePolicyService(context, commissionSplitService);
                var commissionService = new CommissionService(context);

                var bulkActions = new Mock<IBulkActions>(MockBehavior.Strict);
                var insertedCommissions = new List<CommissionEntity>();
                bulkActions.Setup(c => c.BulkInsertCommissionsAsync(It.IsAny<DataContext>(), It.IsAny<IList<CommissionEntity>>()))
                    .Callback((DataContext c, IList<CommissionEntity> l) => insertedCommissions = l.ToList())
                    .Returns(Task.CompletedTask);

                var service = new CommissionImportService(
                    context,
                    bulkActions.Object,
                    statementService,
                    policyService,
                    lookupService,
                    commissionLookupService,
                    commissionSplitService,
                    commissionSplitRulePolicyService);

                //When
                var import1 = new ImportCommission
                {
                    PolicyNumber = policy1.Number,
                    CommissionTypeCode = commissionType.Code,
                    AmountIncludingVAT = "-100",
                    VAT = "-14"
                };

                var scope = TestHelper.GetScopeOptions(user1);
                var result = (await service.ImportCommissions(scope, statement.Id, new List<ImportCommission>() { import1 })).Single();

                //Then
                Assert.True(result.Success);

                var actual = insertedCommissions.Single();
                Assert.Equal(policy1.Id, actual.PolicyId);
                Assert.Equal(commissionType.Id, actual.CommissionTypeId);
                Assert.Equal(-100, actual.AmountIncludingVAT);
                Assert.Equal(-14, actual.VAT);
                Assert.Equal(statement.Id, actual.CommissionStatementId);
                Assert.Equal(import1, actual.SourceData);
                Assert.Equal(policy1.UserId, actual.UserId);
                Assert.Null(actual.SplitGroupId);
            }
        }

        [Fact]
        public async Task ImportCommission_InsertCommission_Split_Default()
        {
            var options = TestHelper.GetDbContext("ImportCommission_InsertCommission_Split_Default");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);
            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);
            var user3 = TestHelper.InsertUserDetailed(options, user1.Organisation);

            var company = TestHelper.InsertCompany(options);
            var statement = TestHelper.InsertCommissionStatement(options, user1.Organisation, company.Id);

            var commissionType = new CommissionTypeEntity
            {
                Id = Guid.NewGuid(),
                Code = "gap_cover"
            };

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = company.Id,
                ClientId = client1.Client.Id,
                UserId = user1.User.Id
            };

            var csr1 = new CommissionSplitRuleEntity
            {
                Id = Guid.NewGuid(),
                UserId = user1.User.Id,
                Name = "75/25  split",
                IsDefault = true, //Is default
                Split = new List<CommissionSplit>()
                {
                    new CommissionSplit()
                    {
                        UserId = user2.User.Id,
                        Percentage = 75
                    },
                    new CommissionSplit()
                    {
                        UserId = user3.User.Id,
                        Percentage = 25
                    }
                }
            };

            using (var context = new DataContext(options))
            {
                context.CommissionType.Add(commissionType);

                context.Policy.Add(policy1);

                context.CommissionSplitRule.Add(csr1);

                context.SaveChanges();

                var statementService = new CommissionStatementService(context, null);
                var lookupService = new DirectoryLookupService(context);
                var commissionLookupService = new CommissionLookupService(context);
                var policyService = new PolicyService(context);
                var commissionSplitService = new CommissionSplitService(context);
                var commissionSplitRulePolicyService = new CommissionSplitRulePolicyService(context, commissionSplitService);
                var commissionService = new CommissionService(context);

                var bulkActions = new Mock<IBulkActions>(MockBehavior.Strict);
                var insertedCommissions = new List<CommissionEntity>();
                bulkActions.Setup(c => c.BulkInsertCommissionsAsync(It.IsAny<DataContext>(), It.IsAny<IList<CommissionEntity>>()))
                    .Callback((DataContext c, IList<CommissionEntity> l) => insertedCommissions = l.ToList())
                    .Returns(Task.CompletedTask);

                var service = new CommissionImportService(
                    context,
                    bulkActions.Object,
                    statementService,
                    policyService,
                    lookupService,
                    commissionLookupService,
                    commissionSplitService,
                    commissionSplitRulePolicyService);

                //When
                var import1 = new ImportCommission
                {
                    PolicyNumber = policy1.Number,
                    CommissionTypeCode = commissionType.Code,
                    AmountIncludingVAT = "120",
                    VAT = "12"
                };

                var scope = TestHelper.GetScopeOptions(user1);
                var result = (await service.ImportCommissions(scope, statement.Id, new List<ImportCommission>() { import1 })).Single();

                //Then
                Assert.True(result.Success);

                Assert.Equal(2, insertedCommissions.Count);

                var actual = insertedCommissions[0];
                Assert.Equal(policy1.Id, actual.PolicyId);
                Assert.Equal(commissionType.Id, actual.CommissionTypeId);
                Assert.Equal(90, actual.AmountIncludingVAT);
                Assert.Equal(9, actual.VAT);
                Assert.Equal(statement.Id, actual.CommissionStatementId);
                Assert.Equal(import1, actual.SourceData);

                actual = insertedCommissions[1];
                Assert.Equal(policy1.Id, actual.PolicyId);
                Assert.Equal(commissionType.Id, actual.CommissionTypeId);
                Assert.Equal(30, actual.AmountIncludingVAT);
                Assert.Equal(3, actual.VAT);
                Assert.Equal(statement.Id, actual.CommissionStatementId);
                Assert.Equal(import1, actual.SourceData);
            }
        }

        [Fact]
        public async Task ImportCommission_InsertCommission_Split_Specific()
        {
            var options = TestHelper.GetDbContext("ImportCommission_InsertCommission_Split_Specific");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);
            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);
            var user3 = TestHelper.InsertUserDetailed(options, user1.Organisation);

            var company = TestHelper.InsertCompany(options);
            var statement = TestHelper.InsertCommissionStatement(options, user1.Organisation, company.Id);

            var commissionType = new CommissionTypeEntity
            {
                Id = Guid.NewGuid(),
                Code = "gap_cover"
            };

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = company.Id,
                ClientId = client1.Client.Id,
                UserId = user1.User.Id
            };

            var csr1 = new CommissionSplitRuleEntity
            {
                Id = Guid.NewGuid(),
                UserId = user1.User.Id,
                Name = "75/25 split",
                IsDefault = true, //Default
                Split = new List<CommissionSplit>()
                {
                    new CommissionSplit()
                    {
                        UserId = user2.User.Id,
                        Percentage = 75
                    },
                    new CommissionSplit()
                    {
                        UserId = user3.User.Id,
                        Percentage = 25
                    }
                }
            };

            var csr2 = new CommissionSplitRuleEntity
            {
                Id = Guid.NewGuid(),
                UserId = user1.User.Id,
                Name = "50/50 split",
                IsDefault = false, //Not Default
                Split = new List<CommissionSplit>()
                {
                    new CommissionSplit()
                    {
                        UserId = user2.User.Id,
                        Percentage = 50
                    },
                    new CommissionSplit()
                    {
                        UserId = user3.User.Id,
                        Percentage = 50
                    }
                }
            };

            var csrp1 = new CommissionSplitRulePolicyEntity
            {
                Id = Guid.NewGuid(),
                PolicyId = policy1.Id,
                CommissionSplitRuleId = csr2.Id
            };

            using (var context = new DataContext(options))
            {
                context.CommissionType.Add(commissionType);

                context.Policy.Add(policy1);

                context.CommissionSplitRule.Add(csr1);
                context.CommissionSplitRule.Add(csr2);

                context.CommissionSplitRulePolicy.Add(csrp1);

                context.SaveChanges();

                var statementService = new CommissionStatementService(context, null);
                var lookupService = new DirectoryLookupService(context);
                var commissionLookupService = new CommissionLookupService(context);
                var policyService = new PolicyService(context);
                var commissionSplitService = new CommissionSplitService(context);
                var commissionSplitRulePolicyService = new CommissionSplitRulePolicyService(context, commissionSplitService);
                var commissionService = new CommissionService(context);

                var bulkActions = new Mock<IBulkActions>(MockBehavior.Strict);
                var insertedCommissions = new List<CommissionEntity>();
                bulkActions.Setup(c => c.BulkInsertCommissionsAsync(It.IsAny<DataContext>(), It.IsAny<IList<CommissionEntity>>()))
                    .Callback((DataContext c, IList<CommissionEntity> l) => insertedCommissions = l.ToList())
                    .Returns(Task.CompletedTask);

                var service = new CommissionImportService(
                    context,
                    bulkActions.Object,
                    statementService,
                    policyService,
                    lookupService,
                    commissionLookupService,
                    commissionSplitService,
                    commissionSplitRulePolicyService);

                //When
                var import1 = new ImportCommission
                {
                    PolicyNumber = policy1.Number,
                    CommissionTypeCode = commissionType.Code,
                    AmountIncludingVAT = "120",
                    VAT = "12"
                };

                var scope = TestHelper.GetScopeOptions(user1);
                var result = (await service.ImportCommissions(scope, statement.Id, new List<ImportCommission>() { import1 })).Single();

                //Then
                Assert.True(result.Success);

                Assert.Equal(2, insertedCommissions.Count);

                var actual = insertedCommissions[0];
                Assert.Equal(policy1.Id, actual.PolicyId);
                Assert.Equal(commissionType.Id, actual.CommissionTypeId);
                Assert.Equal(60, actual.AmountIncludingVAT);
                Assert.Equal(6, actual.VAT);
                Assert.Equal(statement.Id, actual.CommissionStatementId);
                Assert.Equal(import1, actual.SourceData);

                actual = insertedCommissions[1];
                Assert.Equal(policy1.Id, actual.PolicyId);
                Assert.Equal(commissionType.Id, actual.CommissionTypeId);
                Assert.Equal(60, actual.AmountIncludingVAT);
                Assert.Equal(6, actual.VAT);
                Assert.Equal(statement.Id, actual.CommissionStatementId);
                Assert.Equal(import1, actual.SourceData);
            }
        }

    }
}