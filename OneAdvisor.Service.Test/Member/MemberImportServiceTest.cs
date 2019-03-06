using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Model.ImportMember;
using OneAdvisor.Model.Member.Model.Member;
using OneAdvisor.Model.Member.Model.Policy;
using OneAdvisor.Service.Member;

namespace OneAdvisor.Service.Test.Member
{

    public class MemberImportServiceTest
    {

        [Fact]
        public async Task ImportMember_Insert()
        {
            var options = TestHelper.GetDbContext("ImportMember_Insert");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var service = new MemberImportService(context, memberService, null, null);

                //When
                var data = new ImportMember()
                {
                    IdNumber = "821003 5032 082",
                    FirstName = "FN",
                    LastName = "LN",
                    TaxNumber = "987654",
                    DateOfBirth = DateTime.Now
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Member.FirstOrDefaultAsync(m => m.IdNumber == "8210035032082");
                Assert.Equal(null, actual.PassportNumber);
                Assert.Equal(user1.Organisation.Id, actual.OrganisationId);
                Assert.Equal(data.LastName, actual.LastName);
                Assert.Equal(data.FirstName, actual.FirstName);
                Assert.Equal(data.TaxNumber, actual.TaxNumber);
                Assert.Equal(data.DateOfBirth, actual.DateOfBirth);
            }
        }

        [Fact]
        public async Task ImportMember_Insert_WithMissingZeroOnIdNumber()
        {
            var options = TestHelper.GetDbContext("ImportMember_Insert_WithMissingZeroOnIdNumber");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var service = new MemberImportService(context, memberService, null, null);

                //When
                var data = new ImportMember()
                {
                    IdNumber = "501228318181" //missing leading zero
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Member.FirstOrDefaultAsync(m => m.IdNumber == "0501228318181");
                Assert.NotNull(actual);
            }
        }

        [Fact]
        public async Task ImportMember_Insert_With3MissingZeroOnIdNumber()
        {
            var options = TestHelper.GetDbContext("ImportMember_Insert_With3MissingZeroOnIdNumber");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var service = new MemberImportService(context, memberService, null, null);

                //When
                var data = new ImportMember()
                {
                    IdNumber = "7287372085" //missing leading zero
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Member.FirstOrDefaultAsync(m => m.IdNumber == "0007287372085");
                Assert.NotNull(actual);
            }
        }

        [Fact]
        public async Task ImportMember_Insert_WithPassportNumber()
        {
            var options = TestHelper.GetDbContext("ImportMember_Insert_WithPassportNumber");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var service = new MemberImportService(context, memberService, null, null);

                //When
                var data = new ImportMember()
                {
                    IdNumber = "123456" //Not a valid id number so should be treated as a passport number
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Member.FirstOrDefaultAsync(m => m.PassportNumber == data.IdNumber);
                Assert.Equal(null, actual.IdNumber);
            }
        }

        [Fact]
        public async Task ImportMember_Insert_WithEmail()
        {
            var options = TestHelper.GetDbContext("ImportMember_Insert_WithEmail");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var contactService = new ContactService(context);
                var service = new MemberImportService(context, memberService, null, contactService);

                //When
                var data = new ImportMember()
                {
                    IdNumber = "8210035032082",
                    Email = "dean@gmail.com"
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.True(result.Success);

                var member = await context.Member.FirstOrDefaultAsync(m => m.IdNumber == data.IdNumber);
                var actual = await context.Contact.SingleOrDefaultAsync(c => c.MemberId == member.Id);
                Assert.Equal(data.Email, actual.Value);
                Assert.Equal(ContactType.CONTACT_TYPE_EMAIL, actual.ContactTypeId);
            }
        }

        [Fact]
        public async Task ImportMember_Insert_WithCellphone()
        {
            var options = TestHelper.GetDbContext("ImportMember_Insert_WithCellphone");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var contactService = new ContactService(context);
                var service = new MemberImportService(context, memberService, null, contactService);

                //When
                var data = new ImportMember()
                {
                    IdNumber = "8210035032082",
                    Cellphone = "082-572 8997"
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.True(result.Success);

                var member = await context.Member.FirstOrDefaultAsync(m => m.IdNumber == data.IdNumber);
                var actual = await context.Contact.SingleOrDefaultAsync(c => c.MemberId == member.Id);
                Assert.Equal("0825728997", actual.Value);
                Assert.Equal(ContactType.CONTACT_TYPE_CELLPHONE, actual.ContactTypeId);
            }
        }

