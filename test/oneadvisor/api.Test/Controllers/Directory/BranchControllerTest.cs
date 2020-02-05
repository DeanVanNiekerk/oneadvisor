using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using api.Controllers.Directory.Branches;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Branch;
using OneAdvisor.Model.Directory.Model.User;
using Xunit;

namespace api.Test.Controllers.Directory
{
    public class BranchControllerTest
    {
        [Fact]
        public void BranchModelComposition()
        {
            Assert.Equal(3, typeof(Branch).PropertyCount());
            Assert.True(typeof(Branch).HasProperty("Id"));
            Assert.True(typeof(Branch).HasProperty("OrganisationId"));
            Assert.True(typeof(Branch).HasProperty("Name"));
        }

        [Fact]
        public void BranchSimpleModelComposition()
        {
            Assert.Equal(2, typeof(BranchSimple).PropertyCount());
            Assert.True(typeof(BranchSimple).HasProperty("Id"));
            Assert.True(typeof(BranchSimple).HasProperty("Name"));
        }

        [Fact]
        public async Task Index()
        {
            var branch = new Branch()
            {
                Id = Guid.NewGuid(),
                OrganisationId = Guid.NewGuid(),
                Name = "Branch1"
            };

            var pagedItems = new PagedItems<Branch>()
            {
                TotalItems = 1,
                Items = new List<Branch>()
                {
                    branch
                }
            };

            var service = new Mock<IBranchService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            BranchQueryOptions queryOptions = null;
            service.Setup(c => c.GetBranches(It.IsAny<BranchQueryOptions>()))
                .Callback((BranchQueryOptions options) => queryOptions = options)
                .ReturnsAsync(pagedItems);

            var controller = new BranchesController(service.Object, authService.Object);
            controller.ControllerContext = TestHelper.GetControllerContext(new ClaimsPrincipal());

            var result = await controller.Index($"organisationId={branch.OrganisationId}");

            Assert.Equal(Scope.Branch, queryOptions.Scope.Scope);
            Assert.Equal("Name", queryOptions.SortOptions.Column);
            Assert.Equal(SortDirection.Ascending, queryOptions.SortOptions.Direction);
            Assert.Equal(0, queryOptions.PageOptions.Size);
            Assert.Equal(0, queryOptions.PageOptions.Number);

            Assert.Equal(branch.OrganisationId, queryOptions.OrganisationId);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedItems<Branch>>(okResult.Value);

            Assert.Same(pagedItems, returnValue);
        }

        [Fact]
        public async Task Get()
        {
            var branch = new Branch()
            {
                Id = Guid.NewGuid(),
                OrganisationId = Guid.NewGuid(),
                Name = "Branch1"
            };

            var service = new Mock<IBranchService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            service.Setup(c => c.GetBranch(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == branch.Id.Value)))
                .ReturnsAsync(branch);

            var controller = new BranchesController(service.Object, authService.Object);
            controller.ControllerContext = TestHelper.GetControllerContext(new ClaimsPrincipal());

            var result = await controller.Get(branch.Id.Value);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<Branch>(okResult.Value);

            Assert.Same(branch, returnValue);
        }

        [Fact]
        public async Task Insert()
        {
            var branch = new Branch()
            {
                Id = Guid.NewGuid(),
                OrganisationId = Guid.NewGuid(),
                Name = "Branch1"
            };

            var service = new Mock<IBranchService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            Branch inserted = null;
            service.Setup(c => c.InsertBranch(It.IsAny<ScopeOptions>(), It.Is<Branch>(m => m == branch)))
                .Callback((ScopeOptions o, Branch i) =>
                {
                    inserted = i;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new BranchesController(service.Object, authService.Object);
            controller.ControllerContext = TestHelper.GetControllerContext(new ClaimsPrincipal());

            var actual = await controller.Insert(branch);

            Assert.Same(branch, inserted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Update()
        {
            var branch = new Branch()
            {
                Id = Guid.NewGuid(),
                OrganisationId = Guid.NewGuid(),
                Name = "Branch1"
            };

            var service = new Mock<IBranchService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            Branch updated = null;

            service.Setup(c => c.UpdateBranch(It.IsAny<ScopeOptions>(), It.Is<Branch>(m => m == branch)))
                .Callback((ScopeOptions o, Branch u) =>
                {
                    updated = u;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new BranchesController(service.Object, authService.Object);
            controller.ControllerContext = TestHelper.GetControllerContext(new ClaimsPrincipal());

            var actual = await controller.Update(branch.Id.Value, branch);

            Assert.Same(branch, updated);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task GetBranchesSimple()
        {
            var branch = new BranchSimple()
            {
                Id = Guid.NewGuid(),
                Name = "Branch1"
            };

            var branches = new List<BranchSimple>()
            {
                branch
            };

            var service = new Mock<IBranchService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            ScopeOptions queryOptions = null;
            service.Setup(c => c.GetBranchesSimple(It.IsAny<ScopeOptions>()))
                .Callback((ScopeOptions options) => queryOptions = options)
                .ReturnsAsync(branches);

            var controller = new BranchesController(service.Object, authService.Object);
            controller.ControllerContext = TestHelper.GetControllerContext(new ClaimsPrincipal());

            var result = await controller.GetBranchesSimple();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<BranchSimple>>(okResult.Value);

            Assert.Same(branches, returnValue);
        }
    }
}