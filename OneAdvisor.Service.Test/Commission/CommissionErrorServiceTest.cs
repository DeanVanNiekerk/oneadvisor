using System;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Model.Commission.Model.CommissionError;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Commission;

namespace OneAdvisor.Service.Test.Commission
{
    [TestClass]
    public class CommissionErrorServiceTest
    {
        [TestMethod]
        public async Task GetNextError_ValidFormat()
        {
            var options = TestHelper.GetDbContext("GetNextError_ValidFormat");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation);

            var error1 = new CommissionErrorEntity
            {
                PolicyNumber = "123456",
                CommissionTypeCode = "gap_cover",
                CommissionStatementId = statement.Id,
                IsFormatValid = true,
                PolicyId = Guid.NewGuid(),
                MemberId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                Data = "Data"
            };

            var error2 = new CommissionErrorEntity
            {
                PolicyNumber = "654321",
                IsFormatValid = false
            };

            using (var context = new DataContext(options))
            {
                context.CommissionError.Add(error1);
                context.CommissionError.Add(error2);
                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionErrorService(context, null);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var actual = await service.GetNextError(scope, statement.Id, true);

                //Then
                Assert.AreEqual(error1.PolicyNumber, actual.PolicyNumber);
                Assert.AreEqual(error1.CommissionTypeCode, actual.CommissionTypeCode);
                Assert.AreEqual(error1.CommissionStatementId, actual.CommissionStatementId);
                Assert.AreEqual(error1.IsFormatValid, actual.IsFormatValid);
                Assert.AreEqual(error1.PolicyId, actual.PolicyId);
                Assert.AreEqual(error1.MemberId, actual.MemberId);
                Assert.AreEqual(error1.CommissionTypeId, actual.CommissionTypeId);
                Assert.AreEqual(error1.Data, actual.Data);
            }
        }

        [TestMethod]
        public async Task GetNextError_InvalidFormat()
        {
            var options = TestHelper.GetDbContext("GetNextError_InvalidFormat");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation);

            var error1 = new CommissionErrorEntity
            {
                PolicyNumber = "123456",
                CommissionStatementId = statement.Id,
                IsFormatValid = true,
            };

            var error2 = new CommissionErrorEntity
            {
                PolicyNumber = "654321",
                CommissionStatementId = statement.Id,
                IsFormatValid = false
            };

