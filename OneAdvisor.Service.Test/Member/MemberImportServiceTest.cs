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
                    IdNumber = "12345",
                    LastName = "LN"
                };

                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Member.FirstOrDefaultAsync(m => m.IdNumber == data.IdNumber);
                Assert.AreEqual(data.LastName, actual.LastName);
            }
        }

        [TestMethod]
        public async Task ImportMember_Update()
        {
            var options = TestHelper.GetDbContext("ImportMember_Update");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            var mem = new MemberEntity
            {
                Id = Guid.NewGuid(),
                LastName = "LN 1",
                IdNumber = Guid.NewGuid().ToString(),
                UserId = user1.User.Id
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
                    LastName = "LN updated"
                };

                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Member.FirstOrDefaultAsync(m => m.IdNumber == data.IdNumber);
                Assert.AreEqual(data.LastName, actual.LastName);
            }
        }

        [TestMethod]
        public async Task ImportMember_Update_OutOfScope()
        {
            var options = TestHelper.GetDbContext("ImportMember_Update_OutOfScope");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options, user1.Organisation);

            var mem = new MemberEntity
            {
                Id = Guid.NewGuid(),
                LastName = "LN 1",
                IdNumber = Guid.NewGuid().ToString(),
                UserId = user1.User.Id
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
                    LastName = "LN updated"
                };

                var scope = TestHelper.GetScopeOptions(user2, Scope.Branch);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.IsFalse(result.Success);
                Assert.AreEqual(result.ValidationFailures.Single().ErrorMessage, "Member exists but is out of scope");
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
                var memberPolicyService = new MemberPolicyService(context);
                var service = new MemberImportService(context, memberService, memberPolicyService);

                //When
                var data = new ImportMember()
                {
                    IdNumber = "12345",
                    LastName = "LN",
                    PolicyNumber = "987654",
                    PolicyCompanyId = Guid.NewGuid()
                };

                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.MemberPolicy.FirstOrDefaultAsync(m => m.Number == data.PolicyNumber);
                Assert.AreEqual(data.PolicyCompanyId, actual.CompanyId);
            }
        }

        [TestMethod]
        public async Task ImportMember_UpdatePolicy()
        {
            var options = TestHelper.GetDbContext("ImportMember_UpdatePolicy");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.User);

            var policyEntity1 = new MemberPolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                Number = "123465"
            };

            using (var context = new DataContext(options))
            {
                context.MemberPolicy.Add(policyEntity1);
                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var memberPolicyService = new MemberPolicyService(context);
                var service = new MemberImportService(context, memberService, memberPolicyService);

                //When
                var data = new ImportMember()
                {
                    IdNumber = member1.Member.IdNumber,
                    LastName = "LN",
                    PolicyNumber = "123465",
                    PolicyCompanyId = Guid.NewGuid()
                };

                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.MemberPolicy.FirstOrDefaultAsync(m => m.Number == data.PolicyNumber);
                Assert.AreEqual(data.PolicyCompanyId, actual.CompanyId);
            }
        }

    }
}