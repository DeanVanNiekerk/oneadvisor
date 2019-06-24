using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using api.Controllers.Directory.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Model.Directory.Model.Role;
using OneAdvisor.Model.Directory.Model.User;
using Xunit;

namespace api.Test.Controllers.Directory
{
    public class UsersControllerTest
    {
        [Fact]
        public void UserModelComposition()
        {
            Assert.Equal(13, typeof(User).PropertyCount());
            Assert.True(typeof(User).HasProperty("Id"));
            Assert.True(typeof(User).HasProperty("FirstName"));
            Assert.True(typeof(User).HasProperty("LastName"));
            Assert.True(typeof(User).HasProperty("Email"));
            Assert.True(typeof(User).HasProperty("UserName"));
            Assert.True(typeof(User).HasProperty("OrganisationId"));
            Assert.True(typeof(User).HasProperty("OrganisationName"));
            Assert.True(typeof(User).HasProperty("BranchId"));
            Assert.True(typeof(User).HasProperty("BranchName"));
            Assert.True(typeof(User).HasProperty("Scope"));
            Assert.True(typeof(User).HasProperty("EmailConfirmed"));
            Assert.True(typeof(User).HasProperty("LockoutEnd"));
            Assert.True(typeof(User).HasProperty("IsLocked"));
        }

        [Fact]
        public void UserEditModelComposition()
        {
            Assert.Equal(10, typeof(UserEdit).PropertyCount());
            Assert.True(typeof(UserEdit).HasProperty("Id"));
            Assert.True(typeof(UserEdit).HasProperty("FirstName"));
            Assert.True(typeof(UserEdit).HasProperty("LastName"));
            Assert.True(typeof(UserEdit).HasProperty("Email"));
            Assert.True(typeof(UserEdit).HasProperty("UserName"));
            Assert.True(typeof(UserEdit).HasProperty("BranchId"));
            Assert.True(typeof(UserEdit).HasProperty("Roles"));
            Assert.True(typeof(UserEdit).HasProperty("Aliases"));
            Assert.True(typeof(UserEdit).HasProperty("Scope"));
            Assert.True(typeof(UserEdit).HasProperty("IsLocked"));
        }

        [Fact]
        public void UserSimpleComposition()
        {
            Assert.Equal(5, typeof(UserSimple).PropertyCount());
            Assert.True(typeof(UserSimple).HasProperty("Id"));
            Assert.True(typeof(UserSimple).HasProperty("FirstName"));
            Assert.True(typeof(UserSimple).HasProperty("LastName"));
            Assert.True(typeof(UserSimple).HasProperty("FullName"));
            Assert.True(typeof(UserSimple).HasProperty("BranchId"));
        }

        [Fact]
        public async Task Index()
        {
            var user = new User()
            {
                Id = Guid.NewGuid(),
                FirstName = "1",
                LastName = "2",
                Email = "3",
                UserName = "4",
                OrganisationId = Guid.NewGuid(),
                OrganisationName = "5",
                BranchId = Guid.NewGuid(),
                BranchName = "6",
                Scope = Scope.Branch
            };

            var pagedItems = new PagedItems<User>()
            {
                TotalItems = 1,
                Items = new List<User>()
                {
                    user
                }
            };

            var service = new Mock<IUserService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            UserQueryOptions queryOptions = null;
            service.Setup(c => c.GetUsers(It.IsAny<UserQueryOptions>()))
                .Callback((UserQueryOptions options) => queryOptions = options)
                .ReturnsAsync(pagedItems);

            var controller = new UsersController(service.Object, authService.Object);
            controller.ControllerContext = TestHelper.GetControllerContext(new ClaimsPrincipal());

            var result = await controller.Index(2, 15);

            Assert.Equal(Scope.Branch, queryOptions.Scope.Scope);
            Assert.Equal(15, queryOptions.PageOptions.Size);
            Assert.Equal(2, queryOptions.PageOptions.Number);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedItems<User>>(okResult.Value);

            Assert.Same(pagedItems, returnValue);
        }

