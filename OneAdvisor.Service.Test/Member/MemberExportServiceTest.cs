using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Model.ExportMember;
using OneAdvisor.Service.Member;
using OneAdvisor.Service.Test.Export;

namespace OneAdvisor.Service.Test.Member
{
    [TestClass]
    public class MemberExportServiceTest
    {
        [TestMethod]
        public async Task Export()
        {
            var options = TestHelper.GetDbContext("MemberExport");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);
            var member2 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            TestHelper.InsertDefaultMember(options); //Different org

            using (var context = new DataContext(options))
            {
                context.Policy.Add(new PolicyEntity { MemberId = member1.Member.Id, PolicyTypeId = PolicyType.POLICY_TYPE_INVESTMENT });
                context.Policy.Add(new PolicyEntity { MemberId = member1.Member.Id, PolicyTypeId = PolicyType.POLICY_TYPE_MEDICAL_COVER });
                context.Policy.Add(new PolicyEntity { MemberId = member1.Member.Id, PolicyTypeId = PolicyType.POLICY_TYPE_SHORT_TERM });
                context.Policy.Add(new PolicyEntity { MemberId = member2.Member.Id, PolicyTypeId = PolicyType.POLICY_TYPE_SHORT_TERM });
                context.Policy.Add(new PolicyEntity { MemberId = member1.Member.Id, PolicyTypeId = PolicyType.POLICY_TYPE_INVESTMENT });

                context.Contact.Add(new ContactEntity { MemberId = member2.Member.Id, ContactTypeId = ContactType.CONTACT_TYPE_EMAIL, Value = "john@email.com" });
                context.Contact.Add(new ContactEntity { MemberId = member1.Member.Id, ContactTypeId = ContactType.CONTACT_TYPE_EMAIL, Value = "dean@email.com" });

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberExportService(context);

                //When
                var renderer = new MockMemberExportRenderer();
                var scopeOptions = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var queryOptions = new ExportMemberQueryOptions(scopeOptions, new List<string>());
                await service.Export(renderer, new MemoryStream(), queryOptions);

                //Then
                Assert.AreEqual(2, renderer.Items.Count());

                var actual = renderer.Items.ToArray()[0];

                Assert.AreEqual(member1.Member.IdNumber, actual.IdNumber);
                Assert.AreEqual(member1.Member.FirstName, actual.FirstName);
                Assert.AreEqual(member1.Member.LastName, actual.LastName);
                Assert.AreEqual("dean@email.com", actual.Email);
                Assert.AreEqual(2, actual.PolicyInvestmentCount);
                Assert.AreEqual(1, actual.PolicyShortTermCount);
                Assert.AreEqual(1, actual.PolicyMedicalCoverCount);
                Assert.AreEqual(0, actual.PolicyLifeInsuranceCount);

                actual = renderer.Items.ToArray()[1];

                Assert.AreEqual(member2.Member.IdNumber, actual.IdNumber);
                Assert.AreEqual(member2.Member.FirstName, actual.FirstName);
                Assert.AreEqual(member2.Member.LastName, actual.LastName);
                Assert.AreEqual("john@email.com", actual.Email);
                Assert.AreEqual(0, actual.PolicyInvestmentCount);
                Assert.AreEqual(1, actual.PolicyShortTermCount);
                Assert.AreEqual(0, actual.PolicyMedicalCoverCount);
                Assert.AreEqual(0, actual.PolicyLifeInsuranceCount);
            }
        }

    }
}