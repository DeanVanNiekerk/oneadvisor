using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Controllers.Directory.Roles;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Newtonsoft.Json;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Role;
using Xunit;

namespace api.Test.Controllers.Directory
{
    public class RoleControllerTest
    {
        [Fact]
        public void RoleModelComposition()
        {
            Assert.Equal(4, typeof(Role).PropertyCount());
            Assert.True(typeof(Role).HasProperty("Id"));
            Assert.True(typeof(Role).HasProperty("Name"));
            Assert.True(typeof(Role).HasProperty("Description"));
            Assert.True(typeof(Role).HasProperty("ApplicationId"));
        }

        [Fact]
        public void RoleEditModelComposition()
        {
            Assert.Equal(5, typeof(RoleEdit).PropertyCount());
            Assert.True(typeof(RoleEdit).HasProperty("Id"));
            Assert.True(typeof(RoleEdit).HasProperty("Name"));
            Assert.True(typeof(RoleEdit).HasProperty("Description"));
            Assert.True(typeof(RoleEdit).HasProperty("ApplicationId"));
            Assert.True(typeof(RoleEdit).HasProperty("UseCaseIds"));
        }

        [Fact]
        public async Task Index()
        {
            var role = new Role()
            {
                Id = Guid.NewGuid(),
                Name = "role_1",
                Description = "Role 1",
                ApplicationId = Guid.NewGuid()
            };

            var items = new List<Role>()
            {
                role
            };

            var service = new Mock<IRoleService>();

            service.Setup(c => c.GetRoles())
                .ReturnsAsync(items);

            var controller = new RolesController(service.Object);

            var result = await controller.Index();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<Role>>(okResult.Value);

            Assert.Same(items, returnValue);
        }



        [Fact]
        public async Task Get()
        {
            var role = new RoleEdit()
            {
                Id = Guid.NewGuid(),
                Name = "role_1",
                Description = "Role 1",
                ApplicationId = Guid.NewGuid(),
                UseCaseIds = new List<string>() { "uc1" }
            };

            var service = new Mock<IRoleService>();

            service.Setup(c => c.GetRole(It.Is<Guid>(m => m == role.Id.Value)))
                .ReturnsAsync(role);

            var controller = new RolesController(service.Object);

            var result = await controller.Get(role.Id.Value);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<RoleEdit>(okResult.Value);

            Assert.Same(role, returnValue);
        }


        [Fact]
        public async Task Insert()
        {
            var role = new RoleEdit()
            {
                Id = Guid.NewGuid(),
                Name = "role_1",
                Description = "Role 1",
                ApplicationId = Guid.NewGuid(),
                UseCaseIds = new List<string>() { "uc1" }
            };

            var service = new Mock<IRoleService>();

            var result = new Result()
            {
                Success = true
            };

            RoleEdit inserted = null;
            service.Setup(c => c.InsertRole(It.Is<RoleEdit>(m => m == role)))
                .Callback((RoleEdit i) =>
                {
                    inserted = i;
                })
                .ReturnsAsync(result);

            var controller = new RolesController(service.Object);

            var actual = await controller.Insert(role);

            Assert.Same(role, inserted);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Update()
        {
            var role = new RoleEdit()
            {
                Id = Guid.NewGuid(),
                Name = "role_1",
                Description = "Role 1",
                ApplicationId = Guid.NewGuid(),
                UseCaseIds = new List<string>() { "uc1" }
            };

            var service = new Mock<IRoleService>();

            var result = new Result()
            {
                Success = true
            };

            RoleEdit updated = null;

            service.Setup(c => c.UpdateRole(It.Is<RoleEdit>(m => m == role)))
                .Callback((RoleEdit u) =>
                {
                    updated = u;
                })
                .ReturnsAsync(result);

            var controller = new RolesController(service.Object);

            var actual = await controller.Update(role.Id.Value, role);

            Assert.Same(role, updated);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

    }
}