        [Fact]
        public async Task Get()
        {
            var user = new UserEdit()
            {
                Id = Guid.NewGuid(),
                FirstName = "1",
                LastName = "2",
                Email = "3",
                UserName = "4",
                BranchId = Guid.NewGuid(),
                Scope = Scope.Branch,
                Aliases = new string[] { "Hi" },
                Roles = new string[] { "Role 1" },
            };

            var service = new Mock<IUserService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            service.Setup(c => c.GetUser(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == user.Id.Value)))
                .ReturnsAsync(user);

            var controller = new UsersController(service.Object, authService.Object);
            controller.ControllerContext = TestHelper.GetControllerContext(new ClaimsPrincipal());

            var result = await controller.Get(user.Id.Value);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<UserEdit>(okResult.Value);

            Assert.Same(user, returnValue);
        }

        [Fact]
        public async Task Insert()
        {
            var user = new UserEdit()
            {
                Id = Guid.NewGuid(),
                FirstName = "1",
                LastName = "2",
                Email = "3",
                UserName = "4",
                BranchId = Guid.NewGuid(),
                Scope = Scope.Branch,
                Aliases = new string[] { "Hi" },
                Roles = new string[] { "Role 1" },
            };

            var service = new Mock<IUserService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            UserEdit inserted = null;
            service.Setup(c => c.InsertUser(It.IsAny<ScopeOptions>(), It.Is<UserEdit>(m => m == user)))
                .Callback((ScopeOptions o, UserEdit i) =>
                {
                    inserted = i;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new UsersController(service.Object, authService.Object);
            controller.ControllerContext = TestHelper.GetControllerContext(new ClaimsPrincipal());

            var actual = await controller.Insert(user);

            Assert.Same(user, inserted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Update()
        {
            var user = new UserEdit()
            {
                Id = Guid.NewGuid(),
                FirstName = "1",
                LastName = "2",
                Email = "3",
                UserName = "4",
                BranchId = Guid.NewGuid(),
                Scope = Scope.Branch,
                Aliases = new string[] { "Hi" },
                Roles = new string[] { "Role 1" },
            };

            var service = new Mock<IUserService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            UserEdit updated = null;
            service.Setup(c => c.UpdateUser(It.IsAny<ScopeOptions>(), It.Is<UserEdit>(m => m == user)))
                .Callback((ScopeOptions o, UserEdit u) =>
                {
                    updated = u;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new UsersController(service.Object, authService.Object);
            controller.ControllerContext = TestHelper.GetControllerContext(new ClaimsPrincipal());

            var actual = await controller.Update(user.Id.Value, user);

            Assert.Same(user, updated);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task GetUsersSimple()
        {
            var user = new UserSimple()
            {
                Id = Guid.NewGuid(),
                FirstName = "1",
                LastName = "2",
            };

            var pagedItems = new PagedItems<UserSimple>()
            {
                TotalItems = 1,
                Items = new List<UserSimple>()
                {
                    user
                }
            };

            var service = new Mock<IUserService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            ScopeOptions queryOptions = null;
            service.Setup(c => c.GetUsersSimple(It.IsAny<ScopeOptions>()))
                .Callback((ScopeOptions options) => queryOptions = options)
                .ReturnsAsync(pagedItems);

            var controller = new UsersController(service.Object, authService.Object);
            controller.ControllerContext = TestHelper.GetControllerContext(new ClaimsPrincipal());

            var result = await controller.GetUsersSimple();

            Assert.Equal(Scope.Branch, queryOptions.Scope);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedItems<UserSimple>>(okResult.Value);

            Assert.Same(pagedItems, returnValue);
        }

        [Fact]
        public async Task GetUserSimple()
        {
            var user = new UserSimple()
            {
                Id = Guid.NewGuid(),
                FirstName = "1",
                LastName = "2",
                BranchId = Guid.NewGuid()
            };

            var service = new Mock<IUserService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            service.Setup(c => c.GetUserSimple(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == user.Id)))
                .ReturnsAsync(user);

            var controller = new UsersController(service.Object, authService.Object);
            controller.ControllerContext = TestHelper.GetControllerContext(new ClaimsPrincipal());

            var result = await controller.GetUserSimple(user.Id);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<UserSimple>(okResult.Value);

            Assert.Same(user, returnValue);
        }

    }
}