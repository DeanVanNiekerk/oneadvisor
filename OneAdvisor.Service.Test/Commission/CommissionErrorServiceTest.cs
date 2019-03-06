using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
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

    public class CommissionErrorServiceTest
    {
        [Fact]
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
                Data = new ImportCommission()
            };

            var error2 = new CommissionErrorEntity
            {
                IsFormatValid = false
            };

            using (var context = new DataContext(options))
            {
                context.CommissionError.Add(error2);
                context.CommissionError.Add(error1);
                context.SaveChanges();

                var service = new CommissionErrorService(context, null);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetNextError(scope, statement.Id, true);

                //Then
                Assert.Equal(error1.CommissionStatementId, actual.CommissionStatementId);
                Assert.Equal(error1.IsFormatValid, actual.IsFormatValid);
                Assert.Equal(error1.PolicyId, actual.PolicyId);
                Assert.Equal(error1.MemberId, actual.MemberId);
                Assert.Equal(error1.CommissionTypeId, actual.CommissionTypeId);
                Assert.Equal(error1.Data, actual.Data);
            }
        }

        [Fact]
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
                context.CommissionError.Add(error2);
                context.CommissionError.Add(error1);
                context.SaveChanges();

                var service = new CommissionErrorService(context, null);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetNextError(scope, statement.Id, false);

                //Then
                Assert.Equal(error2.Id, actual.Id);
            }
        }

        [Fact]
        public async Task GetError()
        {
            var options = TestHelper.GetDbContext("GetError");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation);

            var error1 = new CommissionErrorEntity
            {
                Id = Guid.NewGuid(),
                CommissionStatementId = statement.Id,
                IsFormatValid = true,
                PolicyId = Guid.NewGuid(),
                MemberId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                Data = new ImportCommission()
            };

            var error2 = new CommissionErrorEntity
            {
                IsFormatValid = false
            };

            using (var context = new DataContext(options))
            {
                context.CommissionError.Add(error2);
                context.CommissionError.Add(error1);
                context.SaveChanges();

                var service = new CommissionErrorService(context, null);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetError(scope, error1.Id);

                //Then
                Assert.Equal(error1.CommissionStatementId, actual.CommissionStatementId);
                Assert.Equal(error1.IsFormatValid, actual.IsFormatValid);
                Assert.Equal(error1.PolicyId, actual.PolicyId);
                Assert.Equal(error1.MemberId, actual.MemberId);
                Assert.Equal(error1.CommissionTypeId, actual.CommissionTypeId);
                Assert.Equal(error1.Data, actual.Data);
            }
        }

        [Fact]
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
                Data = ic1
            };

            using (var context = new DataContext(options))
            {
                var service = new CommissionErrorService(context, null);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.ResolveFormatError(scope, error1);

                //Then
                Assert.False(result.Success);

                Assert.Equal(2, result.ValidationFailures.Count);
                Assert.Equal("'Amount' must be a number", result.ValidationFailures[0].ErrorMessage);
            }
        }

        [Fact]
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
                Data = new ImportCommission()
            };

            using (var context = new DataContext(options))
            {
                context.CommissionError.Add(err);
                context.SaveChanges();

                ic1.AmountIncludingVAT = "22"; //Fixed

                var error1 = new CommissionError
                {
                    Id = err.Id,
                    CommissionStatementId = statement.Id,
                    IsFormatValid = false,
                    Data = ic1
                };

                var commissionService = new CommissionService(context);
                var service = new CommissionErrorService(context, commissionService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.ResolveFormatError(scope, error1);

                //Then
                Assert.True(result.Success);

                var actual = context.CommissionError.Find(err.Id);

                Assert.Equal(true, actual.IsFormatValid);
                Assert.Equal(error1.Data, actual.Data);
            }
        }

        [Fact]
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
                    Data = new ImportCommission()
                };

                var commissionService = new CommissionService(context);
                var service = new CommissionErrorService(context, commissionService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.ResolveMappingError(scope, error1);

                //Then
                Assert.False(result.Success);

                Assert.Equal(3, result.ValidationFailures.Count);
                Assert.Equal("'Policy' must not be empty.", result.ValidationFailures[0].ErrorMessage);
            }
        }

        [Fact]
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
                Data = ic1
            };

            var err2 = new CommissionErrorEntity
            {
                Id = Guid.NewGuid(),
                CommissionStatementId = statement.Id,
                IsFormatValid = false,
                Data = new ImportCommission()
            };

            using (var context = new DataContext(options))
            {
                context.CommissionError.Add(err1);
                context.CommissionError.Add(err2);

                context.Policy.Add(policy1);

                context.SaveChanges();

                var error1 = new CommissionError
                {
                    Id = err1.Id,
                    CommissionStatementId = statement.Id,
                    IsFormatValid = true,
                    PolicyId = policy1.Id,
                    MemberId = policy1.MemberId,
                    CommissionTypeId = Guid.NewGuid(),
                    Data = ic1
                };

                var commissionService = new CommissionService(context);
                var service = new CommissionErrorService(context, commissionService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.ResolveMappingError(scope, error1);

                //Then
                Assert.True(result.Success);

                var actualError = context.CommissionError.Single();

                Assert.Equal(err2.Id, actualError.Id);

                var actual = context.Commission.Single();

                Assert.Equal(error1.PolicyId, actual.PolicyId);
                Assert.Equal(error1.CommissionStatementId, actual.CommissionStatementId);
                Assert.Equal(error1.CommissionTypeId, actual.CommissionTypeId);
                Assert.Equal(22, actual.AmountIncludingVAT);
                Assert.Equal(33, actual.VAT);
                Assert.Equal(error1.Data, actual.SourceData);

            }
        }

        [Fact]
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
                Data = ic1
            };

            using (var context = new DataContext(options))
            {
                context.CommissionError.Add(err1);

                context.Policy.Add(policy1);

                context.SaveChanges();

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
                    Data = ic2
                };

                var commissionService = new CommissionService(context);
                var service = new CommissionErrorService(context, commissionService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.ResolveFormatError(scope, error1);

                //Then
                Assert.True(result.Success);

                var actualError = context.CommissionError.FirstOrDefault();
                Assert.Null(actualError);

                var actual = context.Commission.Single();

                Assert.Equal(error1.PolicyId, actual.PolicyId);
                Assert.Equal(error1.CommissionStatementId, actual.CommissionStatementId);
                Assert.Equal(error1.CommissionTypeId, actual.CommissionTypeId);
                Assert.Equal(55, actual.AmountIncludingVAT);
                Assert.Equal(33, actual.VAT);
                Assert.Equal(error1.Data, actual.SourceData);

            }
        }


        [Fact]
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
                Data = ic1a
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
                Data = ic1b
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
                Data = ic2
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
                Data = ic1c
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

                var error1 = new CommissionError
                {
                    Id = err1a.Id,
                    CommissionStatementId = statement.Id,
                    IsFormatValid = true,
                    PolicyId = policy1.Id,
                    MemberId = policy1.MemberId,
                    CommissionTypeId = err1a.CommissionTypeId,
                    Data = ic1a
                };

                var commissionService = new CommissionService(context);
                var service = new CommissionErrorService(context, commissionService);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                await service.AutoResolveMappingErrors(scope, statement.Id, policy1.Id);

                //Then
                var actualErrors = context.CommissionError.ToList();

                Assert.Equal(1, actualErrors.Count);
                Assert.Equal(err2.Id, actualErrors[0].Id);

                var commissions = context.Commission.ToList();

                Assert.Equal(3, commissions.Count);
                var actual = commissions[0];
                Assert.Equal(error1.PolicyId, actual.PolicyId);
                Assert.Equal(error1.CommissionStatementId, actual.CommissionStatementId);
                Assert.Equal(error1.CommissionTypeId, actual.CommissionTypeId);
                Assert.Equal(11, actual.AmountIncludingVAT);
                Assert.Equal(22, actual.VAT);
                Assert.Equal(err1a.Data, actual.SourceData);

                actual = commissions[1];
                Assert.Equal(error1.PolicyId, actual.PolicyId);
                Assert.Equal(error1.CommissionStatementId, actual.CommissionStatementId);
                Assert.Equal(error1.CommissionTypeId, actual.CommissionTypeId);
                Assert.Equal(33, actual.AmountIncludingVAT);
                Assert.Equal(44, actual.VAT);
                Assert.Equal(err1b.Data, actual.SourceData);

                actual = commissions[2];
                Assert.Equal(error1.PolicyId, actual.PolicyId);
                Assert.Equal(error1.CommissionStatementId, actual.CommissionStatementId);
                Assert.Equal(error1.CommissionTypeId, actual.CommissionTypeId);
                Assert.Equal(77, actual.AmountIncludingVAT);
                Assert.Equal(88, actual.VAT);
                Assert.Equal(err1c.Data, actual.SourceData);

            }
        }

        [Fact]
        public async Task GetErrors()
        {
            var options = TestHelper.GetDbContext("GetErrors");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var statement = TestHelper.InsertDefaultCommissionStatement(options, user1.Organisation);

            var user2 = TestHelper.InsertDefaultUserDetailed(options);

            var error1 = new CommissionErrorEntity
            {
                Id = Guid.NewGuid(),
                CommissionStatementId = statement.Id,
                IsFormatValid = true,
                PolicyId = Guid.NewGuid(),
                MemberId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                Data = new ImportCommission()
            };

            var error2 = new CommissionErrorEntity
            {
                Id = Guid.NewGuid(),
                CommissionStatementId = statement.Id,
                IsFormatValid = false,
                PolicyId = Guid.NewGuid(),
                MemberId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                Data = new ImportCommission()
            };

            var error3 = new CommissionErrorEntity
            {
                Id = Guid.NewGuid(),
                CommissionStatementId = statement.Id,
                IsFormatValid = true,
                PolicyId = Guid.NewGuid(),
                MemberId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                Data = new ImportCommission()
            };

            var error4 = new CommissionErrorEntity
            {
                Id = Guid.NewGuid(),
                CommissionStatementId = Guid.NewGuid(),
                IsFormatValid = true,
                PolicyId = Guid.NewGuid(),
                MemberId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                Data = new ImportCommission()
            };

            using (var context = new DataContext(options))
            {
                context.CommissionError.Add(error1);
                context.CommissionError.Add(error4);
                context.CommissionError.Add(error2);
                context.CommissionError.Add(error3);
                context.SaveChanges();

                var service = new CommissionErrorService(context, null);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new CommissionErrorQueryOptions(scope, "", "", 10, 1, $"commissionStatementId={statement.Id};hasValidFormat=true");
                var results = await service.GetErrors(queryOptions);

                //Then
                Assert.Equal(2, results.TotalItems);
                Assert.Equal(2, results.Items.Count());

                var actual = results.Items.ToList()[0];
                Assert.Equal(error1.Id, actual.Id);
                Assert.Equal(error1.CommissionStatementId, actual.CommissionStatementId);
                Assert.Equal(error1.IsFormatValid, actual.IsFormatValid);
                Assert.Equal(error1.PolicyId, actual.PolicyId);
                Assert.Equal(error1.MemberId, actual.MemberId);
                Assert.Equal(error1.CommissionTypeId, actual.CommissionTypeId);
                Assert.Equal(error1.Data, actual.Data);

                actual = results.Items.ToList()[1];
                Assert.Equal(error3.Id, actual.Id);

                //Scope checked
                scope = TestHelper.GetScopeOptions(user2);
                queryOptions = new CommissionErrorQueryOptions(scope, "", "", 10, 1);
                results = await service.GetErrors(queryOptions);
                Assert.Equal(0, results.Items.Count());
            }
        }
    }
}