        [Fact]
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
                TaxNumber = "987654",
                DateOfBirth = DateTime.Now,
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
                var service = new MemberImportService(context, memberService, null, null);

                //When
                var data = new ImportMember()
                {
                    IdNumber = mem.IdNumber,
                    FirstName = "FN updated",
                    LastName = "LN updated",
                    TaxNumber = "456789",
                    DateOfBirth = DateTime.Now.AddDays(-20),
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Member.FirstOrDefaultAsync(m => m.IdNumber == data.IdNumber);
                Assert.Equal(user1.Organisation.Id, actual.OrganisationId);
                Assert.Equal(data.FirstName, actual.FirstName);
                Assert.Equal(data.LastName, actual.LastName);
                Assert.Equal(data.TaxNumber, actual.TaxNumber);
                Assert.Equal(data.DateOfBirth, actual.DateOfBirth);
            }
        }

        [Fact]
        public async Task ImportMember_Update_MatchOnShortIdNumber()
        {
            var options = TestHelper.GetDbContext("ImportMember_Update_MatchOnShortIdNumber");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var user2 = TestHelper.InsertDefaultUserDetailed(options, user1.Organisation);

            var mem = new MemberEntity
            {
                Id = Guid.NewGuid(),
                LastName = "LN 1",
                IdNumber = "8201015800184",
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
                var service = new MemberImportService(context, memberService, null, null);

                //When
                var data = new ImportMember()
                {
                    IdNumber = "8201015800085",
                    LastName = "LN updated",
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Member.FirstOrDefaultAsync(m => m.Id == mem.Id);
                Assert.Equal(user1.Organisation.Id, actual.OrganisationId);
                Assert.Equal(data.LastName, actual.LastName);
            }
        }


        [Fact]
        public async Task ImportMember_Update_WithContacts()
        {
            var options = TestHelper.GetDbContext("ImportMember_Update_WithContacts");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            var mem = new MemberEntity
            {
                Id = Guid.NewGuid(),
                IdNumber = "8210035032082",
                OrganisationId = user1.Organisation.Id
            };

            var contact1 = new ContactEntity
            {
                MemberId = mem.Id,
                ContactTypeId = ContactType.CONTACT_TYPE_EMAIL,
                Value = "dean@gmail.com"
            };

            var contact2 = new ContactEntity
            {
                MemberId = mem.Id,
                ContactTypeId = ContactType.CONTACT_TYPE_CELLPHONE,
                Value = "0825728997"
            };

            using (var context = new DataContext(options))
            {
                context.Member.Add(mem);
                context.Contact.Add(contact1);
                context.Contact.Add(contact2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var contactService = new ContactService(context);
                var service = new MemberImportService(context, memberService, null, contactService);

                //When
                var data = new ImportMember()
                {
                    IdNumber = "8210035032082",
                    Email = contact1.Value,
                    Cellphone = "082 572-8997"
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.True(result.Success);

                var member = await context.Member.FirstOrDefaultAsync(m => m.IdNumber == data.IdNumber);
                var contacts = await context.Contact.Where(c => c.MemberId == member.Id).ToListAsync();
                Assert.Equal(2, contacts.Count);
                var actual = contacts.First();
                Assert.Equal(data.Email, actual.Value);
                Assert.Equal(ContactType.CONTACT_TYPE_EMAIL, actual.ContactTypeId);

                actual = contacts.Last();
                Assert.Equal(contact2.Value, actual.Value);
                Assert.Equal(ContactType.CONTACT_TYPE_CELLPHONE, actual.ContactTypeId);
            }
        }



        [Fact]
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
                var service = new MemberImportService(context, memberService, null, null);

                //When
                var data = new ImportMember()
                {
                    IdNumber = "123456", //Not a valid id number so should be treated as a passport number
                    LastName = "LN updated"
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Member.FirstOrDefaultAsync(m => m.PassportNumber == data.IdNumber);
                Assert.Equal(data.LastName, actual.LastName);
            }
        }

        [Fact]
        public async Task ImportMember_Update_LastNameAndDateOfBirth()
        {
            var options = TestHelper.GetDbContext("ImportMember_Update_LastNameAndDateOfBirth");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            var mem1 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                OrganisationId = user1.Organisation.Id
            };

            var mem2 = new MemberEntity
            {
                Id = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "van Jones",
                IdNumber = "8210035032082",
                DateOfBirth = new DateTime(1982, 10, 3),
                OrganisationId = user1.Organisation.Id
            };

            using (var context = new DataContext(options))
            {
                context.Member.Add(mem1);
                context.Member.Add(mem2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var service = new MemberImportService(context, memberService, null, null);

                //When
                var data = new ImportMember()
                {
                    FirstName = "FN 1 Updated",
                    LastName = mem2.LastName,
                    DateOfBirth = mem2.DateOfBirth
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Member.FirstOrDefaultAsync(m => m.IdNumber == mem2.IdNumber);
                Assert.Equal(data.FirstName, actual.FirstName);
            }
        }

        [Fact]
        public async Task ImportMember_InsertPolicy()
        {
            var options = TestHelper.GetDbContext("ImportMember_InsertPolicy");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var policyService = new PolicyService(context);
                var service = new MemberImportService(context, memberService, policyService, null);

                //When
                var data = new ImportMember()
                {
                    IdNumber = "12345",
                    LastName = "LN",
                    PolicyNumber = "987654",
                    PolicyCompanyId = Guid.NewGuid(),
                    PolicyType = "life_insurance",
                    PolicyPremium = 5000,
                    PolicyStartDate = DateTime.Now,
                    PolicyUserFullName = $"{user1.User.FirstName} {user1.User.LastName}"
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Policy.FirstOrDefaultAsync(m => m.Number == data.PolicyNumber);
                Assert.Equal(data.PolicyCompanyId, actual.CompanyId);
                Assert.Equal(user1.User.Id, actual.UserId);
                Assert.Equal(data.PolicyPremium, actual.Premium);
                Assert.Equal(data.PolicyStartDate, actual.StartDate);
                Assert.Equal(PolicyType.POLICY_TYPE_LIFE_INSURANCE, actual.PolicyTypeId);
            }
        }

        [Fact]
        public async Task ImportMember_InsertPolicy_CheckUserAlias()
        {
            var options = TestHelper.GetDbContext("ImportMember_InsertPolicy_CheckUserAlias");

            var organisation = TestHelper.InsertDefaultOrganisation(options);

            var user = new UserEdit
            {
                Id = Guid.NewGuid(),
                FirstName = "Dean",
                LastName = "van Niekerk",
                Aliases = new List<string>() { "DJ VAN Niekerk" }
            };

            var user1 = TestHelper.InsertDefaultUserDetailed(options, organisation, user);

            using (var context = new DataContext(options))
            {
                var memberService = new MemberService(context);
                var policyService = new PolicyService(context);
                var service = new MemberImportService(context, memberService, policyService, null);

                //When
                var data = new ImportMember()
                {
                    IdNumber = "12345",
                    LastName = "LN",
                    PolicyNumber = "987654",
                    PolicyCompanyId = Guid.NewGuid(),
                    PolicyUserFullName = "Dj van Niekerk"
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Policy.FirstOrDefaultAsync(m => m.Number == data.PolicyNumber);
                Assert.Equal(data.PolicyCompanyId, actual.CompanyId);
                Assert.Equal(user1.User.Id, actual.UserId);
            }
        }


        [Fact]
        public async Task ImportMember_UpdatePolicy()
        {
            var options = TestHelper.GetDbContext("ImportMember_UpdatePolicy");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation, "8210035032082");

            var user2 = TestHelper.InsertDefaultUserDetailed(options, user1.Organisation);

            //Given
            var policyEntity1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                MemberId = member1.Member.Id,
                UserId = user2.User.Id,
                PolicyTypeId = PolicyType.POLICY_TYPE_INVESTMENT,
                Premium = 2000,
                StartDate = DateTime.Now,
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
                var service = new MemberImportService(context, memberService, policyService, null);

                //When
                var data = new ImportMember()
                {
                    IdNumber = member1.Member.IdNumber,
                    LastName = "LN",
                    PolicyNumber = policyEntity1.Number,
                    PolicyCompanyId = policyEntity1.CompanyId,
                    PolicyType = "medical_cover",
                    PolicyPremium = 6000,
                    PolicyStartDate = DateTime.Now.AddDays(-100),
                    PolicyUserFullName = $"{user1.User.FirstName} {user1.User.LastName}"
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportMember(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Policy.FirstOrDefaultAsync(m => m.Number == data.PolicyNumber);
                Assert.Equal(data.PolicyCompanyId, actual.CompanyId);
                Assert.Equal(user1.User.Id, actual.UserId);
                Assert.Equal(data.PolicyPremium, actual.Premium);
                Assert.Equal(data.PolicyStartDate, actual.StartDate);
                Assert.Equal(PolicyType.POLICY_TYPE_MEDICAL_COVER, actual.PolicyTypeId);
            }
        }
    }
}