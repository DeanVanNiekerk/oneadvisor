using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Model.Client.Model.Client;
using Xunit;
using api.Controllers.Client.Clients;

namespace api.Test.Controllers.Client
{
    public class ClientsControllerTest
    {
        [Fact]
        public void ClientModelComposition()
        {
            Assert.Equal(13, typeof(OneAdvisor.Model.Client.Model.Client.Client).PropertyCount());
            Assert.True(typeof(OneAdvisor.Model.Client.Model.Client.Client).HasProperty("Id"));
            Assert.True(typeof(OneAdvisor.Model.Client.Model.Client.Client).HasProperty("FirstName"));
            Assert.True(typeof(OneAdvisor.Model.Client.Model.Client.Client).HasProperty("LastName"));
            Assert.True(typeof(OneAdvisor.Model.Client.Model.Client.Client).HasProperty("MaidenName"));
            Assert.True(typeof(OneAdvisor.Model.Client.Model.Client.Client).HasProperty("Initials"));
            Assert.True(typeof(OneAdvisor.Model.Client.Model.Client.Client).HasProperty("PreferredName"));
            Assert.True(typeof(OneAdvisor.Model.Client.Model.Client.Client).HasProperty("IdNumber"));
            Assert.True(typeof(OneAdvisor.Model.Client.Model.Client.Client).HasProperty("DateOfBirth"));
            Assert.True(typeof(OneAdvisor.Model.Client.Model.Client.Client).HasProperty("AlternateIdNumber"));
            Assert.True(typeof(OneAdvisor.Model.Client.Model.Client.Client).HasProperty("TaxNumber"));
            Assert.True(typeof(OneAdvisor.Model.Client.Model.Client.Client).HasProperty("MarritalStatusId"));
            Assert.True(typeof(OneAdvisor.Model.Client.Model.Client.Client).HasProperty("MarriageDate"));
            Assert.True(typeof(OneAdvisor.Model.Client.Model.Client.Client).HasProperty("ClientTypeId"));
        }

        [Fact]
        public void ClientEditModelComposition()
        {
            Assert.Equal(13, typeof(ClientEdit).PropertyCount());
            Assert.True(typeof(ClientEdit).HasProperty("Id"));
            Assert.True(typeof(ClientEdit).HasProperty("FirstName"));
            Assert.True(typeof(ClientEdit).HasProperty("LastName"));
            Assert.True(typeof(ClientEdit).HasProperty("MaidenName"));
            Assert.True(typeof(ClientEdit).HasProperty("Initials"));
            Assert.True(typeof(ClientEdit).HasProperty("PreferredName"));
            Assert.True(typeof(ClientEdit).HasProperty("IdNumber"));
            Assert.True(typeof(ClientEdit).HasProperty("DateOfBirth"));
            Assert.True(typeof(ClientEdit).HasProperty("AlternateIdNumber"));
            Assert.True(typeof(ClientEdit).HasProperty("TaxNumber"));
            Assert.True(typeof(ClientEdit).HasProperty("MarritalStatusId"));
            Assert.True(typeof(ClientEdit).HasProperty("MarriageDate"));
            Assert.True(typeof(ClientEdit).HasProperty("ClientTypeId"));
        }

        [Fact]
        public void ClientPreviewModelComposition()
        {
            Assert.Equal(9, typeof(ClientPreview).PropertyCount());
            Assert.True(typeof(ClientPreview).HasProperty("Id"));
            Assert.True(typeof(ClientPreview).HasProperty("ClientTypeId"));
            Assert.True(typeof(ClientPreview).HasProperty("FirstName"));
            Assert.True(typeof(ClientPreview).HasProperty("LastName"));
            Assert.True(typeof(ClientPreview).HasProperty("IdNumber"));
            Assert.True(typeof(ClientPreview).HasProperty("AlternateIdNumber"));
            Assert.True(typeof(ClientPreview).HasProperty("DateOfBirth"));
            Assert.True(typeof(ClientPreview).HasProperty("PolicyCount"));
            Assert.True(typeof(ClientPreview).HasProperty("ContactCount"));
        }

        [Fact]
        public async Task Index()
        {
            var client = new OneAdvisor.Model.Client.Model.Client.Client()
            {
                Id = Guid.NewGuid(),
                FirstName = "1",
                LastName = "2",
                DateOfBirth = DateTime.Now,
                IdNumber = "3",
                Initials = "4",
                MaidenName = "5",
                MarriageDate = DateTime.Now,
                MarritalStatusId = Guid.NewGuid(),
                AlternateIdNumber = "6",
                PreferredName = "7",
                TaxNumber = "8",
                ClientTypeId = Guid.NewGuid()
            };

            var pagedItems = new PagedItems<OneAdvisor.Model.Client.Model.Client.Client>()
            {
                TotalItems = 1,
                Items = new List<OneAdvisor.Model.Client.Model.Client.Client>()
                {
                    client
                }
            };

            var service = new Mock<IClientService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            ClientQueryOptions queryOptions = null;
            service.Setup(c => c.GetClients(It.IsAny<ClientQueryOptions>()))
                .Callback((ClientQueryOptions options) => queryOptions = options)
                .ReturnsAsync(pagedItems);

            var controller = new ClientsController(service.Object, authService.Object);

            var result = await controller.Index("firstName", "desc", 15, 2, "lastName=%van%");

            Assert.Equal(Scope.Branch, queryOptions.Scope.Scope);
            Assert.Equal("firstName", queryOptions.SortOptions.Column);
            Assert.Equal(SortDirection.Descending, queryOptions.SortOptions.Direction);
            Assert.Equal(15, queryOptions.PageOptions.Size);
            Assert.Equal(2, queryOptions.PageOptions.Number);

            Assert.Equal("%van%", queryOptions.LastName);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedItems<OneAdvisor.Model.Client.Model.Client.Client>>(okResult.Value);

            Assert.Same(pagedItems, returnValue);
        }

