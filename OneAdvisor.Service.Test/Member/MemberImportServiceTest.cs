using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Model.ImportMember;
using OneAdvisor.Model.Member.Model.Member;
using OneAdvisor.Service.Member;

namespace OneAdvisor.Service.Test.Member
{
    [TestClass]
    public class MemberImportServiceTest
    {

        [TestMethod]
        public async Task ImportMember_Insert()
        {
            var options = TestHelper.GetDbContext("ImportMember_Insert");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var service = new MemberImportService(context, memberService, null);

                //When
                var data = new ImportMember()
                {
                    IdNumber = "8210035032082",
                    FirstName = "FN",
                    LastName = "LN"
                };

                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Member.FirstOrDefaultAsync(m => m.IdNumber == data.IdNumber);
                Assert.AreEqual(null, actual.PassportNumber);
                Assert.AreEqual(user1.Organisation.Id, actual.OrganisationId);
                Assert.AreEqual(data.LastName, actual.LastName);
                Assert.AreEqual(data.FirstName, actual.FirstName);
            }
        }

        [TestMethod]
        public async Task ImportMember_Insert_WithPassportNumber()
        {
            var options = TestHelper.GetDbContext("ImportMember_Insert_WithPassportNumber");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var service = new MemberImportService(context, memberService, null);

                //When
                var data = new ImportMember()
                {
                    IdNumber = "123456" //Not a valid id number so should be treated as a passport number
                };

                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Member.FirstOrDefaultAsync(m => m.PassportNumber == data.IdNumber);
                Assert.AreEqual(null, actual.IdNumber);
            }
        }



        [TestMethod]
        public async Task ImportMember_Update()
        {
            var options = TestHelper.GetDbContext("ImportMember_Update");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options, user1.Organisation);

            var mem = new MemberEntity
            {
                Id = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                IdNumber = "8210035032082",
                OrganisationId = user1.Organisation.Id
            };

            using (var context = new DataContext(options))
            {
                context.Member.Add(mem);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var service = new MemberImportService(context, memberService, null);

                //When
                var data = new ImportMember()
                {
                    IdNumber = mem.IdNumber,
                    FirstName = "FN updated",
                    LastName = "LN updated"
                };

                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Member.FirstOrDefaultAsync(m => m.IdNumber == data.IdNumber);
                Assert.AreEqual(user1.Organisation.Id, actual.OrganisationId);
                Assert.AreEqual(data.FirstName, actual.FirstName);
                Assert.AreEqual(data.LastName, actual.LastName);
            }
        }



        [TestMethod]
        public async Task ImportMember_Update_WithPassportNumber()
        {
            var options = TestHelper.GetDbContext("ImportMember_Update_WithPassportNumber");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            var mem = new MemberEntity
            {
                Id = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                PassportNumber = "123456",
                OrganisationId = user1.Organisation.Id
            };

            using (var context = new DataContext(options))
            {
                context.Member.Add(mem);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var service = new MemberImportService(context, memberService, null);

                //When
                var data = new ImportMember()
                {
                    IdNumber = "123456", //Not a valid id number so should be treated as a passport number
                    LastName = "LN updated"
                };

                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Member.FirstOrDefaultAsync(m => m.PassportNumber == data.IdNumber);
                Assert.AreEqual(data.LastName, actual.LastName);
            }
        }

        [TestMethod]
        public async Task ImportMember_InsertPolicy()
        {
            var options = TestHelper.GetDbContext("ImportMember_InsertPolicy");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var policyService = new PolicyService(context);
                var service = new MemberImportService(context, memberService, policyService);

                //When
                var data = new ImportMember()
                {
                    IdNumber = "12345",
                    LastName = "LN",
                    PolicyNumber = "987654",
                    PolicyCompanyId = Guid.NewGuid(),
                    PolicyUserFullName = $"{user1.User.FirstName} {user1.User.LastName}"
                };

                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Policy.FirstOrDefaultAsync(m => m.Number == data.PolicyNumber);
                Assert.AreEqual(data.PolicyCompanyId, actual.CompanyId);
                Assert.AreEqual(user1.User.Id, actual.UserId);
            }
        }

        [TestMethod]
        public async Task ImportMember_InsertPolicy_CheckUserAlias()
        {
            var options = TestHelper.GetDbContext("ImportMember_InsertPolicy_CheckUserAlias");

            var organisation = TestHelper.InsertDefaultOrganisation(options);

            var user = new UserEdit
            {
                Id = Guid.NewGuid().ToString(),
                FirstName = "Dean",
                LastName = "van Niekerk",
                Aliases = new List<string>() { "DJ VAN Niekerk" }
            };

            var user1 = TestHelper.InsertDefaultUserDetailed(options, organisation, user);

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var policyService = new PolicyService(context);
                var service = new MemberImportService(context, memberService, policyService);

                //When
                var data = new ImportMember()
                {
                    IdNumber = "12345",
                    LastName = "LN",
                    PolicyNumber = "987654",
                    PolicyCompanyId = Guid.NewGuid(),
                    PolicyUserFullName = "Dj van Niekerk"
                };

                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Policy.FirstOrDefaultAsync(m => m.Number == data.PolicyNumber);
                Assert.AreEqual(data.PolicyCompanyId, actual.CompanyId);
                Assert.AreEqual(user1.User.Id, actual.UserId);
            }
        }


        [TestMethod]
        public async Task ImportMember_UpdatePolicy()
        {
            var options = TestHelper.GetDbContext("ImportMember_UpdatePolicy");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var user2 = TestHelper.InsertDefaultUserDetailed(options, user1.Organisation);

            //Given
            var policyEntity1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user2.User.Id,
                Number = "123465"
            };

            using (var context = new DataContext(options))
            {
                context.Policy.Add(policyEntity1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var policyService = new PolicyService(context);
                var service = new MemberImportService(context, memberService, policyService);

                //When
                var data = new ImportMember()
                {
                    IdNumber = member1.Member.IdNumber,
                    LastName = "LN",
                    PolicyNumber = policyEntity1.Number,
                    PolicyCompanyId = policyEntity1.CompanyId,
                    PolicyUserFullName = $"{user1.User.FirstName} {user1.User.LastName}"
                };

                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Policy.FirstOrDefaultAsync(m => m.Number == data.PolicyNumber);
                Assert.AreEqual(data.PolicyCompanyId, actual.CompanyId);
                Assert.AreEqual(user1.User.Id, actual.UserId);
            }
        }
    }
}