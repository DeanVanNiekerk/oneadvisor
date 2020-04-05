using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using api.Controllers.Directory.Organisations;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Organisation;
using OneAdvisor.Model.Directory.Model.Organisation.Configuration;
using OneAdvisor.Model.Directory.Model.User;
using Xunit;

namespace api.Test.Controllers.Directory
{
    public class OrganistionControllerTest
    {
        [Fact]
        public void OrganisationModelComposition()
        {
            Assert.Equal(5, typeof(Organisation).PropertyCount());
            Assert.True(typeof(Organisation).HasProperty("Id"));
            Assert.True(typeof(Organisation).HasProperty("Name"));
            Assert.True(typeof(Organisation).HasProperty("VATRegistered"));
            Assert.True(typeof(Organisation).HasProperty("VATRegistrationDate"));
            Assert.True(typeof(Organisation).HasProperty("Config"));
        }

        [Fact]
        public void OrganisationEditModelComposition()
        {
            Assert.Equal(5, typeof(OrganisationEdit).PropertyCount());
            Assert.True(typeof(OrganisationEdit).HasProperty("Id"));
            Assert.True(typeof(OrganisationEdit).HasProperty("Name"));
            Assert.True(typeof(Organisation).HasProperty("VATRegistered"));
            Assert.True(typeof(Organisation).HasProperty("VATRegistrationDate"));
            Assert.True(typeof(OrganisationEdit).HasProperty("Config"));
        }

        [Fact]
        public async Task Index()
        {
            var organisation = new Organisation()
            {
                Id = Guid.NewGuid(),
                Name = "organisation_1",
                VATRegistered = true,
                VATRegistrationDate = DateTime.Now,
            };

            var items = new PagedItems<Organisation>()
            {
                TotalItems = 1,
                Items = new List<Organisation>()
                {
                    organisation
                }
            };

            var service = new Mock<IOrganisationService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            OrganisationQueryOptions queryOptions = null;

            service.Setup(c => c.GetOrganisations(It.IsAny<OrganisationQueryOptions>()))
                .Callback((OrganisationQueryOptions options) => queryOptions = options)
                .ReturnsAsync(items);

            var controller = new OrganisationsController(authService.Object, service.Object);
            controller.ControllerContext = TestHelper.GetControllerContext(new ClaimsPrincipal());

            var result = await controller.Index();

            Assert.Equal(Scope.Branch, queryOptions.Scope.Scope);
            Assert.Equal("Name", queryOptions.SortOptions.Column);
            Assert.Equal(SortDirection.Ascending, queryOptions.SortOptions.Direction);
            Assert.Equal(0, queryOptions.PageOptions.Size);
            Assert.Equal(0, queryOptions.PageOptions.Number);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedItems<Organisation>>(okResult.Value);

            Assert.Same(items, returnValue);
        }



        [Fact]
        public async Task Get()
        {
            var organisation = new OrganisationEdit()
            {
                Id = Guid.NewGuid(),
                Name = "organisation_1",
                VATRegistered = true,
                VATRegistrationDate = DateTime.Now,
                Config = new Config()
            };

            var service = new Mock<IOrganisationService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            service.Setup(c => c.GetOrganisation(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == organisation.Id.Value)))
                .ReturnsAsync(organisation);

            var controller = new OrganisationsController(authService.Object, service.Object);
            controller.ControllerContext = TestHelper.GetControllerContext(new ClaimsPrincipal());

            var result = await controller.Get(organisation.Id.Value);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<OrganisationEdit>(okResult.Value);

            Assert.Same(organisation, returnValue);
        }


        [Fact]
        public async Task Insert()
        {
            var organisation = new OrganisationEdit()
            {
                Id = Guid.NewGuid(),
                Name = "organisation_1",
                VATRegistered = true,
                VATRegistrationDate = DateTime.Now,
                Config = new Config()
            };

            var service = new Mock<IOrganisationService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            OrganisationEdit inserted = null;
            service.Setup(c => c.InsertOrganisation(It.IsAny<ScopeOptions>(), It.Is<OrganisationEdit>(m => m == organisation)))
                .Callback((ScopeOptions o, OrganisationEdit i) =>
                {
                    inserted = i;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new OrganisationsController(authService.Object, service.Object);
            controller.ControllerContext = TestHelper.GetControllerContext(new ClaimsPrincipal());

            var actual = await controller.Insert(organisation);

            Assert.Same(organisation, inserted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Update()
        {
            var organisation = new OrganisationEdit()
            {
                Id = Guid.NewGuid(),
                Name = "organisation_1",
                VATRegistered = true,
                VATRegistrationDate = DateTime.Now,
                Config = new Config()
            };

            var service = new Mock<IOrganisationService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            OrganisationEdit updated = null;
            service.Setup(c => c.UpdateOrganisation(It.IsAny<ScopeOptions>(), It.Is<OrganisationEdit>(m => m == organisation)))
                .Callback((ScopeOptions o, OrganisationEdit u) =>
                {
                    updated = u;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new OrganisationsController(authService.Object, service.Object);
            controller.ControllerContext = TestHelper.GetControllerContext(new ClaimsPrincipal());

            var actual = await controller.Update(organisation.Id.Value, organisation);

            Assert.Same(organisation, updated);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

    }
}