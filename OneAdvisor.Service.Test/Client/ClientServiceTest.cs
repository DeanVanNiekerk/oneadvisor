using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Client.Model.Client;
using OneAdvisor.Service.Client;
using OneAdvisor.Model.Client.Model.Merge;
using OneAdvisor.Model.Client.Model.Lookup;

namespace OneAdvisor.Service.Test.Client
{

    public class ClientServiceTest
    {

        [Fact]
        public async Task GetClients()
        {
            var options = TestHelper.GetDbContext("GetClients");

            var orgId1 = Guid.NewGuid();

            //Given
            var client1 = new ClientEntity
            {
                Id = Guid.NewGuid(),
                ClientTypeId = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                MaidenName = "MN 1",
                Initials = "INI 1",
                PreferredName = "PN 1",
                IdNumber = "321654",
                DateOfBirth = new DateTime(1982, 10, 3),
                OrganisationId = orgId1,
                TaxNumber = "889977",
                MarritalStatusId = Guid.NewGuid(),
                MarriageDate = new DateTime(2009, 11, 13),
            };

            var client2 = new ClientEntity
            {
                Id = Guid.NewGuid(),
                OrganisationId = orgId1
            };

            var client3 = new ClientEntity
            {
                Id = Guid.NewGuid(),
                IsDeleted = true,
                OrganisationId = orgId1
            };

            using (var context = new DataContext(options))
            {
                context.Client.Add(client1);
                context.Client.Add(client2);
                context.Client.Add(client3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ClientService(context);

                //When
                var scope = TestHelper.GetScopeOptions(orgId1);
                var queryOptions = new ClientQueryOptions(scope, "", "", 0, 0);
                var clients = await service.GetClients(queryOptions);

                //Then
                Assert.Equal(2, clients.TotalItems);
                Assert.Equal(2, clients.Items.Count());

                var actual = clients.Items.First();
                Assert.Equal(client1.Id, actual.Id);
                Assert.Equal(client1.FirstName, actual.FirstName);
                Assert.Equal(client1.ClientTypeId, actual.ClientTypeId);
                Assert.Equal(client1.LastName, actual.LastName);
                Assert.Equal(client1.MaidenName, actual.MaidenName);
                Assert.Equal(client1.Initials, actual.Initials);
                Assert.Equal(client1.PreferredName, actual.PreferredName);
                Assert.Equal(client1.IdNumber, actual.IdNumber);
                Assert.Equal(client1.DateOfBirth, actual.DateOfBirth);
                Assert.Equal(client1.TaxNumber, actual.TaxNumber);
                Assert.Equal(client1.MarritalStatusId, actual.MarritalStatusId);
                Assert.Equal(client1.MarriageDate, actual.MarriageDate);
            }
        }


        [Fact]
        public async Task GetClients_OrganisationLevel()
        {
            var options = TestHelper.GetDbContext("GetClients_OrganisationLevel");

            var orgId1 = Guid.NewGuid();
            var orgId2 = Guid.NewGuid();

            //Given
            var client1 = new ClientEntity { Id = Guid.NewGuid(), OrganisationId = orgId1 };
            var client2 = new ClientEntity { Id = Guid.NewGuid(), OrganisationId = orgId1 };
            var client3 = new ClientEntity { Id = Guid.NewGuid(), OrganisationId = orgId2 };

            using (var context = new DataContext(options))
            {
                context.Client.Add(client1);
                context.Client.Add(client2);
                context.Client.Add(client3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ClientService(context);

                //When
                var scope = TestHelper.GetScopeOptions(orgId1);
                var queryOptions = new ClientQueryOptions(scope, "", "", 0, 0);
                var clients = await service.GetClients(queryOptions);

                //Then
                Assert.Equal(2, clients.TotalItems);
                Assert.Equal(2, clients.Items.Count());

                var actual = clients.Items.First();
                Assert.Equal(client1.Id, actual.Id);

                actual = clients.Items.Last();
                Assert.Equal(client2.Id, actual.Id);
            }
        }



        [Fact]
        public async Task GetClients_SortAndPage()
        {
            var options = TestHelper.GetDbContext("GetClients_SortAndPage");

            //Given
            var orgId1 = Guid.NewGuid();

            var mem1 = new ClientEntity { Id = Guid.NewGuid(), LastName = "A Name 1", OrganisationId = orgId1 };
            var mem2 = new ClientEntity { Id = Guid.NewGuid(), LastName = "B Name 2", OrganisationId = orgId1 };
            var mem3 = new ClientEntity { Id = Guid.NewGuid(), LastName = "C Name 3", OrganisationId = orgId1 };
            var mem4 = new ClientEntity { Id = Guid.NewGuid(), LastName = "D Name 4", OrganisationId = orgId1 };
            var mem5 = new ClientEntity { Id = Guid.NewGuid(), LastName = "E Name 5", OrganisationId = orgId1 };
            var mem6 = new ClientEntity { Id = Guid.NewGuid(), LastName = "F Name 6", OrganisationId = orgId1 };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.Client.Add(mem1);
                context.Client.Add(mem2);
                context.Client.Add(mem6);
                context.Client.Add(mem4);
                context.Client.Add(mem5);
                context.Client.Add(mem3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ClientService(context);

                //When
                var scope = TestHelper.GetScopeOptions(orgId1);
                var queryOptions = new ClientQueryOptions(scope, "LastName", "desc", 2, 2);
                var actual = await service.GetClients(queryOptions);

                //Then
                Assert.Equal(6, actual.TotalItems);

                var clients = actual.Items.ToArray();

                Assert.Equal(2, clients.Count());

                var actual1 = clients[0];
                Assert.Equal(mem4.Id, actual1.Id);

                var actual2 = clients[1];
                Assert.Equal(mem3.Id, actual2.Id);
            }
        }


        [Fact]
        public async Task GetClient()
        {
            var options = TestHelper.GetDbContext("GetClient");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options);

            //Given
            var mem1 = new ClientEntity
            {
                Id = Guid.NewGuid(),
                OrganisationId = user1.Organisation.Id
            };

            var mem2 = new ClientEntity
            {
                Id = Guid.NewGuid(),
                ClientTypeId = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                MaidenName = "MN 1",
                Initials = "INI 1",
                PreferredName = "PN 1",
                IdNumber = "321654",
                DateOfBirth = new DateTime(1982, 10, 3),
                OrganisationId = user2.Organisation.Id,
                TaxNumber = "889977",
                MarritalStatusId = Guid.NewGuid(),
                MarriageDate = new DateTime(2009, 11, 13)
            };

            using (var context = new DataContext(options))
            {
                context.Client.Add(mem1);
                context.Client.Add(mem2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ClientService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user2);
                var actual = await service.GetClient(scope, mem2.Id);

                //Then
                Assert.Equal(mem2.Id, actual.Id);
                Assert.Equal(mem2.ClientTypeId, actual.ClientTypeId);
                Assert.Equal(mem2.FirstName, actual.FirstName);
                Assert.Equal(mem2.LastName, actual.LastName);
                Assert.Equal(mem2.MaidenName, actual.MaidenName);
                Assert.Equal(mem2.Initials, actual.Initials);
                Assert.Equal(mem2.PreferredName, actual.PreferredName);
                Assert.Equal(mem2.IdNumber, actual.IdNumber);
                Assert.Equal(mem2.DateOfBirth, actual.DateOfBirth);
                Assert.Equal(mem2.TaxNumber, actual.TaxNumber);
                Assert.Equal(mem2.MarritalStatusId, actual.MarritalStatusId);
                Assert.Equal(mem2.MarriageDate, actual.MarriageDate);

                //Scope check
                scope = TestHelper.GetScopeOptions(user1);
                actual = await service.GetClient(scope, mem2.Id);

                Assert.Null(actual);
            }
        }


        [Fact]
        public async Task GetClientPreview()
        {
            var options = TestHelper.GetDbContext("GetClientPreview");

            var user1 = TestHelper.InsertUserDetailed(options);

            //Given
            var mem1 = new ClientEntity
            {
                Id = Guid.NewGuid(),
                OrganisationId = user1.Organisation.Id
            };

            var mem2 = new ClientEntity
            {
                Id = Guid.NewGuid(),
                ClientTypeId = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                IdNumber = "321654",
                DateOfBirth = new DateTime(1982, 10, 3),
                OrganisationId = user1.Organisation.Id
            };

            var policy1 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                ClientId = mem2.Id,
                UserId = user1.User.Id
            };

            var policy2 = new PolicyEntity
            {
                Id = Guid.NewGuid(),
                ClientId = mem2.Id,
                UserId = user1.User.Id
            };

            var contact1 = new ContactEntity
            {
                Id = Guid.NewGuid(),
                ClientId = mem2.Id,
                ContactTypeId = ContactType.CONTACT_TYPE_EMAIL,
                Value = "dean@email.com"
            };

            using (var context = new DataContext(options))
            {
                context.Client.Add(mem1);
                context.Client.Add(mem2);

                context.Policy.Add(policy1);
                context.Policy.Add(policy2);

                context.Contact.Add(contact1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ClientService(context);

                //When
                var scopeOptions = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetClientPreview(scopeOptions, mem2.Id);

                //Then
                Assert.Equal(mem2.Id, actual.Id);
                Assert.Equal(mem2.ClientTypeId, actual.ClientTypeId);
                Assert.Equal(mem2.FirstName, actual.FirstName);
                Assert.Equal(mem2.LastName, actual.LastName);
                Assert.Equal(mem2.IdNumber, actual.IdNumber);
                Assert.Equal(mem2.DateOfBirth, actual.DateOfBirth);

                Assert.Equal(2, actual.PolicyCount);
                Assert.Equal(1, actual.ContactCount);
            }
        }

        [Fact]
        public async Task InsertClient()
        {
            var options = TestHelper.GetDbContext("InsertClient");

            var user1 = TestHelper.InsertUserDetailed(options);

            //Given
            var client = new ClientEdit()
            {
                ClientTypeId = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                MaidenName = "MN 1",
                Initials = "INI 1",
                PreferredName = "PN 1",
                IdNumber = "8210035032082",
                DateOfBirth = new DateTime(1982, 10, 3),
                TaxNumber = "889977",
                MarritalStatusId = Guid.NewGuid(),
                MarriageDate = new DateTime(2009, 11, 13)
            };

            using (var context = new DataContext(options))
            {
                var service = new ClientService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1, Scope.User);
                var result = await service.InsertClient(scope, client);

                //Then
                Assert.True(result.Success);

                var actual = await context.Client.FindAsync(((ClientEdit)result.Tag).Id);
                Assert.Equal(client.Id, actual.Id);
                Assert.Equal(client.ClientTypeId, actual.ClientTypeId);
                Assert.Equal(user1.Organisation.Id, actual.OrganisationId);
                Assert.Equal(client.FirstName, actual.FirstName);
                Assert.Equal(client.LastName, actual.LastName);
                Assert.Equal(client.MaidenName, actual.MaidenName);
                Assert.Equal(client.Initials, actual.Initials);
                Assert.Equal(client.PreferredName, actual.PreferredName);
                Assert.Equal(client.IdNumber, actual.IdNumber);
                Assert.Equal(client.DateOfBirth, actual.DateOfBirth);
                Assert.Equal(client.TaxNumber, actual.TaxNumber);
                Assert.Equal(client.MarritalStatusId, actual.MarritalStatusId);
                Assert.Equal(client.MarriageDate, actual.MarriageDate);
            }
        }

