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

        [Fact]
        public async Task Policies()
        {
            var options = TestHelper.GetDbContext("Policies");

            var user1 = TestHelper.InsertUserDetailed(options);
            var member1 = TestHelper.InsertMember(options, user1.Organisation);
            var member2 = TestHelper.InsertMember(options, user1.Organisation);
            var member3 = TestHelper.InsertMember(options, user1.Organisation);

            var policyType1 = TestHelper.InsertPolicyType(options);
            var policyType2 = TestHelper.InsertPolicyType(options);

            TestHelper.InsertMember(options); //Different org

            var policy1 = new PolicyEntity { Number = "123456", MemberId = member1.Member.Id, Premium = 200, StartDate = DateTime.Now.AddYears(-1), UserId = user1.User.Id, PolicyTypeId = policyType1.Id };
            var policy2 = new PolicyEntity { Number = "654321", MemberId = member2.Member.Id, Premium = 300, UserId = user1.User.Id, PolicyTypeId = policyType2.Id };
            var policy3 = new PolicyEntity { Number = "987654", MemberId = member1.Member.Id, StartDate = DateTime.Now.AddYears(-2), UserId = user1.User.Id };

            using (var context = new DataContext(options))
            {

                context.Policy.Add(policy1);
                context.Policy.Add(policy2);
                context.Policy.Add(policy3);

                context.Contact.Add(new ContactEntity { MemberId = member2.Member.Id, ContactTypeId = ContactType.CONTACT_TYPE_EMAIL, Value = "john@email.com" });
                context.Contact.Add(new ContactEntity { MemberId = member1.Member.Id, ContactTypeId = ContactType.CONTACT_TYPE_EMAIL, Value = "dean@email.com" });
                context.Contact.Add(new ContactEntity { MemberId = member1.Member.Id, ContactTypeId = ContactType.CONTACT_TYPE_CELLPHONE, Value = "0825728997" });

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new MemberExportService(context);

                //When
                var renderer = new MockMemberExportRenderer<MemberPolicy>();
                var scopeOptions = TestHelper.GetScopeOptions(user1);
                await service.Policies(renderer, new MemoryStream(), scopeOptions);

                //Then
                Assert.Equal(4, renderer.Items.Count());

                var actual = renderer.Items.ToArray()[0];
                Assert.Equal(member1.Member.IdNumber, actual.IdNumber);
                Assert.Equal(member1.Member.FirstName, actual.FirstName);
                Assert.Equal(member1.Member.LastName, actual.LastName);
                Assert.Equal(member1.Member.DateOfBirth, actual.DateOfBirth);
                Assert.Equal(member1.Member.TaxNumber, actual.TaxNumber);
                Assert.Equal("dean@email.com", actual.Email);
                Assert.Equal("0825728997", actual.CellPhone);
                Assert.Equal(policy1.Number, actual.PolicyNumber);
                Assert.Equal($"{user1.User.FirstName} {user1.User.LastName}", actual.PolicyBroker);
                Assert.Equal(policy1.Premium, actual.PolicyPremium);
                Assert.Equal(policyType1.Code, actual.PolicyTypeCode);
                Assert.Equal(policy1.StartDate, actual.PolicyStartDate);

                actual = renderer.Items.ToArray()[1];
                Assert.Equal(member1.Member.IdNumber, actual.IdNumber);
                Assert.Equal(member1.Member.FirstName, actual.FirstName);
                Assert.Equal(member1.Member.LastName, actual.LastName);
                Assert.Equal(member1.Member.DateOfBirth, actual.DateOfBirth);
                Assert.Equal(member1.Member.TaxNumber, actual.TaxNumber);
                Assert.Equal("dean@email.com", actual.Email);
                Assert.Equal("0825728997", actual.CellPhone);
                Assert.Equal(policy3.Number, actual.PolicyNumber);
                Assert.Equal($"{user1.User.FirstName} {user1.User.LastName}", actual.PolicyBroker);
                Assert.Equal(policy3.Premium, actual.PolicyPremium);
                Assert.Null(actual.PolicyTypeCode);
                Assert.Equal(policy3.StartDate, actual.PolicyStartDate);

                actual = renderer.Items.ToArray()[2];
                Assert.Equal(member2.Member.IdNumber, actual.IdNumber);
                Assert.Equal(member2.Member.FirstName, actual.FirstName);
                Assert.Equal(member2.Member.LastName, actual.LastName);
                Assert.Equal(member2.Member.DateOfBirth, actual.DateOfBirth);
                Assert.Equal(member2.Member.TaxNumber, actual.TaxNumber);
                Assert.Equal("john@email.com", actual.Email);
                Assert.Null(actual.CellPhone);
                Assert.Equal(policy2.Number, actual.PolicyNumber);
                Assert.Equal($"{user1.User.FirstName} {user1.User.LastName}", actual.PolicyBroker);
                Assert.Equal(policy2.Premium, actual.PolicyPremium);
                Assert.Equal(policyType2.Code, actual.PolicyTypeCode);
                Assert.Equal(policy2.StartDate, actual.PolicyStartDate);

                actual = renderer.Items.ToArray()[3];
                Assert.Equal(member3.Member.IdNumber, actual.IdNumber);
                Assert.Equal(member3.Member.FirstName, actual.FirstName);
                Assert.Equal(member3.Member.LastName, actual.LastName);
                Assert.Equal(member3.Member.DateOfBirth, actual.DateOfBirth);
                Assert.Equal(member3.Member.TaxNumber, actual.TaxNumber);
                Assert.Null(actual.Email);
                Assert.Null(actual.CellPhone);
                Assert.Null(actual.PolicyNumber);
                Assert.Equal(" ", actual.PolicyBroker);
                Assert.Null(actual.PolicyPremium);
                Assert.Null(actual.PolicyTypeCode);
                Assert.Null(actual.PolicyStartDate);
            }
        }

    }
}