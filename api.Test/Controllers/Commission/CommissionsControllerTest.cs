using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Controllers.Commission.Commissions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Newtonsoft.Json;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using Xunit;

namespace api.Test.Controllers.Commission
{
    public class CommissionsControllerTest
    {
        [Fact]
        public void CommissionModelComposition()
        {
            Assert.Equal(8, typeof(OneAdvisor.Model.Commission.Model.Commission.Commission).PropertyCount());
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.Commission.Commission).HasProperty("Id"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.Commission.Commission).HasProperty("CommissionStatementId"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.Commission.Commission).HasProperty("PolicyId"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.Commission.Commission).HasProperty("CommissionTypeId"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.Commission.Commission).HasProperty("AmountIncludingVAT"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.Commission.Commission).HasProperty("VAT"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.Commission.Commission).HasProperty("UserId"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.Commission.Commission).HasProperty("PolicyNumber"));
        }

        [Fact]
        public void CommissionEditModelComposition()
        {
            Assert.Equal(7, typeof(CommissionEdit).PropertyCount());
            Assert.True(typeof(CommissionEdit).HasProperty("Id"));
            Assert.True(typeof(CommissionEdit).HasProperty("CommissionStatementId"));
            Assert.True(typeof(CommissionEdit).HasProperty("PolicyId"));
            Assert.True(typeof(CommissionEdit).HasProperty("CommissionTypeId"));
            Assert.True(typeof(CommissionEdit).HasProperty("AmountIncludingVAT"));
            Assert.True(typeof(CommissionEdit).HasProperty("VAT"));
            Assert.True(typeof(CommissionEdit).HasProperty("SourceData"));
        }

        [Fact]
        public async Task Index()
        {
            var commission = new OneAdvisor.Model.Commission.Model.Commission.Commission()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                AmountIncludingVAT = 100,
                VAT = 20,
                CommissionStatementId = Guid.Parse("d5887153-b373-4275-8eb1-6b7c1e9d57db"),
                CommissionTypeId = Guid.Parse("24b55c80-4624-478f-a73a-647bb77f22d8"),
                PolicyId = Guid.Parse("e36c892a-f608-4d24-b29f-d031f4ebf855"),
                PolicyNumber = "123456",
                UserId = Guid.Parse("bb49cd0d-c66d-4c16-858b-0bd6b68df65c")
            };

            var pagedItems = new PagedCommissions()
            {
                TotalItems = 1,
                AverageAmountIncludingVAT = 100,
                AverageVAT = 200,
                SumAmountIncludingVAT = 300,
                SumVAT = 400,
                Items = new List<OneAdvisor.Model.Commission.Model.Commission.Commission>()
                {
                    commission
                }
            };

            var service = new Mock<ICommissionService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            CommissionQueryOptions queryOptions = null;
            service.Setup(c => c.GetCommissions(It.IsAny<CommissionQueryOptions>()))
                .Callback((CommissionQueryOptions options) => queryOptions = options)
                .ReturnsAsync(pagedItems);

            var controller = new CommissionsController(service.Object, authService.Object);

            var result = await controller.Index("policyNumber", "desc", 15, 2, "commissionTypeId=24b55c80-4624-478f-a73a-647bb77f22d8");

            Assert.Equal(Scope.Branch, queryOptions.Scope.Scope);
            Assert.Equal("policyNumber", queryOptions.SortOptions.Column);
            Assert.Equal(SortDirection.Descending, queryOptions.SortOptions.Direction);
            Assert.Equal(15, queryOptions.PageOptions.Size);
            Assert.Equal(2, queryOptions.PageOptions.Number);

            Assert.Equal(commission.CommissionTypeId, queryOptions.CommissionTypeId.Single());

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedCommissions>(okResult.Value);

            Assert.Same(pagedItems, returnValue);
        }

        [Fact]
        public async Task Get()
        {
            var commission = new CommissionEdit()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                AmountIncludingVAT = 100,
                VAT = 20,
                CommissionStatementId = Guid.Parse("d5887153-b373-4275-8eb1-6b7c1e9d57db"),
                CommissionTypeId = Guid.Parse("24b55c80-4624-478f-a73a-647bb77f22d8"),
                PolicyId = Guid.Parse("e36c892a-f608-4d24-b29f-d031f4ebf855"),
                SourceData = null
            };

            var service = new Mock<ICommissionService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            service.Setup(c => c.GetCommission(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == commission.Id.Value)))
                .ReturnsAsync(commission);

            var controller = new CommissionsController(service.Object, authService.Object);

            var result = await controller.Get(commission.Id.Value);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<CommissionEdit>(okResult.Value);

            Assert.Same(commission, returnValue);
        }

        [Fact]
        public async Task Insert()
        {
            var commission = new CommissionEdit()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                AmountIncludingVAT = 100,
                VAT = 20,
                CommissionStatementId = Guid.Parse("d5887153-b373-4275-8eb1-6b7c1e9d57db"),
                CommissionTypeId = Guid.Parse("24b55c80-4624-478f-a73a-647bb77f22d8"),
                PolicyId = Guid.Parse("e36c892a-f608-4d24-b29f-d031f4ebf855"),
                SourceData = null
            };

            var service = new Mock<ICommissionService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            CommissionEdit inserted = null;
            service.Setup(c => c.InsertCommission(It.IsAny<ScopeOptions>(), It.IsAny<CommissionEdit>()))
                .Callback((ScopeOptions o, CommissionEdit i) =>
                {
                    inserted = i;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new CommissionsController(service.Object, authService.Object);

            var actual = await controller.Insert(commission);

            Assert.Same(commission, inserted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Update()
        {
            var commission = new CommissionEdit()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                AmountIncludingVAT = 100,
                VAT = 20,
                CommissionStatementId = Guid.Parse("d5887153-b373-4275-8eb1-6b7c1e9d57db"),
                CommissionTypeId = Guid.Parse("24b55c80-4624-478f-a73a-647bb77f22d8"),
                PolicyId = Guid.Parse("e36c892a-f608-4d24-b29f-d031f4ebf855"),
                SourceData = null
            };

            var service = new Mock<ICommissionService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            CommissionEdit updated = null;
            service.Setup(c => c.UpdateCommission(It.IsAny<ScopeOptions>(), It.IsAny<CommissionEdit>()))
                .Callback((ScopeOptions o, CommissionEdit i) =>
                {
                    updated = i;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new CommissionsController(service.Object, authService.Object);

            var actual = await controller.Update(commission.Id.Value, commission);

            Assert.Same(commission, updated);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }
    }
}