        [Fact]
        public async Task Get()
        {
            var client = new ClientEdit()
            {
                Id = Guid.NewGuid(),
                FirstName = "1",
                LastName = "2",
                DateOfBirth = new DateTime(1982, 10, 3),
                IdNumber = "3",
                Initials = "4",
                MaidenName = "5",
                MarriageDate = new DateTime(2010, 03, 25),
                MarritalStatusId = Guid.NewGuid(),
                AlternateIdNumber = "6",
                PreferredName = "7",
                TaxNumber = "8",
                ClientTypeId = Guid.NewGuid()
            };

            var service = new Mock<IClientService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            service.Setup(c => c.GetClient(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == client.Id.Value)))
                .ReturnsAsync(client);

            var controller = new ClientsController(service.Object, authService.Object);

            var result = await controller.Get(client.Id.Value);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<ClientEdit>(okResult.Value);

            Assert.Same(client, returnValue);
        }

        [Fact]
        public async Task GetPreview()
        {
            var client = new ClientPreview()
            {
                Id = Guid.NewGuid(),
                FirstName = "1",
                LastName = "2",
                DateOfBirth = new DateTime(1982, 10, 3),
                IdNumber = "3",
                AlternateIdNumber = "4",
                ContactCount = 5,
                PolicyCount = 6
            };

            var service = new Mock<IClientService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            service.Setup(c => c.GetClientPreview(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == client.Id)))
                .ReturnsAsync(client);

            var controller = new ClientsController(service.Object, authService.Object);

            var result = await controller.GetPreview(client.Id);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<ClientPreview>(okResult.Value);

            Assert.Same(client, returnValue);
        }

        [Fact]
        public async Task Insert()
        {
            var client = new ClientEdit()
            {
                Id = Guid.NewGuid(),
                FirstName = "1",
                LastName = "2",
                DateOfBirth = new DateTime(1982, 10, 3),
                IdNumber = "3",
                Initials = "4",
                MaidenName = "5",
                MarriageDate = new DateTime(2010, 03, 25),
                MarritalStatusId = Guid.NewGuid(),
                AlternateIdNumber = "6",
                PreferredName = "7",
                TaxNumber = "8",
                ClientTypeId = Guid.NewGuid()
            };

            var service = new Mock<IClientService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            ClientEdit inserted = null;
            service.Setup(c => c.InsertClient(It.IsAny<ScopeOptions>(), It.Is<ClientEdit>(m => m == client)))
                .Callback((ScopeOptions o, ClientEdit i) =>
                {
                    inserted = i;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new ClientsController(service.Object, authService.Object);

            var actual = await controller.Insert(client);

            Assert.Same(client, inserted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Update()
        {
            var client = new ClientEdit()
            {
                Id = Guid.NewGuid(),
                FirstName = "1",
                LastName = "2",
                DateOfBirth = new DateTime(1982, 10, 3),
                IdNumber = "3",
                Initials = "4",
                MaidenName = "5",
                MarriageDate = new DateTime(2010, 03, 25),
                MarritalStatusId = Guid.NewGuid(),
                AlternateIdNumber = "6",
                PreferredName = "7",
                TaxNumber = "8",
                ClientTypeId = Guid.NewGuid()
            };

            var service = new Mock<IClientService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            ClientEdit updated = null;

            service.Setup(c => c.UpdateClient(It.IsAny<ScopeOptions>(), It.Is<ClientEdit>(m => m == client)))
                .Callback((ScopeOptions o, ClientEdit u) =>
                {
                    updated = u;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new ClientsController(service.Object, authService.Object);

            var actual = await controller.Update(client.Id.Value, client);

            Assert.Same(client, updated);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Delete()
        {
            var clientId = Guid.NewGuid();

            var service = new Mock<IClientService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            Guid deleted = Guid.Empty;

            service.Setup(c => c.DeleteClient(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == clientId)))
                .Callback((ScopeOptions o, Guid d) =>
                {
                    deleted = d;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new ClientsController(service.Object, authService.Object);

            var actual = await controller.Delete(clientId);

            Assert.Equal(clientId, deleted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }
    }
}