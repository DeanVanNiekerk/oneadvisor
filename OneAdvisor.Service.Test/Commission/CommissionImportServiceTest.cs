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
using OneAdvisor.Service.Member;
using OneAdvisor.Service.Directory;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using OneAdvisor.Data.Entities.Directory.Lookup;
using System.Collections.Generic;

namespace OneAdvisor.Service.Test.Commission
{
    [TestClass]
    public class CommissionImportServiceTest
    {
        [TestMethod]
        public async Task ImportCommissions_ScopeCheck()
        {
            var options = TestHelper.GetDbContext("ImportCommissions_ScopeCheck");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation);

            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var lookupService = new LookupService(context);
                var policyService = new PolicyService(context);
                var statementService = new CommissionStatementService(context);
                var service = new CommissionImportService(context, statementService, null, policyService, lookupService);

                //When
                var import1 = new ImportCommission
                {
                    PolicyNumber = "123456",
                    CommissionTypeCode = "gap_cover",
                    AmountIncludingVAT = "abc",
                    VAT = "zzz"
                };

                var imports = new List<ImportCommission>() { import1 };

                var scope = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                var results = await service.ImportCommissions(scope, statement.Id, imports);

                //Then
                Assert.AreEqual(0, results.Count);

                scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                results = await service.ImportCommissions(scope, statement.Id, imports);