            using (var context = new DataContext(options))
            {
                context.CommissionError.Add(error1);
                context.CommissionError.Add(error2);
                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new CommissionErrorService(context, null);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var actual = await service.GetNextError(scope, statement.Id, false);

                //Then
                Assert.AreEqual(error2.PolicyNumber, actual.PolicyNumber);
            }
        }

        [TestMethod]
        public async Task ResolveFormatError_Fail()
        {
            var options = TestHelper.GetDbContext("ResolveFormatError_Fail");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation);

            var ic1 = new ImportCommission
            {
                PolicyNumber = "123456",
                CommissionTypeCode = "gap_cover",
                AmountIncludingVAT = "abc", //Bad format
                VAT = "zzz" //Bad format
            };

            var error1 = new CommissionError
            {
                PolicyNumber = "123456",
                CommissionTypeCode = "gap_cover",
                CommissionStatementId = statement.Id,
                IsFormatValid = true,
                PolicyId = Guid.NewGuid(),
                MemberId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                Data = JsonConvert.SerializeObject(ic1)
            };

            using (var context = new DataContext(options))
            {
                var service = new CommissionErrorService(context, null);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = await service.ResolveFormatError(scope, error1);

                //Then
                Assert.IsFalse(result.Success);

                Assert.AreEqual(2, result.ValidationFailures.Count);
                Assert.AreEqual("'Amount' must be a number", result.ValidationFailures[0].ErrorMessage);
            }
        }
        /*
                [TestMethod]
                public async Task ResolveFormatError_Pass()
                {
                    var options = TestHelper.GetDbContext("ResolveFormatError_Pass");

                    var user1 = TestHelper.InsertDefaultUserDetailed(options);
                    var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation);

                    var error1 = new CommissionErrorEntity
                    {
                        PolicyNumber = "123456",
                        CommissionTypeCode = "gap_cover",
                        CommissionStatementId = statement.Id,
                        IsFormatValid = false,
                        PolicyId = Guid.NewGuid(),
                        MemberId = Guid.NewGuid(),
                        CommissionTypeId = Guid.NewGuid(),
                        Data = "Data"
                    };

                    var ic1 = new ImportCommission
                    {
                        PolicyNumber = "123456",
                        CommissionTypeCode = "gap_cover",
                        AmountIncludingVAT = "22",
                        VAT = "33"
                    };

                    var error1 = new CommissionError
                    {
                        PolicyNumber = "123456",
                        CommissionTypeCode = "gap_cover",
                        CommissionStatementId = statement.Id,
                        IsFormatValid = true,
                        PolicyId = Guid.NewGuid(),
                        MemberId = Guid.NewGuid(),
                        CommissionTypeId = Guid.NewGuid(),
                        Data = JsonConvert.SerializeObject(ic1)
                    };

                    using (var context = new DataContext(options))
                    {
                        var service = new CommissionErrorService(context, null);

                        //When
                        var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                        var result = await service.ResolveFormatError(scope, error1);

                        //Then
                        Assert.IsFalse(result.Success);

                        Assert.AreEqual(2, result.ValidationFailures.Count);
                        Assert.AreEqual("'Amount' must be a number", result.ValidationFailures[0].ErrorMessage);
                    }
                }



                [TestMethod]
                public async Task ImportCommission_BadFormat_UpdateError()
                {
                    var options = TestHelper.GetDbContext("ImportCommission_BadFormat_UpdateError");

                    var user1 = TestHelper.InsertDefaultUserDetailed(options);
                    var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation);

                    var ic1 = new ImportCommission
                    {
                        PolicyNumber = "123456",
                        CommissionTypeCode = "gap_cover",
                        AmountIncludingVAT = "abc", //Bad format
                        VAT = "zzz" //Bad format
                    };

                    var error = new CommissionErrorEntity
                    {
                        PolicyNumber = "123456",
                        CommissionTypeCode = "gap_cover",
                        CommissionStatementId = statement.Id,
                        Data = JsonConvert.SerializeObject(ic1)
                    };

                    using (var context = new DataContext(options))
                    {
                        context.CommissionError.Add(error);
                        context.SaveChanges();
                    }

                    using (var context = new DataContext(options))
                    {
                        var service = new CommissionImportService(context, null, null, null);

                        //When
                        var import1 = new ImportCommission
                        {
                            PolicyNumber = ic1.PolicyNumber,
                            CommissionTypeCode = ic1.CommissionTypeCode,
                            AmountIncludingVAT = "zxc", //Bad format
                            VAT = "14"
                        };

                        var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);

                        var result = await service.ImportCommission(scope, statement.Id, import1);

                        //Then
                        Assert.IsFalse(result.Success);
                        Assert.AreEqual(1, result.ValidationFailures.Count);
                        Assert.AreEqual("'Amount' must be a number", result.ValidationFailures[0].ErrorMessage);

                        //Check error record
                        var actual = await context.CommissionError.SingleAsync();

                        Assert.AreEqual(null, actual.MemberId);
                        Assert.AreEqual(null, actual.PolicyId);
                        Assert.AreEqual(import1.PolicyNumber, actual.PolicyNumber);

                        Assert.AreEqual(null, actual.CommissionTypeId);
                        Assert.AreEqual(import1.CommissionTypeCode, actual.CommissionTypeCode);

                        Assert.AreEqual(statement.Id, actual.CommissionStatementId);

                        Assert.AreEqual(false, actual.IsFormatValid);
                        Assert.AreEqual(JsonConvert.SerializeObject(import1), actual.Data);
                    }
                }

                [TestMethod]
                public async Task ImportCommission_UpdateCommission()
                {
                    var options = TestHelper.GetDbContext("ImportCommission_UpdateCommission");

                    var user1 = TestHelper.InsertDefaultUserDetailed(options);
                    var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

                    var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation);

                    var commissionType = new CommissionTypeEntity
                    {
                        Id = Guid.NewGuid(),
                        Code = "gap_cover"
                    };

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
                        VAT = 9,
                        CommissionStatementId = statement.Id
                    };

                    var commission2 = new CommissionEntity
                    {
                        Id = Guid.NewGuid(),
                        PolicyId = policy1.Id,
                        CommissionTypeId = commissionType.Id,
                        AmountIncludingVAT = 88,
                        VAT = 8,
                        CommissionStatementId = statement.Id
                    };

                    var commission3 = new CommissionEntity
                    {
                        Id = Guid.NewGuid(),
                        PolicyId = policy1.Id,
                        CommissionTypeId = Guid.NewGuid(),
                        AmountIncludingVAT = 77,
                        VAT = 7,
                        CommissionStatementId = statement.Id
                    };

                    using (var context = new DataContext(options))
                    {
                        context.CommissionType.Add(commissionType);
                        context.Policy.Add(policy1);
                        context.Commission.Add(commission1);
                        context.Commission.Add(commission2);
                        context.Commission.Add(commission3);
                        context.SaveChanges();
                    }

                    using (var context = new DataContext(options))
                    {
                        var lookupService = new LookupService(context);
                        var policyService = new PolicyService(context);
                        var commissionService = new CommissionService(context);
                        var service = new CommissionImportService(context, commissionService, policyService, lookupService);

                        //When
                        var import1 = new ImportCommission
                        {
                            PolicyNumber = policy1.Number,
                            CommissionTypeCode = commissionType.Code,
                            AmountIncludingVAT = "222",
                            VAT = "22"
                        };

                        var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);

                        var result = await service.ImportCommission(scope, statement.Id, import1);

                        //Then
                        Assert.IsTrue(result.Success);

                        //Check error record
                        var anyErrors = await context.CommissionError.AnyAsync();

                        Assert.IsFalse(anyErrors);

                        var actual = await context.Commission.FindAsync(commission2.Id);
                        Assert.AreEqual(policy1.Id, actual.PolicyId);
                        Assert.AreEqual(commissionType.Id, actual.CommissionTypeId);
                        Assert.AreEqual(222, actual.AmountIncludingVAT);
                        Assert.AreEqual(22, actual.VAT);
                        Assert.AreEqual(statement.Id, actual.CommissionStatementId);

                        actual = await context.Commission.FindAsync(commission1.Id);
                        Assert.AreEqual(99, actual.AmountIncludingVAT);
                        Assert.AreEqual(9, actual.VAT);

                        actual = await context.Commission.FindAsync(commission3.Id);
                        Assert.AreEqual(77, actual.AmountIncludingVAT);
                        Assert.AreEqual(7, actual.VAT);
                    }
                }

                 */
    }
}