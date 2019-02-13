using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Data.Entities.Member;
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

        [TestMethod]
        public async Task ResolveFormatError_Pass()
        {
            var options = TestHelper.GetDbContext("ResolveFormatError_Pass");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation);

            var err = new CommissionErrorEntity
            {
                Id = Guid.NewGuid(),
                PolicyNumber = "123456",
                CommissionTypeCode = "gap_cover",
                CommissionStatementId = statement.Id,
                IsFormatValid = false,
                Data = "Data"
            };

            using (var context = new DataContext(options))
            {
                context.CommissionError.Add(err);
                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var ic1 = new ImportCommission
                {
                    PolicyNumber = "123456",
                    CommissionTypeCode = "gap_cover",
                    AmountIncludingVAT = "22",
                    VAT = "33"
                };

                var error1 = new CommissionError
                {
                    Id = err.Id,
                    PolicyNumber = "123456",
                    CommissionTypeCode = "gap_cover",
                    CommissionStatementId = statement.Id,
                    IsFormatValid = false,
                    Data = JsonConvert.SerializeObject(ic1)
                };

                var commissionService = new CommissionService(context);
                var service = new CommissionErrorService(context, commissionService);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = await service.ResolveFormatError(scope, error1);

                //Then
                Assert.IsTrue(result.Success);

                var actual = context.CommissionError.Find(err.Id);

                Assert.AreEqual(true, actual.IsFormatValid);
                Assert.AreEqual(error1.Data, actual.Data);
            }
        }

        [TestMethod]
        public async Task ResolveMappingError_Fail()
        {
            var options = TestHelper.GetDbContext("ResolveMappingError_Fail");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation);

            using (var context = new DataContext(options))
            {
                var error1 = new CommissionError
                {
                    Id = Guid.NewGuid(),
                    PolicyNumber = "123456",
                    CommissionTypeCode = "gap_cover",
                    CommissionStatementId = statement.Id,
                    IsFormatValid = true,
                    Data = "Data"
                };

                var commissionService = new CommissionService(context);
                var service = new CommissionErrorService(context, commissionService);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = await service.ResolveMappingError(scope, error1);

                //Then
                Assert.IsFalse(result.Success);

                Assert.AreEqual(2, result.ValidationFailures.Count);
                Assert.AreEqual("'Policy' must not be empty.", result.ValidationFailures[0].ErrorMessage);
            }
        }

        [TestMethod]
        public async Task ResolveMappingError_Pass()
        {
            var options = TestHelper.GetDbContext("ResolveMappingError_Pass");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user1.User.Id
            };

            var ic1 = new ImportCommission
            {
                PolicyNumber = "123456",
                CommissionTypeCode = "gap_cover",
                AmountIncludingVAT = "22",
                VAT = "33"
            };

            var err1 = new CommissionErrorEntity
            {
                Id = Guid.NewGuid(),
                PolicyNumber = "123456",
                CommissionTypeCode = "gap_cover",
                CommissionStatementId = statement.Id,
                IsFormatValid = true,
                Data = JsonConvert.SerializeObject(ic1)
            };

            var err2 = new CommissionErrorEntity
            {
                Id = Guid.NewGuid(),
                PolicyNumber = "11111",
                CommissionTypeCode = "gap_cover",
                CommissionStatementId = statement.Id,
                IsFormatValid = false,
                Data = "Data"
            };

            using (var context = new DataContext(options))
            {
                context.CommissionError.Add(err1);
                context.CommissionError.Add(err2);

                context.Policy.Add(policy1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var error1 = new CommissionError
                {
                    Id = err1.Id,
                    PolicyNumber = "123456",
                    CommissionTypeCode = "gap_cover",
                    CommissionStatementId = statement.Id,
                    IsFormatValid = true,
                    PolicyId = policy1.Id,
                    CommissionTypeId = Guid.NewGuid(),
                    Data = JsonConvert.SerializeObject(ic1)
                };

                var commissionService = new CommissionService(context);
                var service = new CommissionErrorService(context, commissionService);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = await service.ResolveMappingError(scope, error1);

                //Then
                Assert.IsTrue(result.Success);

                var actualError = context.CommissionError.Single();

                Assert.AreEqual(err2.Id, actualError.Id);

                var actual = context.Commission.Single();

                Assert.AreEqual(error1.PolicyId, actual.PolicyId);
                Assert.AreEqual(error1.CommissionStatementId, actual.CommissionStatementId);
                Assert.AreEqual(error1.CommissionTypeId, actual.CommissionTypeId);
                Assert.AreEqual(22, actual.AmountIncludingVAT);
                Assert.AreEqual(33, actual.VAT);

            }
        }

        [TestMethod]
        public async Task ResolveFormatAndMappingError_Pass()
        {
            var options = TestHelper.GetDbContext("ResolveFormatAndMappingError_Pass");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation);

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user1.User.Id
            };

            var ic1 = new ImportCommission
            {
                PolicyNumber = "123456",
                CommissionTypeCode = "gap_cover",
                AmountIncludingVAT = "aa",
                VAT = "33"
            };

            var err1 = new CommissionErrorEntity
            {
                Id = Guid.NewGuid(),
                PolicyNumber = "123456",
                CommissionTypeCode = "gap_cover",
                CommissionStatementId = statement.Id,
                IsFormatValid = true,
                Data = JsonConvert.SerializeObject(ic1)
            };

            using (var context = new DataContext(options))
            {
                context.CommissionError.Add(err1);

                context.Policy.Add(policy1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var ic2 = new ImportCommission
                {
                    PolicyNumber = "123456",
                    CommissionTypeCode = "gap_cover",
                    AmountIncludingVAT = "55",
                    VAT = "33"
                };

                var error1 = new CommissionError
                {
                    Id = err1.Id,
                    PolicyNumber = "123456",
                    CommissionTypeCode = "gap_cover",
                    CommissionStatementId = statement.Id,
                    IsFormatValid = true,
                    PolicyId = policy1.Id,
                    CommissionTypeId = Guid.NewGuid(),
                    Data = JsonConvert.SerializeObject(ic2)
                };

                var commissionService = new CommissionService(context);
                var service = new CommissionErrorService(context, commissionService);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = await service.ResolveFormatError(scope, error1);

                //Then
                Assert.IsTrue(result.Success);

                var actualError = context.CommissionError.FirstOrDefault();
                Assert.IsNull(actualError);

                var actual = context.Commission.Single();

                Assert.AreEqual(error1.PolicyId, actual.PolicyId);
                Assert.AreEqual(error1.CommissionStatementId, actual.CommissionStatementId);
                Assert.AreEqual(error1.CommissionTypeId, actual.CommissionTypeId);
                Assert.AreEqual(55, actual.AmountIncludingVAT);
                Assert.AreEqual(33, actual.VAT);

            }
        }
    }
}