                //Then
                Assert.AreEqual(1, results.Count);
            }
        }

        [TestMethod]
        public async Task ImportCommission_BadFormat_InsertError()
        {
            var options = TestHelper.GetDbContext("ImportCommission_BadFormat_InsertError");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation);

            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var lookupService = new LookupService(context);
                var policyService = new PolicyService(context);
                var statementService = new CommissionStatementService(context);
                var service = new CommissionImportService(context, statementService, null, policyService, lookupService);

                //When
                var import1 = new ImportCommission
                {
                    PolicyNumber = "123456",
                    CommissionTypeCode = "gap_cover",
                    AmountIncludingVAT = "abc", //Bad format
                    VAT = "zzz" //Bad format
                };

                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = (await service.ImportCommissions(scope, statement.Id, new List<ImportCommission>() { import1 })).Single();

                //Then
                Assert.IsFalse(result.Success);
                Assert.AreEqual(2, result.ValidationFailures.Count);
                Assert.AreEqual("'Amount' must be a number", result.ValidationFailures[0].ErrorMessage);
                Assert.AreEqual("'VAT' must be a number", result.ValidationFailures[1].ErrorMessage);

                //Check error record
                var actual = await context.CommissionError.SingleAsync();

                Assert.AreEqual(null, actual.MemberId);
                Assert.AreEqual(null, actual.PolicyId);
                Assert.AreEqual(null, actual.CommissionTypeId);

                Assert.AreEqual(statement.Id, actual.CommissionStatementId);

                Assert.AreEqual(false, actual.IsFormatValid);
                Assert.AreEqual(JsonConvert.SerializeObject(import1), actual.Data);
            }
        }


        [TestMethod]
        public async Task ImportCommission_NoMapping_SetCommisionType()
        {
            var options = TestHelper.GetDbContext("ImportCommission_SetCommisionType");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation);

            var commissionType = new CommissionTypeEntity
            {
                Id = Guid.NewGuid(),
                Code = "gap_cover"
            };

            using (var context = new DataContext(options))
            {
                context.CommissionType.Add(commissionType);
                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var statementService = new CommissionStatementService(context);
                var lookupService = new LookupService(context);
                var policyService = new PolicyService(context);
                var service = new CommissionImportService(context, statementService, null, policyService, lookupService);

                //When
                var import1 = new ImportCommission
                {
                    PolicyNumber = "123456",
                    CommissionTypeCode = "gap_cover", //existing cover
                    AmountIncludingVAT = "100",
                    VAT = "14"
                };

                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = (await service.ImportCommissions(scope, statement.Id, new List<ImportCommission>() { import1 })).Single();

                //Then
                Assert.IsFalse(result.Success);
                Assert.AreEqual(0, result.ValidationFailures.Count);

                //Check error record
                var actual = await context.CommissionError.SingleAsync();

                Assert.AreEqual(null, actual.MemberId);
                Assert.AreEqual(null, actual.PolicyId);
                Assert.AreEqual(commissionType.Id, actual.CommissionTypeId);

                Assert.AreEqual(statement.Id, actual.CommissionStatementId);

                Assert.AreEqual(true, actual.IsFormatValid);
                Assert.AreEqual(JsonConvert.SerializeObject(import1), actual.Data);
            }
        }

        [TestMethod]
        public async Task ImportCommission_NoMapping_SetPolicyAndMember()
        {
            var options = TestHelper.GetDbContext("ImportCommission_SetPolicyAndMember");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var companyId = Guid.NewGuid();
            var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation, companyId);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = companyId,
                MemberId = member1.Member.Id,
                UserId = user1.User.Id
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policy1);
                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var statementService = new CommissionStatementService(context);
                var lookupService = new LookupService(context);
                var policyService = new PolicyService(context);
                var service = new CommissionImportService(context, statementService, null, policyService, lookupService);

                //When
                var import1 = new ImportCommission
                {
                    PolicyNumber = policy1.Number,
                    CommissionTypeCode = "gap_cover",
                    AmountIncludingVAT = "100",
                    VAT = "14"
                };

                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = (await service.ImportCommissions(scope, statement.Id, new List<ImportCommission>() { import1 })).Single();

                //Then
                Assert.IsFalse(result.Success);
                Assert.AreEqual(0, result.ValidationFailures.Count);

                //Check error record
                var actual = await context.CommissionError.SingleAsync();

                Assert.AreEqual(policy1.MemberId, actual.MemberId);
                Assert.AreEqual(policy1.Id, actual.PolicyId);
                Assert.AreEqual(null, actual.CommissionTypeId);

                Assert.AreEqual(statement.Id, actual.CommissionStatementId);

                Assert.AreEqual(true, actual.IsFormatValid);
                Assert.AreEqual(JsonConvert.SerializeObject(import1), actual.Data);
            }
        }

        [TestMethod]
        public async Task ImportCommission_InsertCommission()
        {
            var options = TestHelper.GetDbContext("ImportCommission_InsertCommission");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var companyId = Guid.NewGuid();
            var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation, companyId);

            var commissionType = new CommissionTypeEntity
            {
                Id = Guid.NewGuid(),
                Code = "gap_cover"
            };

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = companyId,
                MemberId = member1.Member.Id,
                UserId = user1.User.Id
            };

            using (var context = new DataContext(options))
            {
                context.CommissionType.Add(commissionType);
                context.Policy.Add(policy1);
                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var statementService = new CommissionStatementService(context);
                var lookupService = new LookupService(context);
                var policyService = new PolicyService(context);
                var commissionService = new CommissionService(context);
                var service = new CommissionImportService(context, statementService, commissionService, policyService, lookupService);

                //When
                var import1 = new ImportCommission
                {
                    PolicyNumber = policy1.Number,
                    CommissionTypeCode = commissionType.Code,
                    AmountIncludingVAT = "100",
                    VAT = "14"
                };

                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = (await service.ImportCommissions(scope, statement.Id, new List<ImportCommission>() { import1 })).Single();

                //Then
                Assert.IsTrue(result.Success);

                //Check error record
                var anyErrors = await context.CommissionError.AnyAsync();

                Assert.IsFalse(anyErrors);

                var actual = await context.Commission.FindAsync(((CommissionEdit)result.Tag).Id);
                Assert.AreEqual(policy1.Id, actual.PolicyId);
                Assert.AreEqual(commissionType.Id, actual.CommissionTypeId);
                Assert.AreEqual(100, actual.AmountIncludingVAT);
                Assert.AreEqual(14, actual.VAT);
                Assert.AreEqual(statement.Id, actual.CommissionStatementId);
            }
        }

        [TestMethod]
        public async Task ImportCommission_InsertCommission_NegitiveAmmount()
        {
            var options = TestHelper.GetDbContext("ImportCommission_InsertCommission_NegitiveAmmount");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var companyId = Guid.NewGuid();
            var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation, companyId);

            var commissionType = new CommissionTypeEntity
            {
                Id = Guid.NewGuid(),
                Code = "gap_cover"
            };

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = Guid.NewGuid().ToString(),
                CompanyId = companyId,
                MemberId = member1.Member.Id,
                UserId = user1.User.Id
            };

            using (var context = new DataContext(options))
            {
                context.CommissionType.Add(commissionType);
                context.Policy.Add(policy1);
                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var statementService = new CommissionStatementService(context);
                var lookupService = new LookupService(context);
                var policyService = new PolicyService(context);
                var commissionService = new CommissionService(context);
                var service = new CommissionImportService(context, statementService, commissionService, policyService, lookupService);

                //When
                var import1 = new ImportCommission
                {
                    PolicyNumber = policy1.Number,
                    CommissionTypeCode = commissionType.Code,
                    AmountIncludingVAT = "-100",
                    VAT = "-14"
                };

                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = (await service.ImportCommissions(scope, statement.Id, new List<ImportCommission>() { import1 })).Single();

                //Then
                Assert.IsTrue(result.Success);

                //Check error record
                var anyErrors = await context.CommissionError.AnyAsync();

                Assert.IsFalse(anyErrors);

                var actual = await context.Commission.FindAsync(((CommissionEdit)result.Tag).Id);
                Assert.AreEqual(policy1.Id, actual.PolicyId);
                Assert.AreEqual(commissionType.Id, actual.CommissionTypeId);
                Assert.AreEqual(-100, actual.AmountIncludingVAT);
                Assert.AreEqual(-14, actual.VAT);
                Assert.AreEqual(statement.Id, actual.CommissionStatementId);
            }
        }


    }
}