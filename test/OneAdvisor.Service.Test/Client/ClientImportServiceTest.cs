using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Client.Model.ImportClient;
using OneAdvisor.Service.Client;
using OneAdvisor.Service.Directory;
using OneAdvisor.Model.Client.Model.Lookup;
using OneAdvisor.Service.Test.Directory.Mocks;

namespace OneAdvisor.Service.Test.Client
{

    public class ClientImportServiceTest
    {

        [Fact]
        public async Task ImportClient_Insert()
        {
            var options = TestHelper.GetDbContext("ImportClient_Insert");

            var user1 = TestHelper.InsertUserDetailed(options);

            var clientType = TestHelper.InsertClientTypeIndividual(options);

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var clientService = new ClientService(context, auditService);
                var lookupService = new ClientLookupService(context);
                var directoryLookupService = new DirectoryLookupService(context);
                var service = new ClientImportService(context, clientService, null, null, lookupService, directoryLookupService);

                //When
                var data = new ImportClient()
                {
                    IdNumber = "821003 5032 082",
                    FirstName = "FN",
                    LastName = "LN",
                    TaxNumber = "987654",
                    DateOfBirth = DateTime.Now,
                    ClientTypeCode = clientType.Code
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportClient(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Client.FirstOrDefaultAsync(m => m.IdNumber == "8210035032082");
                Assert.Null(actual.AlternateIdNumber);
                Assert.Equal(clientType.Id, actual.ClientTypeId);
                Assert.Equal(user1.Organisation.Id, actual.OrganisationId);
                Assert.Equal(data.LastName, actual.LastName);
                Assert.Equal(data.FirstName, actual.FirstName);
                Assert.Equal(data.TaxNumber, actual.TaxNumber);
                Assert.Equal(data.DateOfBirth, actual.DateOfBirth);
            }
        }

        [Fact]
        public async Task ImportClient_InsertUnknownEntity()
        {
            var options = TestHelper.GetDbContext("ImportClient_InsertUnknownEntity");

            var user1 = TestHelper.InsertUserDetailed(options);

            var clientType = TestHelper.InsertClientTypeUnknown(options);

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var clientService = new ClientService(context, auditService);
                var lookupService = new ClientLookupService(context);
                var directoryLookupService = new DirectoryLookupService(context);
                var service = new ClientImportService(context, clientService, null, null, lookupService, directoryLookupService);

                //When
                var data = new ImportClient()
                {
                    LastName = "Unknown Here",
                    ClientTypeCode = clientType.Code
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportClient(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Client.FirstOrDefaultAsync();
                Assert.Null(actual.AlternateIdNumber);
                Assert.Null(actual.FirstName);
                Assert.Equal(clientType.Id, actual.ClientTypeId);
                Assert.Equal(user1.Organisation.Id, actual.OrganisationId);
                Assert.Equal(data.LastName, actual.LastName);
            }
        }

        [Fact]
        public async Task ImportClient_Insert_WithMissingZeroOnIdNumber()
        {
            var options = TestHelper.GetDbContext("ImportClient_Insert_WithMissingZeroOnIdNumber");

            var user1 = TestHelper.InsertUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var clientService = new ClientService(context, auditService);
                var lookupService = new ClientLookupService(context);
                var directoryLookupService = new DirectoryLookupService(context);
                var service = new ClientImportService(context, clientService, null, null, lookupService, directoryLookupService);

                //When
                var data = new ImportClient()
                {
                    IdNumber = "501228318181" //missing leading zero
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportClient(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Client.FirstOrDefaultAsync(m => m.IdNumber == "0501228318181");
                Assert.NotNull(actual);
            }
        }

        [Fact]
        public async Task ImportClient_Insert_With3MissingZeroOnIdNumber()
        {
            var options = TestHelper.GetDbContext("ImportClient_Insert_With3MissingZeroOnIdNumber");

            var user1 = TestHelper.InsertUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var clientService = new ClientService(context, auditService);
                var lookupService = new ClientLookupService(context);
                var directoryLookupService = new DirectoryLookupService(context);
                var service = new ClientImportService(context, clientService, null, null, lookupService, directoryLookupService);

                //When
                var data = new ImportClient()
                {
                    IdNumber = "7287372085" //missing leading zero
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportClient(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Client.FirstOrDefaultAsync(m => m.IdNumber == "0007287372085");
                Assert.NotNull(actual);
            }
        }

        [Fact]
        public async Task ImportClient_Insert_WithAlternateIdNumber()
        {
            var options = TestHelper.GetDbContext("ImportClient_Insert_WithAlternateIdNumber");

            var user1 = TestHelper.InsertUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var clientService = new ClientService(context, auditService);
                var lookupService = new ClientLookupService(context);
                var directoryLookupService = new DirectoryLookupService(context);
                var service = new ClientImportService(context, clientService, null, null, lookupService, directoryLookupService);

                //When
                var data = new ImportClient()
                {
                    IdNumber = "123456" //Not a valid id number so should be treated as a passport number
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportClient(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Client.FirstOrDefaultAsync(m => m.AlternateIdNumber == data.IdNumber);
                Assert.Null(actual.IdNumber);
            }
        }

        [Fact]
        public async Task ImportClient_Insert_WithEmail()
        {
            var options = TestHelper.GetDbContext("ImportClient_Insert_WithEmail");

            var user1 = TestHelper.InsertUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var clientService = new ClientService(context, auditService);
                var contactService = new ContactService(context, auditService);
                var lookupService = new ClientLookupService(context);
                var directoryLookupService = new DirectoryLookupService(context);
                var service = new ClientImportService(context, clientService, null, contactService, lookupService, directoryLookupService);

                //When
                var data = new ImportClient()
                {
                    IdNumber = "8210035032082",
                    Email = "dean@gmail.com"
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportClient(scope, data);

                //Then
                Assert.True(result.Success);

                var client = await context.Client.FirstOrDefaultAsync(m => m.IdNumber == data.IdNumber);
                var actual = await context.Contact.SingleOrDefaultAsync(c => c.ClientId == client.Id);
                Assert.Equal(data.Email, actual.Value);
                Assert.Equal(ContactType.CONTACT_TYPE_EMAIL, actual.ContactTypeId);
            }
        }

        [Fact]
        public async Task ImportClient_Insert_WithCellphone()
        {
            var options = TestHelper.GetDbContext("ImportClient_Insert_WithCellphone");

            var user1 = TestHelper.InsertUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var clientService = new ClientService(context, auditService);
                var contactService = new ContactService(context, auditService);
                var lookupService = new ClientLookupService(context);
                var directoryLookupService = new DirectoryLookupService(context);
                var service = new ClientImportService(context, clientService, null, contactService, lookupService, directoryLookupService);

                //When
                var data = new ImportClient()
                {
                    IdNumber = "8210035032082",
                    Cellphone = "082-572 8997"
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportClient(scope, data);

                //Then
                Assert.True(result.Success);

                var client = await context.Client.FirstOrDefaultAsync(m => m.IdNumber == data.IdNumber);
                var actual = await context.Contact.SingleOrDefaultAsync(c => c.ClientId == client.Id);
                Assert.Equal("0825728997", actual.Value);
                Assert.Equal(ContactType.CONTACT_TYPE_CELLPHONE, actual.ContactTypeId);
            }
        }

        [Fact]
        public async Task ImportClient_Insert_NoIdButHasPolicyNumber_UnknowClientType()
        {
            var options = TestHelper.GetDbContext("ImportClient_Insert_NoIdButHasPolicyNumber_UnknowClientType");

            var user1 = TestHelper.InsertUserDetailed(options);

            var company = TestHelper.InsertCompany(options);

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var clientService = new ClientService(context, auditService);
                var policyService = new PolicyService(context, auditService);
                var contactService = new ContactService(context, auditService);
                var lookupService = new ClientLookupService(context);
                var directoryLookupService = new DirectoryLookupService(context);
                var service = new ClientImportService(context, clientService, policyService, contactService, lookupService, directoryLookupService);

                //When
                var data = new ImportClient()
                {
                    IdNumber = "",
                    PolicyNumber = "123456798",
                    LastName = "Some Business",
                    PolicyCompanyId = company.Id,
                    PolicyUserFullName = user1.User.FirstName + " " + user1.User.LastName
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportClient(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Client.FirstOrDefaultAsync();
                Assert.Null(actual.IdNumber);
                Assert.Equal(data.LastName, actual.LastName);
                Assert.Equal(ClientType.CLIENT_TYPE_UNKNOWN_ENTITY, actual.ClientTypeId);
            }
        }

        [Fact]
        public async Task ImportClient_Update()
        {
            var options = TestHelper.GetDbContext("ImportClient_Update");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);

            var mem = new ClientEntity
            {
                Id = Guid.NewGuid(),
                ClientTypeId = ClientType.CLIENT_TYPE_INDIVIDUAL,
                FirstName = "FN 1",
                LastName = "LN 1",
                TaxNumber = "987654",
                DateOfBirth = DateTime.Now,
                IdNumber = "8210035032082",
                OrganisationId = user1.Organisation.Id
            };

            using (var context = new DataContext(options))
            {
                context.Client.Add(mem);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var clientService = new ClientService(context, auditService);
                var lookupService = new ClientLookupService(context);
                var directoryLookupService = new DirectoryLookupService(context);
                var service = new ClientImportService(context, clientService, null, null, lookupService, directoryLookupService);

                //When
                var data = new ImportClient()
                {
                    IdNumber = mem.IdNumber,
                    FirstName = "FN updated",
                    LastName = "LN updated",
                    TaxNumber = "456789",
                    DateOfBirth = DateTime.Now.AddDays(-20),
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportClient(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Client.FirstOrDefaultAsync(m => m.IdNumber == data.IdNumber);
                Assert.Equal(user1.Organisation.Id, actual.OrganisationId);
                Assert.Equal(mem.ClientTypeId, actual.ClientTypeId); //Should not have changed
                Assert.Equal(data.FirstName, actual.FirstName);
                Assert.Equal(data.LastName, actual.LastName);
                Assert.Equal(data.TaxNumber, actual.TaxNumber);
                Assert.Equal(data.DateOfBirth, actual.DateOfBirth);
            }
        }

        [Fact]
        public async Task ImportClient_Update_MatchOnShortIdNumber()
        {
            var options = TestHelper.GetDbContext("ImportClient_Update_MatchOnShortIdNumber");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);

            var mem = new ClientEntity
            {
                Id = Guid.NewGuid(),
                ClientTypeId = ClientType.CLIENT_TYPE_INDIVIDUAL,
                LastName = "LN 1",
                IdNumber = "8201015800184",
                OrganisationId = user1.Organisation.Id
            };

            using (var context = new DataContext(options))
            {
                context.Client.Add(mem);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var clientService = new ClientService(context, auditService);
                var lookupService = new ClientLookupService(context);
                var directoryLookupService = new DirectoryLookupService(context);
                var service = new ClientImportService(context, clientService, null, null, lookupService, directoryLookupService);

                //When
                var data = new ImportClient()
                {
                    IdNumber = "8201015800085",
                    LastName = "LN updated",
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportClient(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Client.FirstOrDefaultAsync(m => m.Id == mem.Id);
                Assert.Equal(user1.Organisation.Id, actual.OrganisationId);
                Assert.Equal(data.LastName, actual.LastName);
            }
        }

        [Fact]
        public async Task ImportClient_Update_MatchOnPolicyNumber()
        {
            var options = TestHelper.GetDbContext("ImportClient_Update_MatchOnPolicyNumber");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);

            var client2 = TestHelper.InsertClient(options, user1.Organisation);
            var client1 = TestHelper.InsertClient(options, user1.Organisation, "8210035032082");

            var company = TestHelper.InsertCompany(options);

            var policy2 = TestHelper.InsertPolicy(options, client2, user1, company.Id);
            var policy1 = TestHelper.InsertPolicy(options, client1, user1, company.Id);

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var clientService = new ClientService(context, auditService);
                var policyService = new PolicyService(context, auditService);
                var lookupService = new ClientLookupService(context);
                var directoryLookupService = new DirectoryLookupService(context);
                var service = new ClientImportService(context, clientService, policyService, null, lookupService, directoryLookupService);

                //When
                var data = new ImportClient()
                {
                    IdNumber = "",
                    LastName = "LN updated",
                    PolicyNumber = policy1.Number,
                    PolicyCompanyId = company.Id,
                    PolicyUserFullName = user1.User.FirstName + " " + user1.User.LastName
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportClient(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Client.FirstOrDefaultAsync(m => m.Id == client1.Client.Id);
                Assert.Equal(user1.Organisation.Id, actual.OrganisationId);
                Assert.Equal(data.LastName, actual.LastName);
            }
        }


        [Fact]
        public async Task ImportClient_Update_WithContacts()
        {
            var options = TestHelper.GetDbContext("ImportClient_Update_WithContacts");

            var user1 = TestHelper.InsertUserDetailed(options);

            var mem = new ClientEntity
            {
                Id = Guid.NewGuid(),
                ClientTypeId = ClientType.CLIENT_TYPE_INDIVIDUAL,
                IdNumber = "8210035032082",
                OrganisationId = user1.Organisation.Id
            };

            var contact1 = new ContactEntity
            {
                ClientId = mem.Id,
                ContactTypeId = ContactType.CONTACT_TYPE_EMAIL,
                Value = "dean@gmail.com"
            };

            var contact2 = new ContactEntity
            {
                ClientId = mem.Id,
                ContactTypeId = ContactType.CONTACT_TYPE_CELLPHONE,
                Value = "0825728997"
            };

            using (var context = new DataContext(options))
            {
                context.Client.Add(mem);
                context.Contact.Add(contact1);
                context.Contact.Add(contact2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var clientService = new ClientService(context, auditService);
                var contactService = new ContactService(context, auditService);
                var lookupService = new ClientLookupService(context);
                var directoryLookupService = new DirectoryLookupService(context);
                var service = new ClientImportService(context, clientService, null, contactService, lookupService, directoryLookupService);

                //When
                var data = new ImportClient()
                {
                    IdNumber = "8210035032082",
                    Email = contact1.Value,
                    Cellphone = "082 572-8997"
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportClient(scope, data);

                //Then
                Assert.True(result.Success);

                var client = await context.Client.FirstOrDefaultAsync(m => m.IdNumber == data.IdNumber);
                var contacts = await context.Contact.Where(c => c.ClientId == client.Id).ToListAsync();
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
        public async Task ImportClient_Update_WithAlternateIdNumber()
        {
            var options = TestHelper.GetDbContext("ImportClient_Update_WithAlternateIdNumber");

            var user1 = TestHelper.InsertUserDetailed(options);

            var mem = new ClientEntity
            {
                Id = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                AlternateIdNumber = "123456",
                OrganisationId = user1.Organisation.Id
            };

            using (var context = new DataContext(options))
            {
                context.Client.Add(mem);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var clientService = new ClientService(context, auditService);
                var lookupService = new ClientLookupService(context);
                var directoryLookupService = new DirectoryLookupService(context);
                var service = new ClientImportService(context, clientService, null, null, lookupService, directoryLookupService);

                //When
                var data = new ImportClient()
                {
                    IdNumber = "123456", //Not a valid id number so should be treated as a passport number
                    LastName = "LN updated"
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportClient(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Client.FirstOrDefaultAsync(m => m.AlternateIdNumber == data.IdNumber);
                Assert.Equal(data.LastName, actual.LastName);
            }
        }

        [Fact]
        public async Task ImportClient_Update_LastNameAndDateOfBirth()
        {
            var options = TestHelper.GetDbContext("ImportClient_Update_LastNameAndDateOfBirth");

            var user1 = TestHelper.InsertUserDetailed(options);

            var mem1 = new ClientEntity
            {
                Id = Guid.NewGuid(),
                ClientTypeId = ClientType.CLIENT_TYPE_INDIVIDUAL,
                OrganisationId = user1.Organisation.Id
            };

            var mem2 = new ClientEntity
            {
                Id = Guid.NewGuid(),
                ClientTypeId = ClientType.CLIENT_TYPE_INDIVIDUAL,
                FirstName = "FN 1",
                LastName = "van Jones",
                IdNumber = "8210035032082",
                DateOfBirth = new DateTime(1982, 10, 3),
                OrganisationId = user1.Organisation.Id
            };

            using (var context = new DataContext(options))
            {
                context.Client.Add(mem1);
                context.Client.Add(mem2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var clientService = new ClientService(context, auditService);
                var lookupService = new ClientLookupService(context);
                var directoryLookupService = new DirectoryLookupService(context);
                var service = new ClientImportService(context, clientService, null, null, lookupService, directoryLookupService);

                //When
                var data = new ImportClient()
                {
                    FirstName = "FN 1 Updated",
                    LastName = mem2.LastName,
                    DateOfBirth = mem2.DateOfBirth
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportClient(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Client.FirstOrDefaultAsync(m => m.IdNumber == mem2.IdNumber);
                Assert.Equal(data.FirstName, actual.FirstName);
            }
        }

        [Fact]
        public async Task ImportClient_InsertPolicy()
        {
            var options = TestHelper.GetDbContext("ImportClient_InsertPolicy");

            var user1 = TestHelper.InsertUserDetailed(options);

            var policyType1 = TestHelper.InsertPolicyType(options);
            var policyType2 = TestHelper.InsertPolicyType(options);

            var company = TestHelper.InsertCompany(options);

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var clientService = new ClientService(context, auditService);
                var policyService = new PolicyService(context, auditService);
                var lookupService = new ClientLookupService(context);
                var directoryLookupService = new DirectoryLookupService(context);
                var service = new ClientImportService(context, clientService, policyService, null, lookupService, directoryLookupService);

                //When
                var data = new ImportClient()
                {
                    IdNumber = "12345",
                    LastName = "LN",
                    PolicyNumber = "987654",
                    PolicyCompanyId = company.Id,
                    PolicyTypeCode = policyType2.Code,
                    PolicyPremium = 5000,
                    PolicyStartDate = DateTime.Now,
                    PolicyUserFullName = $"{user1.User.FirstName} {user1.User.LastName}"
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportClient(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Policy.FirstOrDefaultAsync(m => m.Number == data.PolicyNumber);
                Assert.Equal(data.PolicyCompanyId, actual.CompanyId);
                Assert.Equal(user1.User.Id, actual.UserId);
                Assert.Equal(data.PolicyPremium, actual.Premium);
                Assert.Equal(data.PolicyStartDate, actual.StartDate);
                Assert.Equal(policyType2.Id, actual.PolicyTypeId);
            }
        }

        [Fact]
        public async Task ImportClient_InsertPolicy_CheckUserAlias()
        {
            var options = TestHelper.GetDbContext("ImportClient_InsertPolicy_CheckUserAlias");

            var organisation = TestHelper.InsertOrganisation(options);

            var user = new UserEdit
            {
                Id = Guid.NewGuid(),
                FirstName = "Dean",
                LastName = "van Niekerk",
                Aliases = new List<string>() { "DJVANNiekerk" }
            };

            var user1 = TestHelper.InsertUserDetailed(options, organisation, user);

            var company = TestHelper.InsertCompany(options);

            using (var context = new DataContext(options))
            {
                var auditService = new AuditServiceMock();
                var clientService = new ClientService(context, auditService);
                var policyService = new PolicyService(context, auditService);
                var lookupService = new ClientLookupService(context);
                var directoryLookupService = new DirectoryLookupService(context);
                var service = new ClientImportService(context, clientService, policyService, null, lookupService, directoryLookupService);

                //When
                var data = new ImportClient()
                {
                    IdNumber = "12345",
                    LastName = "LN",
                    PolicyNumber = "987654",
                    PolicyCompanyId = company.Id,
                    PolicyUserFullName = "DjvanNiekerk"
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportClient(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Policy.FirstOrDefaultAsync(m => m.Number == data.PolicyNumber);
                Assert.Equal(data.PolicyCompanyId, actual.CompanyId);
                Assert.Equal(user1.User.Id, actual.UserId);
            }
        }


        [Fact]
        public async Task ImportClient_UpdatePolicy()
        {
            var options = TestHelper.GetDbContext("ImportClient_UpdatePolicy");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation, "8210035032082");

            var user2 = TestHelper.InsertUserDetailed(options, user1.Organisation);

            var policyType1 = TestHelper.InsertPolicyType(options);
            var policyType2 = TestHelper.InsertPolicyType(options);

            var company = TestHelper.InsertCompany(options);

            //Given
            var policyEntity1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                CompanyId = company.Id,
                ClientId = client1.Client.Id,
                UserId = user2.User.Id,
                PolicyTypeId = policyType2.Id,
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
                var auditService = new AuditServiceMock();
                var clientService = new ClientService(context, auditService);
                var policyService = new PolicyService(context, auditService);
                var lookupService = new ClientLookupService(context);
                var directoryLookupService = new DirectoryLookupService(context);
                var service = new ClientImportService(context, clientService, policyService, null, lookupService, directoryLookupService);

                //When
                var data = new ImportClient()
                {
                    IdNumber = client1.Client.IdNumber,
                    LastName = "LN",
                    PolicyNumber = policyEntity1.Number,
                    PolicyCompanyId = policyEntity1.CompanyId,
                    PolicyTypeCode = policyType1.Code,
                    PolicyPremium = 6000,
                    PolicyStartDate = DateTime.Now.AddDays(-100),
                    PolicyUserFullName = $"{user1.User.FirstName} {user1.User.LastName}"
                };

                var scope = TestHelper.GetScopeOptions(user1);

                var result = await service.ImportClient(scope, data);

                //Then
                Assert.True(result.Success);

                var actual = await context.Policy.FirstOrDefaultAsync(m => m.Number == data.PolicyNumber);
                Assert.Equal(data.PolicyCompanyId, actual.CompanyId);
                Assert.Equal(user1.User.Id, actual.UserId);
                Assert.Equal(data.PolicyPremium, actual.Premium);
                Assert.Equal(data.PolicyStartDate, actual.StartDate);
                Assert.Equal(policyType1.Id, actual.PolicyTypeId);
            }
        }
    }
}