        [Fact]
        public async Task UpdateClient()
        {
            var options = TestHelper.GetDbContext("UpdateClient");

            var user1 = TestHelper.InsertUserDetailed(options);
            var user2 = TestHelper.InsertUserDetailed(options);

            //Given
            var mem1 = new ClientEntity { Id = Guid.NewGuid(), FirstName = "FN 1", LastName = "LN 1", OrganisationId = user1.Organisation.Id };
            var mem2 = new ClientEntity
            {
                Id = Guid.NewGuid(),
                ClientTypeId = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                MaidenName = "MN 1",
                Initials = "INI 1",
                PreferredName = "PN 1",
                IdNumber = "8210035032082",
                DateOfBirth = new DateTime(1982, 10, 3),
                OrganisationId = user2.Organisation.Id,
                TaxNumber = "889977",
                MarritalStatusId = Guid.NewGuid(),
                MarriageDate = new DateTime(2009, 11, 13)
            };

            using (var context = new DataContext(options))
            {
                context.Client.Add(mem1);
                context.Client.Add(mem2);

                context.SaveChanges();
            }

            var client = new ClientEdit()
            {
                Id = mem2.Id,
                ClientTypeId = Guid.NewGuid(),
                FirstName = "FN 1 updated",
                LastName = "LN 1 updated",
                MaidenName = "MN 1 updated",
                Initials = "INI 1 updated",
                PreferredName = "PN 1 updated",
                IdNumber = "8206090118089",
                DateOfBirth = new DateTime(1983, 10, 3),
                TaxNumber = "445566",
                MarritalStatusId = Guid.NewGuid(),
                MarriageDate = new DateTime(2010, 11, 13)
            };

            using (var context = new DataContext(options))
            {
                var service = new ClientService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user2);
                var result = await service.UpdateClient(scope, client);

                //Then
                Assert.True(result.Success);

                var actual = await context.Client.FindAsync(client.Id);
                Assert.Equal(client.Id, actual.Id);
                Assert.Equal(client.ClientTypeId, actual.ClientTypeId);
                Assert.Equal(user2.Organisation.Id, actual.OrganisationId);
                Assert.Equal(client.FirstName, actual.FirstName);
                Assert.Equal(client.LastName, actual.LastName);
                Assert.Equal(client.MaidenName, actual.MaidenName);
                Assert.Equal(client.Initials, actual.Initials);
                Assert.Equal(client.PreferredName, actual.PreferredName);
                Assert.Equal(client.IdNumber, actual.IdNumber);
                Assert.Equal(client.DateOfBirth, actual.DateOfBirth);
                Assert.Equal(client.TaxNumber, actual.TaxNumber);
                Assert.Equal(client.MarritalStatusId, actual.MarritalStatusId);
                Assert.Equal(client.MarriageDate, actual.MarriageDate);

                //Scope check
                scope = TestHelper.GetScopeOptions(user1);
                result = await service.UpdateClient(scope, client);

                //Then
                Assert.False(result.Success);
            }
        }

