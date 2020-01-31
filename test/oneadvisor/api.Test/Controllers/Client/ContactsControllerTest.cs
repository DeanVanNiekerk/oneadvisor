using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Controllers.Client.Contacts;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Model.Client.Model.Contact;
using Xunit;

namespace api.Test.Controllers.Client
{
    public class ContactsControllerTest
    {
        [Fact]
        public void ContactModelComposition()
        {
            Assert.Equal(4, typeof(Contact).PropertyCount());
            Assert.True(typeof(Contact).HasProperty("Id"));
            Assert.True(typeof(Contact).HasProperty("ClientId"));
            Assert.True(typeof(Contact).HasProperty("ContactTypeId"));
            Assert.True(typeof(Contact).HasProperty("Value"));
        }

        [Fact]
        public async Task Index()
        {
            var contact = new Contact()
            {
                Id = Guid.NewGuid(),
                ContactTypeId = Guid.NewGuid(),
                ClientId = Guid.NewGuid(),
                Value = "dean@gmail.com"
            };

            var pagedItems = new PagedItems<Contact>()
            {
                TotalItems = 1,
                Items = new List<Contact>()
                {
                    contact
                }
            };

            var service = new Mock<IContactService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            ContactQueryOptions queryOptions = null;
            service.Setup(c => c.GetContacts(It.IsAny<ContactQueryOptions>()))
                .Callback((ContactQueryOptions options) => queryOptions = options)
                .ReturnsAsync(pagedItems);

            var controller = new ContactsController(service.Object, authService.Object);

            var result = await controller.Index($"clientId={contact.ClientId}");

            Assert.Equal(Scope.Branch, queryOptions.Scope.Scope);
            Assert.Equal("Value", queryOptions.SortOptions.Column);
            Assert.Equal(SortDirection.Ascending, queryOptions.SortOptions.Direction);
            Assert.Equal(0, queryOptions.PageOptions.Size);
            Assert.Equal(0, queryOptions.PageOptions.Number);

            Assert.Equal(contact.ClientId, queryOptions.ClientId);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedItems<Contact>>(okResult.Value);

            Assert.Same(pagedItems, returnValue);
        }

        [Fact]
        public async Task Get()
        {
            var contact = new Contact()
            {
                Id = Guid.NewGuid(),
                ContactTypeId = Guid.NewGuid(),
                ClientId = Guid.NewGuid(),
                Value = "dean@gmail.com"
            };

            var service = new Mock<IContactService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            service.Setup(c => c.GetContact(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == contact.Id.Value)))
                .ReturnsAsync(contact);

            var controller = new ContactsController(service.Object, authService.Object);

            var result = await controller.Get(contact.Id.Value);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<Contact>(okResult.Value);

            Assert.Same(contact, returnValue);
        }

        [Fact]
        public async Task Insert()
        {
            var contact = new Contact()
            {
                Id = Guid.NewGuid(),
                ContactTypeId = Guid.NewGuid(),
                ClientId = Guid.NewGuid(),
                Value = "dean@gmail.com"
            };

            var service = new Mock<IContactService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            Contact inserted = null;
            service.Setup(c => c.InsertContact(It.IsAny<ScopeOptions>(), It.Is<Contact>(m => m == contact)))
                .Callback((ScopeOptions o, Contact i) =>
                {
                    inserted = i;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new ContactsController(service.Object, authService.Object);

            var actual = await controller.Insert(contact);

            Assert.Same(contact, inserted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Update()
        {
            var contact = new Contact()
            {
                Id = Guid.NewGuid(),
                ContactTypeId = Guid.NewGuid(),
                ClientId = Guid.NewGuid(),
                Value = "dean@gmail.com"
            };

            var service = new Mock<IContactService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            Contact updated = null;

            service.Setup(c => c.UpdateContact(It.IsAny<ScopeOptions>(), It.Is<Contact>(m => m == contact)))
                .Callback((ScopeOptions o, Contact u) =>
                {
                    updated = u;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new ContactsController(service.Object, authService.Object);

            var actual = await controller.Update(contact.Id.Value, contact);

            Assert.Same(contact, updated);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Delete()
        {
            var contactId = Guid.NewGuid();

            var service = new Mock<IContactService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            Guid deleted = Guid.Empty;

            service.Setup(c => c.DeleteContact(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == contactId)))
                .Callback((ScopeOptions o, Guid d) =>
                {
                    deleted = d;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new ContactsController(service.Object, authService.Object);

            var actual = await controller.Delete(contactId);

            Assert.Equal(contactId, deleted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }
    }
}