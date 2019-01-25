using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Model.Contact;
using OneAdvisor.Service.Member;

namespace OneAdvisor.Service.Test.Member
{
    [TestClass]
    public class ContactServiceTest
    {
        [TestMethod]
        public async Task GetContacts_FilterAndSort()
        {
            var options = TestHelper.GetDbContext("GetContacts_FilterAndSort");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);
            var member2 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var user2 = TestHelper.InsertDefaultUserDetailed(options);

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
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var queryOptions = new ContactQueryOptions(scope, $"memberId={member1.Member.Id.ToString()}");
                var actual = await service.GetContacts(queryOptions);

                //Then
                Assert.AreEqual(actual.TotalItems, 4);

                var contactes = actual.Items.ToArray();

                Assert.AreEqual(contactes.Count(), 4);

                var actual1 = contactes[0];
                Assert.AreEqual(contact1.Id, actual1.Id);
                Assert.AreEqual(contact1.Value, actual1.Value);
                Assert.AreEqual(contact1.MemberId, actual1.MemberId);
                Assert.AreEqual(contact1.ContactTypeId, actual1.ContactTypeId);

                var actual2 = contactes[1];
                Assert.AreEqual(contact3.Id, actual2.Id);
                Assert.AreEqual(contact3.Value, actual2.Value);

                var actual6 = contactes[3];
                Assert.AreEqual(contact6.Id, actual6.Id);
                Assert.AreEqual(contact6.Value, actual6.Value);

                //Scope check
                scope = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                queryOptions = new ContactQueryOptions(scope, $"memberId={member1.Member.Id.ToString()}");
                actual = await service.GetContacts(queryOptions);

                //Then
                Assert.AreEqual(actual.TotalItems, 0);
            }
        }

        [TestMethod]
        public async Task GetContact()
        {
            var options = TestHelper.GetDbContext("GetContact");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var user2 = TestHelper.InsertDefaultUserDetailed(options);

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
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var actual = await service.GetContact(scope, contact1.Id);

                //Then
                Assert.AreEqual(contact1.Id, actual.Id);
                Assert.AreEqual(contact1.MemberId, actual.MemberId);
                Assert.AreEqual(contact1.Value, actual.Value);
                Assert.AreEqual(contact1.ContactTypeId, actual.ContactTypeId);

                //Scope check
                scope = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                actual = await service.GetContact(scope, contact1.Id);

                //Then
                Assert.IsNull(actual);
            }
        }

        [TestMethod]
        public async Task InsertContact()
        {
            var options = TestHelper.GetDbContext("InsertContact");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var user2 = TestHelper.InsertDefaultUserDetailed(options);

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
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = await service.InsertContact(scope, contact);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Contact.FindAsync(((Contact)result.Tag).Id);
                Assert.AreEqual(contact.MemberId, actual.MemberId);
                Assert.AreEqual(contact.ContactTypeId, actual.ContactTypeId);
                Assert.AreEqual(contact.Value, actual.Value);

                //Scope check
                scope = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                result = await service.InsertContact(scope, contact);

                //Then
                Assert.IsFalse(result.Success);
            }
        }

        [TestMethod]
        public async Task UpdateContact()
        {
            var options = TestHelper.GetDbContext("UpdateContact");

            var user1 = TestHelper.InsertDefaultUserDetailed(options);
            var member1 = TestHelper.InsertDefaultMember(options, user1.Organisation);

            var user2 = TestHelper.InsertDefaultUserDetailed(options);

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
                var scope = TestHelper.GetScopeOptions(user1, Scope.Organisation);
                var result = await service.UpdateContact(scope, contact);

                //Then
                Assert.IsTrue(result.Success);

                var actual = await context.Contact.FindAsync(contact.Id);
                Assert.AreEqual(contact.MemberId, actual.MemberId);
                Assert.AreEqual(contact.ContactTypeId, actual.ContactTypeId);
                Assert.AreEqual(contact.Value, actual.Value);

                //Scope check
                scope = TestHelper.GetScopeOptions(user2, Scope.Organisation);
                result = await service.UpdateContact(scope, contact);

                //Then
                Assert.IsFalse(result.Success);
            }
        }

    }
}