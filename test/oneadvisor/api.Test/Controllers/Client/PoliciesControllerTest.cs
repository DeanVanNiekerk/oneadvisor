using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Controllers.Client.Clients;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Newtonsoft.Json;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Model.Client.Model.Policy;
using Xunit;

namespace api.Test.Controllers.Client
{
    public class PoliciesControllerTest
    {
        [Fact]
        public void PolicyModelComposition()
        {
            Assert.Equal(15, typeof(Policy).PropertyCount());
            Assert.True(typeof(Policy).HasProperty("Id"));
            Assert.True(typeof(Policy).HasProperty("ClientId"));
            Assert.True(typeof(Policy).HasProperty("CompanyId"));
            Assert.True(typeof(Policy).HasProperty("UserId"));
            Assert.True(typeof(Policy).HasProperty("Number"));
            Assert.True(typeof(Policy).HasProperty("StartDate"));
            Assert.True(typeof(Policy).HasProperty("Premium"));
            Assert.True(typeof(Policy).HasProperty("PolicyTypeId"));
            Assert.True(typeof(Policy).HasProperty("PolicyProductTypeId"));
            Assert.True(typeof(Policy).HasProperty("PolicyProductId"));
            Assert.True(typeof(Policy).HasProperty("ClientLastName"));
            Assert.True(typeof(Policy).HasProperty("ClientInitials"));
            Assert.True(typeof(Policy).HasProperty("ClientDateOfBirth"));
            Assert.True(typeof(Policy).HasProperty("IsActive"));
            Assert.True(typeof(Policy).HasProperty("CompanyName"));
        }

        [Fact]
        public void PolicyEditModelComposition()
        {
            Assert.Equal(11, typeof(PolicyEdit).PropertyCount());
            Assert.True(typeof(PolicyEdit).HasProperty("Id"));
            Assert.True(typeof(PolicyEdit).HasProperty("ClientId"));
            Assert.True(typeof(PolicyEdit).HasProperty("CompanyId"));
            Assert.True(typeof(PolicyEdit).HasProperty("UserId"));
            Assert.True(typeof(PolicyEdit).HasProperty("Number"));
            Assert.True(typeof(PolicyEdit).HasProperty("StartDate"));
            Assert.True(typeof(PolicyEdit).HasProperty("Premium"));
            Assert.True(typeof(PolicyEdit).HasProperty("PolicyTypeId"));
            Assert.True(typeof(PolicyEdit).HasProperty("PolicyProductTypeId"));
            Assert.True(typeof(PolicyEdit).HasProperty("PolicyProductId"));
            Assert.True(typeof(PolicyEdit).HasProperty("IsActive"));
        }

        [Fact]
        public async Task Index()
        {
            var policy = new Policy()
            {
                Id = Guid.NewGuid(),
                ClientId = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                Number = "123456",
                StartDate = DateTime.Now,
                Premium = 500,
                PolicyTypeId = Guid.NewGuid()
            };

            var pagedItems = new PagedItems<Policy>()
            {
                TotalItems = 1,
                Items = new List<Policy>()
                {
                    policy
                }
            };

            var service = new Mock<IPolicyService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            PolicyQueryOptions queryOptions = null;
            service.Setup(c => c.GetPolicies(It.IsAny<PolicyQueryOptions>()))
                .Callback((PolicyQueryOptions options) => queryOptions = options)
                .ReturnsAsync(pagedItems);

            var controller = new PoliciesController(service.Object, authService.Object);

            var result = await controller.Index("StartDate", "desc", 15, 2, "Number=%123%");

            Assert.Equal(Scope.Branch, queryOptions.Scope.Scope);
            Assert.Equal("StartDate", queryOptions.SortOptions.Column);
            Assert.Equal(SortDirection.Descending, queryOptions.SortOptions.Direction);
            Assert.Equal(15, queryOptions.PageOptions.Size);
            Assert.Equal(2, queryOptions.PageOptions.Number);

            Assert.Equal("%123%", queryOptions.Number);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedItems<Policy>>(okResult.Value);

            Assert.Same(pagedItems, returnValue);
        }

        [Fact]
        public async Task Get()
        {
            var policy = new PolicyEdit()
            {
                Id = Guid.NewGuid(),
                ClientId = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                Number = "123456",
                StartDate = DateTime.Now,
                Premium = 500,
                PolicyTypeId = Guid.NewGuid()
            };

            var service = new Mock<IPolicyService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            service.Setup(c => c.GetPolicy(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == policy.Id.Value)))
                .ReturnsAsync(policy);

            var controller = new PoliciesController(service.Object, authService.Object);

            var result = await controller.Get(policy.Id.Value);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PolicyEdit>(okResult.Value);

            Assert.Same(policy, returnValue);
        }

        [Fact]
        public async Task Insert()
        {
            var policy = new PolicyEdit()
            {
                Id = Guid.NewGuid(),
                ClientId = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                Number = "123456",
                StartDate = DateTime.Now,
                Premium = 500,
                PolicyTypeId = Guid.NewGuid()
            };


            var service = new Mock<IPolicyService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            PolicyEdit inserted = null;
            service.Setup(c => c.InsertPolicy(It.IsAny<ScopeOptions>(), It.Is<PolicyEdit>(m => m == policy)))
                .Callback((ScopeOptions o, PolicyEdit i) =>
                {
                    inserted = i;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new PoliciesController(service.Object, authService.Object);

            var actual = await controller.Insert(policy);

            Assert.Same(policy, inserted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Update()
        {
            var policy = new PolicyEdit()
            {
                Id = Guid.NewGuid(),
                ClientId = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                Number = "123456",
                StartDate = DateTime.Now,
                Premium = 500,
                PolicyTypeId = Guid.NewGuid()
            };

            var service = new Mock<IPolicyService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            PolicyEdit updated = null;

            service.Setup(c => c.UpdatePolicy(It.IsAny<ScopeOptions>(), It.Is<PolicyEdit>(m => m == policy)))
                .Callback((ScopeOptions o, PolicyEdit u) =>
                {
                    updated = u;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new PoliciesController(service.Object, authService.Object);

            var actual = await controller.Update(policy.Id.Value, policy);

            Assert.Same(policy, updated);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }
    }
}