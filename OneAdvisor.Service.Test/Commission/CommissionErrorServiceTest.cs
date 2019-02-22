using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Data.Entities.Directory.Lookup;
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
                CommissionStatementId = statement.Id,
                IsFormatValid = true,
                PolicyId = Guid.NewGuid(),
                MemberId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                Data = "Data"
            };

            var error2 = new CommissionErrorEntity
            {
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
                var scope = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetNextError(scope, statement.Id, true);

                //Then
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
                Id = Guid.NewGuid(),
                CommissionStatementId = statement.Id,
                IsFormatValid = true,
            };

            var error2 = new CommissionErrorEntity
            {
                Id = Guid.NewGuid(),
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
                var scope = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetNextError(scope, statement.Id, false);

                //Then
                Assert.AreEqual(error2.Id, actual.Id);
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
                var scope = TestHelper.GetScopeOptions(user1);
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

            var ic1 = new ImportCommission
            {
                PolicyNumber = "123456",
                CommissionTypeCode = "gap_cover",
                AmountIncludingVAT = "bad",
                VAT = "33"
            };

            var err = new CommissionErrorEntity
            {
                Id = Guid.NewGuid(),
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
                ic1.AmountIncludingVAT = "22"; //Fixed

                var error1 = new CommissionError
                {
                    Id = err.Id,
                    CommissionStatementId = statement.Id,
                    IsFormatValid = false,
                    Data = JsonConvert.SerializeObject(ic1)
                };

                var commissionService = new CommissionService(context);
                var service = new CommissionErrorService(context, commissionService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
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
                    CommissionStatementId = statement.Id,
                    IsFormatValid = true,
                    Data = "Data"
                };

                var commissionService = new CommissionService(context);
                var service = new CommissionErrorService(context, commissionService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.ResolveMappingError(scope, error1);

                //Then
                Assert.IsFalse(result.Success);

                Assert.AreEqual(3, result.ValidationFailures.Count);
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
                CommissionStatementId = statement.Id,
                IsFormatValid = true,
                Data = JsonConvert.SerializeObject(ic1)
            };

            var err2 = new CommissionErrorEntity
            {
                Id = Guid.NewGuid(),
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
                    CommissionStatementId = statement.Id,
                    IsFormatValid = true,
                    PolicyId = policy1.Id,
                    MemberId = policy1.MemberId,
                    CommissionTypeId = Guid.NewGuid(),
                    Data = JsonConvert.SerializeObject(ic1)
                };

                var commissionService = new CommissionService(context);
                var service = new CommissionErrorService(context, commissionService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
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
                    CommissionStatementId = statement.Id,
                    IsFormatValid = true,
                    PolicyId = policy1.Id,
                    MemberId = policy1.MemberId,
                    CommissionTypeId = Guid.NewGuid(),
                    Data = JsonConvert.SerializeObject(ic2)
                };

                var commissionService = new CommissionService(context);
                var service = new CommissionErrorService(context, commissionService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
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


        [TestMethod]
        public async Task AutoResolveMappingErrors_4Entries_AutoResolve3()
        {
            var options = TestHelper.GetDbContext("AutoResolveMappingErrors_4Entries_AutoResolve3");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation);

            var commissionTypeId = Guid.NewGuid();

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                Number = "123456",
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user1.User.Id
            };

            // ENTRY 1: POLICY 1 -----------------------
            var ic1a = new ImportCommission
            {
                PolicyNumber = policy1.Number,
                CommissionTypeCode = "gap_cover",
                AmountIncludingVAT = "11",
                VAT = "22"
            };

            var err1a = new CommissionErrorEntity
            {
                Id = Guid.NewGuid(),
                CommissionStatementId = statement.Id,
                CommissionTypeId = commissionTypeId,
                IsFormatValid = true,
                Data = JsonConvert.SerializeObject(ic1a)
            };
            //------------------------------------------


            // ENTRY 2: POLICY 1 -----------------------
            var ic1b = new ImportCommission
            {
                PolicyNumber = policy1.Number,
                CommissionTypeCode = "gap_cover",
                AmountIncludingVAT = "33",
                VAT = "44"
            };

            var err1b = new CommissionErrorEntity
            {
                Id = Guid.NewGuid(),
                CommissionStatementId = statement.Id,
                CommissionTypeId = commissionTypeId,
                IsFormatValid = true,
                Data = JsonConvert.SerializeObject(ic1b)
            };
            //------------------------------------------


            // ENTRY 3: POLICY ? -----------------------
            var ic2 = new ImportCommission
            {
                PolicyNumber = "654321",
                CommissionTypeCode = "gap_cover",
                AmountIncludingVAT = "55",
                VAT = "66"
            };

            var err2 = new CommissionErrorEntity
            {
                Id = Guid.NewGuid(),
                CommissionStatementId = statement.Id,
                CommissionTypeId = commissionTypeId,
                IsFormatValid = false,
                Data = JsonConvert.SerializeObject(ic2)
            };
            //------------------------------------------


            // ENTRY 4: POLICY 1 -----------------------
            var ic1c = new ImportCommission
            {
                PolicyNumber = policy1.Number,
                CommissionTypeCode = "gap_cover",
                AmountIncludingVAT = "77",
                VAT = "88"
            };
            var err1c = new CommissionErrorEntity
            {
                Id = Guid.NewGuid(),
                CommissionStatementId = statement.Id,
                CommissionTypeId = commissionTypeId,
                IsFormatValid = true,
                Data = JsonConvert.SerializeObject(ic1c)
            };
            //------------------------------------------


            using (var context = new DataContext(options))
            {
                context.CommissionError.Add(err1a);
                context.CommissionError.Add(err2);
                context.CommissionError.Add(err1b);
                context.CommissionError.Add(err1c);

                context.Policy.Add(policy1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var error1 = new CommissionError
                {
                    Id = err1a.Id,
                    CommissionStatementId = statement.Id,
                    IsFormatValid = true,
                    PolicyId = policy1.Id,
                    MemberId = policy1.MemberId,
                    CommissionTypeId = err1a.CommissionTypeId,
                    Data = JsonConvert.SerializeObject(ic1a)
                };

                var commissionService = new CommissionService(context);
                var service = new CommissionErrorService(context, commissionService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                await service.AutoResolveMappingErrors(scope, statement.Id, policy1.Id);

                //Then
                var actualErrors = context.CommissionError.ToList();

                Assert.AreEqual(1, actualErrors.Count);
                Assert.AreEqual(err2.Id, actualErrors[0].Id);

                var commissions = context.Commission.ToList();

                Assert.AreEqual(3, commissions.Count);
                var actual = commissions[0];
                Assert.AreEqual(error1.PolicyId, actual.PolicyId);
                Assert.AreEqual(error1.CommissionStatementId, actual.CommissionStatementId);
                Assert.AreEqual(error1.CommissionTypeId, actual.CommissionTypeId);
                Assert.AreEqual(11, actual.AmountIncludingVAT);
                Assert.AreEqual(22, actual.VAT);

                actual = commissions[1];
                Assert.AreEqual(error1.PolicyId, actual.PolicyId);
                Assert.AreEqual(error1.CommissionStatementId, actual.CommissionStatementId);
                Assert.AreEqual(error1.CommissionTypeId, actual.CommissionTypeId);
                Assert.AreEqual(33, actual.AmountIncludingVAT);
                Assert.AreEqual(44, actual.VAT);

                actual = commissions[2];
                Assert.AreEqual(error1.PolicyId, actual.PolicyId);
                Assert.AreEqual(error1.CommissionStatementId, actual.CommissionStatementId);
                Assert.AreEqual(error1.CommissionTypeId, actual.CommissionTypeId);
                Assert.AreEqual(77, actual.AmountIncludingVAT);
                Assert.AreEqual(88, actual.VAT);

            }
        }
    }
}