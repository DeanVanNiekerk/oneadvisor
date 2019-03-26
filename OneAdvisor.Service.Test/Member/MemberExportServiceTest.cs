using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Model.ExportMember;
using OneAdvisor.Service.Member;
using OneAdvisor.Service.Test.Export;

namespace OneAdvisor.Service.Test.Member
{

    public class MemberExportServiceTest
    {
        [Fact]
        public async Task PolicyAggregates()
        {
            var options = TestHelper.GetDbContext("PolicyAggregates");

            var user1 = TestHelper.InsertUserDetailed(options);
            var member1 = TestHelper.InsertMember(options, user1.Organisation);
            var member2 = TestHelper.InsertMember(options, user1.Organisation);

            TestHelper.InsertMember(options); //Different org

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
                var renderer = new MockMemberExportRenderer<MemberPolicyAggregate>();
                var scopeOptions = TestHelper.GetScopeOptions(user1);
                await service.PolicyAggregates(renderer, new MemoryStream(), scopeOptions);

                //Then
                Assert.Equal(2, renderer.Items.Count());

                var actual = renderer.Items.ToArray()[0];

                Assert.Equal(member1.Member.IdNumber, actual.IdNumber);
                Assert.Equal(member1.Member.FirstName, actual.FirstName);
                Assert.Equal(member1.Member.LastName, actual.LastName);
                Assert.Equal("dean@email.com", actual.Email);
                Assert.Equal(2, actual.PolicyInvestmentCount);
                Assert.Equal(1, actual.PolicyShortTermCount);
                Assert.Equal(1, actual.PolicyMedicalCoverCount);
                Assert.Equal(0, actual.PolicyLifeInsuranceCount);

                actual = renderer.Items.ToArray()[1];

                Assert.Equal(member2.Member.IdNumber, actual.IdNumber);
                Assert.Equal(member2.Member.FirstName, actual.FirstName);
                Assert.Equal(member2.Member.LastName, actual.LastName);
                Assert.Equal("john@email.com", actual.Email);
                Assert.Equal(0, actual.PolicyInvestmentCount);
                Assert.Equal(1, actual.PolicyShortTermCount);
                Assert.Equal(0, actual.PolicyMedicalCoverCount);
                Assert.Equal(0, actual.PolicyLifeInsuranceCount);
            }
        }

    }
}