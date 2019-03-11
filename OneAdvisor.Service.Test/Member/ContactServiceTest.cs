using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Model.Contact;
using OneAdvisor.Service.Member;

namespace OneAdvisor.Service.Test.Member
{

    public class ContactServiceTest
    {
        [Fact]
        public async Task GetContacts_FilterAndSort()
        {
            var options = TestHelper.GetDbContext("GetContacts_FilterAndSort");

            var user1 = TestHelper.InsertUserDetailed(options);
            var member1 = TestHelper.InsertMember(options, user1.Organisation);
            var member2 = TestHelper.InsertMember(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            //Given
            var contactTypeId1 = Guid.NewGuid();
            var contact1 = new ContactEntity { Id = Guid.NewGuid(), MemberId = member1.Member.Id, Value = "A Contact 1", ContactTypeId = contactTypeId1 };
            var contact2 = new ContactEntity { Id = Guid.NewGuid(), MemberId = member2.Member.Id, Value = "B Contact 2", ContactTypeId = contactTypeId1 };
            var contact3 = new ContactEntity { Id = Guid.NewGuid(), MemberId = member1.Member.Id, Value = "C Contact 3", ContactTypeId = contactTypeId1 };
            var contact4 = new ContactEntity { Id = Guid.NewGuid(), MemberId = member2.Member.Id, Value = "D Contact 4", ContactTypeId = contactTypeId1 };
            var contact5 = new ContactEntity { Id = Guid.NewGuid(), MemberId = member1.Member.Id, Value = "E Contact 5", ContactTypeId = contactTypeId1 };
            var contact6 = new ContactEntity { Id = Guid.NewGuid(), MemberId = member1.Member.Id, Value = "F Contact 6", ContactTypeId = contactTypeId1 };

            using (var context = new DataContext(options))
            {
                //Jumbled order
                context.Contact.Add(contact6);
                context.Contact.Add(contact1);
                context.Contact.Add(contact2);
                context.Contact.Add(contact4);
                context.Contact.Add(contact5);
                context.Contact.Add(contact3);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ContactService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var queryOptions = new ContactQueryOptions(scope, $"memberId={member1.Member.Id.ToString()}");
                var actual = await service.GetContacts(queryOptions);

                //Then
                Assert.Equal(actual.TotalItems, 4);

                var contacts = actual.Items.ToArray();

                Assert.Equal(contacts.Count(), 4);

                var actual1 = contacts[0];
                Assert.Equal(contact1.Id, actual1.Id);
                Assert.Equal(contact1.Value, actual1.Value);
                Assert.Equal(contact1.MemberId, actual1.MemberId);
                Assert.Equal(contact1.ContactTypeId, actual1.ContactTypeId);

                var actual2 = contacts[1];
                Assert.Equal(contact3.Id, actual2.Id);
                Assert.Equal(contact3.Value, actual2.Value);

                var actual6 = contacts[3];
                Assert.Equal(contact6.Id, actual6.Id);
                Assert.Equal(contact6.Value, actual6.Value);

                //Scope check
                scope = TestHelper.GetScopeOptions(user2);
                queryOptions = new ContactQueryOptions(scope, $"memberId={member1.Member.Id.ToString()}");
                actual = await service.GetContacts(queryOptions);

                //Then
                Assert.Equal(actual.TotalItems, 0);
            }
        }

        [Fact]
        public async Task GetContact()
        {
            var options = TestHelper.GetDbContext("GetContact");

            var user1 = TestHelper.InsertUserDetailed(options);
            var member1 = TestHelper.InsertMember(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            //Given
            var contactTypeId1 = Guid.NewGuid();
            var contact1 = new ContactEntity { Id = Guid.NewGuid(), MemberId = member1.Member.Id, Value = "A Contact 1", ContactTypeId = contactTypeId1 };
            var contact2 = new ContactEntity { Id = Guid.NewGuid(), MemberId = member1.Member.Id, Value = "B Contact 2", ContactTypeId = contactTypeId1 };

            using (var context = new DataContext(options))
            {
                context.Contact.Add(contact1);
                context.Contact.Add(contact2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ContactService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetContact(scope, contact1.Id);

                //Then
                Assert.Equal(contact1.Id, actual.Id);
                Assert.Equal(contact1.MemberId, actual.MemberId);
                Assert.Equal(contact1.Value, actual.Value);
                Assert.Equal(contact1.ContactTypeId, actual.ContactTypeId);

                //Scope check
                scope = TestHelper.GetScopeOptions(user2);
                actual = await service.GetContact(scope, contact1.Id);

                //Then
                Assert.Null(actual);
            }
        }

        [Fact]
        public async Task GetContactWithValue()
        {
            var options = TestHelper.GetDbContext("GetContactWithValue");

            var user1 = TestHelper.InsertUserDetailed(options);
            var member1 = TestHelper.InsertMember(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            //Given
            var contactTypeId1 = Guid.NewGuid();
            var contact1 = new ContactEntity { Id = Guid.NewGuid(), MemberId = member1.Member.Id, Value = "dean@gmail.com", ContactTypeId = contactTypeId1 };
            var contact2 = new ContactEntity { Id = Guid.NewGuid(), MemberId = member1.Member.Id, Value = "deanvniekerk@gmail.com", ContactTypeId = contactTypeId1 };

            using (var context = new DataContext(options))
            {
                context.Contact.Add(contact1);
                context.Contact.Add(contact2);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ContactService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var actual = await service.GetContact(scope, member1.Member.Id, contact1.Value);

                //Then
                Assert.Equal(contact1.Id, actual.Id);
                Assert.Equal(contact1.MemberId, actual.MemberId);
                Assert.Equal(contact1.Value, actual.Value);
                Assert.Equal(contact1.ContactTypeId, actual.ContactTypeId);

                //Scope check
                scope = TestHelper.GetScopeOptions(user2);
                actual = await service.GetContact(scope, contact1.Id);

                //Then
                Assert.Null(actual);
            }
        }

        [Fact]
        public async Task InsertContact()
        {
            var options = TestHelper.GetDbContext("InsertContact");

            var user1 = TestHelper.InsertUserDetailed(options);
            var member1 = TestHelper.InsertMember(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            //Given
            var contactTypeId1 = Guid.NewGuid();
            var contact = new Contact()
            {
                MemberId = member1.Member.Id,
                ContactTypeId = contactTypeId1,
                Value = "A Contact 1"
            };

            using (var context = new DataContext(options))
            {
                var service = new ContactService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.InsertContact(scope, contact);

                //Then
                Assert.True(result.Success);

                var actual = await context.Contact.FindAsync(((Contact)result.Tag).Id);
                Assert.Equal(contact.MemberId, actual.MemberId);
                Assert.Equal(contact.ContactTypeId, actual.ContactTypeId);
                Assert.Equal(contact.Value, actual.Value);

                //Scope check
                scope = TestHelper.GetScopeOptions(user2);
                result = await service.InsertContact(scope, contact);

                //Then
                Assert.False(result.Success);
            }
        }

        [Fact]
        public async Task UpdateContact()
        {
            var options = TestHelper.GetDbContext("UpdateContact");

            var user1 = TestHelper.InsertUserDetailed(options);
            var member1 = TestHelper.InsertMember(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            //Given
            var contactTypeId1 = Guid.NewGuid();
            var contactTypeId2 = Guid.NewGuid();
            var contact1 = new ContactEntity { Id = Guid.NewGuid(), MemberId = member1.Member.Id, Value = "A Contact 1", ContactTypeId = contactTypeId1 };
            var contact2 = new ContactEntity { Id = Guid.NewGuid(), MemberId = member1.Member.Id, Value = "B Contact 2", ContactTypeId = contactTypeId1 };

            using (var context = new DataContext(options))
            {
                context.Contact.Add(contact2);
                context.Contact.Add(contact1);

                context.SaveChanges();
            }

            var contact = new Contact()
            {
                Id = contact1.Id,
                MemberId = member1.Member.Id,
                ContactTypeId = contactTypeId2,
                Value = "A Contact 1 Updated"
            };

            using (var context = new DataContext(options))
            {
                var service = new ContactService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.UpdateContact(scope, contact);

                //Then
                Assert.True(result.Success);

                var actual = await context.Contact.FindAsync(contact.Id);
                Assert.Equal(contact.MemberId, actual.MemberId);
                Assert.Equal(contact.ContactTypeId, actual.ContactTypeId);
                Assert.Equal(contact.Value, actual.Value);

                //Scope check
                scope = TestHelper.GetScopeOptions(user2);
                result = await service.UpdateContact(scope, contact);

                //Then
                Assert.False(result.Success);
            }
        }

        [Fact]
        public async Task DeleteContact()
        {
            var options = TestHelper.GetDbContext("DeleteContact");

            var user1 = TestHelper.InsertUserDetailed(options);
            var member1 = TestHelper.InsertMember(options, user1.Organisation);

            var user2 = TestHelper.InsertUserDetailed(options);

            //Given
            var contactTypeId1 = Guid.NewGuid();
            var contactTypeId2 = Guid.NewGuid();
            var contact1 = new ContactEntity { Id = Guid.NewGuid(), MemberId = member1.Member.Id, Value = "A Contact 1", ContactTypeId = contactTypeId1 };
            var contact2 = new ContactEntity { Id = Guid.NewGuid(), MemberId = member1.Member.Id, Value = "B Contact 2", ContactTypeId = contactTypeId1 };

            using (var context = new DataContext(options))
            {
                context.Contact.Add(contact2);
                context.Contact.Add(contact1);

                context.SaveChanges();
            }

            using (var context = new DataContext(options))
            {
                var service = new ContactService(context);

                //When
                var scope = TestHelper.GetScopeOptions(user1);
                var result = await service.DeleteContact(scope, contact1.Id);

                //Then
                Assert.True(result.Success);

                var actual = await context.Contact.FindAsync(contact1.Id);
                Assert.Null(actual);

                //Scope check
                scope = TestHelper.GetScopeOptions(user2);
                result = await service.DeleteContact(scope, contact1.Id);

                //Then
                Assert.False(result.Success);
            }
        }

    }
}