        [Fact]
        public async Task DeleteClient()
        {
            var options = TestHelper.GetDbContext("DeleteClient");

            var user1 = TestHelper.InsertUserDetailed(options);
            var client1 = TestHelper.InsertClient(options, user1.Organisation);
            var client2 = TestHelper.InsertClient(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            using (var context = new DataContext(options))
            {
                var service = new ClientService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.DeleteClient(scope, client1.Client.Id);

                //Then
                Assert.True(result.Success);

                var actual = await context.Client.FindAsync(client1.Client.Id);
                Assert.True(actual.IsDeleted);

                var client = await service.GetClient(scope, client1.Client.Id);
                Assert.Null(client);

                //Scope check
                scope = TestHelper.GetScopeOptions(user2);
                result = await service.DeleteClient(scope, client2.Client.Id);

                //Then
                Assert.False(result.Success);
            }
        }

        [Fact]
        public async Task GetClients_Filter()
        {
            var options = TestHelper.GetDbContext("GetClients_Filter");

            //Given
            var orgId1 = Guid.NewGuid();
            var client1 = new ClientEntity
            {
                Id = Guid.NewGuid(),
                LastName = "van Niekerk",
                OrganisationId = orgId1
            };

            var client2 = new ClientEntity
            {
                Id = Guid.NewGuid(),
                LastName = "Jones",
                OrganisationId = orgId1
            };

            using (var context = new DataContext(options))
            {
                context.Client.Add(client1);
                context.Client.Add(client2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ClientService(context);

                //When
                var scope = TestHelper.GetScopeOptions(orgId1);
                var queryOptions = new ClientQueryOptions(scope, "", "", 0, 0, "lastName=%nie%");
                var clients = await service.GetClients(queryOptions);

                //Then
                Assert.Equal(1, clients.TotalItems);
                Assert.Single(clients.Items);

                var actual = clients.Items.First();
                Assert.Equal(client1.Id, actual.Id);
            }
        }

        [Fact]
        public async Task MergeClients()
        {
            var options = TestHelper.GetDbContext("MergeClients");

            //Given
            var user = TestHelper.InsertUserDetailed(options);

            var clientSource1 = TestHelper.InsertClient(options, user.Organisation, "8210035032082");
            var clientSource2 = TestHelper.InsertClient(options, user.Organisation);
            var client3 = TestHelper.InsertClient(options, user.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);
            var client4 = TestHelper.InsertClient(options, user2.Organisation, "8210035032082"); //Same Id but different organisation

            var target = new ClientEdit
            {
                ClientTypeId = Guid.NewGuid(),
                FirstName = "FN 1",
                LastName = "LN 1",
                MaidenName = "MN 1",
                Initials = "INI 1",
                PreferredName = "PN 1",
                IdNumber = "8210035032082",
                DateOfBirth = new DateTime(1982, 10, 3),
                TaxNumber = "889977",
                MarritalStatusId = Guid.NewGuid(),
                MarriageDate = new DateTime(2009, 11, 13),
            };

            using (var context = new DataContext(options))
            {
                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ClientService(context);

                var merge = new MergeClients()
                {
                    TargetClient = target,
                    SourceClientIds = new List<Guid>() { clientSource1.Client.Id, clientSource2.Client.Id }
                };

                //When
                var scope = TestHelper.GetScopeOptions(user.Organisation.Id);
                var result = await service.MergeClients(scope, merge);

                //Then
                Assert.True(result.Success);

                //Check new client added
                var clientId = ((ClientEdit)result.Tag).Id;
                var actual = context.Client.Find(clientId);
                Assert.Equal(target.FirstName, actual.FirstName);
                Assert.Equal(target.LastName, actual.LastName);
                Assert.Equal(target.MaidenName, actual.MaidenName);
                Assert.Equal(target.Initials, actual.Initials);
                Assert.Equal(target.PreferredName, actual.PreferredName);
                Assert.Equal(target.IdNumber, actual.IdNumber);
                Assert.Equal(target.DateOfBirth, actual.DateOfBirth);
                Assert.Equal(target.TaxNumber, actual.TaxNumber);
                Assert.Equal(target.MarritalStatusId, actual.MarritalStatusId);
                Assert.Equal(target.MarriageDate, actual.MarriageDate);
                Assert.False(actual.IsDeleted);

                //Check old clients deleted
                actual = context.Client.Find(clientSource1.Client.Id);
                Assert.True(actual.IsDeleted);
                actual = context.Client.Find(clientSource2.Client.Id);
                Assert.True(actual.IsDeleted);

                //Dummy un-effected
                actual = context.Client.Find(client3.Client.Id);
                Assert.False(actual.IsDeleted);

                //Different Organisation un-effected
                actual = context.Client.Find(client4.Client.Id);
                Assert.False(actual.IsDeleted);
            }
        }

        [Fact]
        public async Task MergeClients_ScopeCheck()
        {
            var options = TestHelper.GetDbContext("MergeClients_ScopeCheck");

            //Given
            var user = TestHelper.InsertUserDetailed(options);

            var clientSource1 = TestHelper.InsertClient(options, user.Organisation, "8210035032082");
            var clientSource2 = TestHelper.InsertClient(options, user.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            var target = new ClientEdit
            {
                IdNumber = "8210035032082",
                ClientTypeId = Guid.NewGuid()
            };

            using (var context = new DataContext(options))
            {
                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ClientService(context);

                var merge = new MergeClients()
                {
                    TargetClient = target,
                    SourceClientIds = new List<Guid>() { clientSource1.Client.Id, clientSource2.Client.Id }
                };

                //When
                var scope = TestHelper.GetScopeOptions(user2.Organisation.Id);
                var result = await service.MergeClients(scope, merge);

                //Then
                Assert.False(result.Success);
                Assert.Equal("SourceClientIds", result.ValidationFailures[0].PropertyName);
                Assert.Equal("Invalid Source Client Ids", result.ValidationFailures[0].ErrorMessage);
            }
        }

    }
}