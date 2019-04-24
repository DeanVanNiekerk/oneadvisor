using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Controllers.Commission.CommissionAllocations;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Newtonsoft.Json;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.CommissionAllocation;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using Xunit;

namespace api.Test.Controllers.Commission
{
    public class CommissionAllocationsControllerTest
    {
        [Fact]
        public void CommissionAllocationModelComposition()
        {
            Assert.Equal(4, typeof(CommissionAllocation).PropertyCount());
            Assert.True(typeof(CommissionAllocation).HasProperty("Id"));
            Assert.True(typeof(CommissionAllocation).HasProperty("FromClientId"));
            Assert.True(typeof(CommissionAllocation).HasProperty("ToClientId"));
            Assert.True(typeof(CommissionAllocation).HasProperty("PolicyIds"));
        }

        [Fact]
        public void CommissionAllocationEditModelComposition()
        {
            Assert.Equal(4, typeof(CommissionAllocationEdit).PropertyCount());
            Assert.True(typeof(CommissionAllocationEdit).HasProperty("Id"));
            Assert.True(typeof(CommissionAllocationEdit).HasProperty("FromClientId"));
            Assert.True(typeof(CommissionAllocationEdit).HasProperty("ToClientId"));
            Assert.True(typeof(CommissionAllocation).HasProperty("PolicyIds"));
        }

        [Fact]
        public async Task Index()
        {
            var allocation = new CommissionAllocation()
            {
                Id = Guid.NewGuid(),
                FromClientId = Guid.NewGuid(),
                ToClientId = Guid.NewGuid(),
                PolicyIds = new List<Guid>() { Guid.NewGuid() }
            };

            var pagedItems = new PagedItems<CommissionAllocation>()
            {
                TotalItems = 1,
                Items = new List<CommissionAllocation>()
                {
                    allocation
                }
            };

            var service = new Mock<ICommissionAllocationService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            CommissionAllocationQueryOptions queryOptions = null;
            service.Setup(c => c.GetCommissionAllocations(It.IsAny<CommissionAllocationQueryOptions>()))
                .Callback((CommissionAllocationQueryOptions options) => queryOptions = options)
                .ReturnsAsync(pagedItems);

            var controller = new CommissionAllocationsController(service.Object, authService.Object);

            var result = await controller.Index("toClientId", "desc", 15, 2, $"fromClientId={allocation.FromClientId}");

            Assert.Equal(Scope.Branch, queryOptions.Scope.Scope);
            Assert.Equal("toClientId", queryOptions.SortOptions.Column);
            Assert.Equal(SortDirection.Descending, queryOptions.SortOptions.Direction);
            Assert.Equal(15, queryOptions.PageOptions.Size);
            Assert.Equal(2, queryOptions.PageOptions.Number);

            Assert.Equal(allocation.FromClientId, queryOptions.FromClientId.Single());

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedItems<CommissionAllocation>>(okResult.Value);

            Assert.Same(pagedItems, returnValue);
        }


        [Fact]
        public async Task Get()
        {
            var allocation = new CommissionAllocationEdit()
            {
                Id = Guid.NewGuid(),
                FromClientId = Guid.NewGuid(),
                ToClientId = Guid.NewGuid(),
                PolicyIds = new List<Guid>() { Guid.NewGuid() }
            };

            var service = new Mock<ICommissionAllocationService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            service.Setup(c => c.GetCommissionAllocation(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == allocation.Id.Value)))
                .ReturnsAsync(allocation);

            var controller = new CommissionAllocationsController(service.Object, authService.Object);

            var result = await controller.Get(allocation.Id.Value);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<CommissionAllocationEdit>(okResult.Value);

            Assert.Same(allocation, returnValue);
        }


        [Fact]
        public async Task Insert()
        {
            var allocation = new CommissionAllocationEdit()
            {
                FromClientId = Guid.NewGuid(),
                ToClientId = Guid.NewGuid(),
                PolicyIds = new List<Guid>() { Guid.NewGuid() }
            };

            var service = new Mock<ICommissionAllocationService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            CommissionAllocationEdit inserted = null;
            service.Setup(c => c.InsertCommissionAllocation(It.IsAny<ScopeOptions>(), It.IsAny<CommissionAllocationEdit>()))
                .Callback((ScopeOptions o, CommissionAllocationEdit i) =>
                {
                    inserted = i;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new CommissionAllocationsController(service.Object, authService.Object);

            var actual = await controller.Insert(allocation);

            Assert.Same(allocation, inserted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Update()
        {
            var allocation = new CommissionAllocationEdit()
            {
                Id = Guid.NewGuid(),
                FromClientId = Guid.NewGuid(),
                ToClientId = Guid.NewGuid(),
                PolicyIds = new List<Guid>() { Guid.NewGuid() }
            };

            var service = new Mock<ICommissionAllocationService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            CommissionAllocationEdit updated = null;
            service.Setup(c => c.UpdateCommissionAllocation(It.IsAny<ScopeOptions>(), It.IsAny<CommissionAllocationEdit>()))
                .Callback((ScopeOptions o, CommissionAllocationEdit i) =>
                {
                    updated = i;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new CommissionAllocationsController(service.Object, authService.Object);

            var actual = await controller.Update(allocation.Id.Value, allocation);

            Assert.Same(allocation, updated);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Delete()
        {
            var allocationId = Guid.NewGuid();

            var service = new Mock<ICommissionAllocationService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            Guid deleted = Guid.Empty;

            service.Setup(c => c.DeleteCommissionAllocation(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == allocationId)))
                .Callback((ScopeOptions o, Guid d) =>
                {
                    deleted = d;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new CommissionAllocationsController(service.Object, authService.Object);

            var actual = await controller.Delete(allocationId);

            Assert.Equal(allocationId, deleted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

    }


}