using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Controllers.Commission.CommissionSplitRules;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Newtonsoft.Json;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.CommissionSplitRule;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using Xunit;

namespace api.Test.Controllers.Commission
{
    public class CommissionSplitRulesControllerTest
    {
        [Fact]
        public void CommissionSplitRuleModelComposition()
        {
            Assert.Equal(5, typeof(CommissionSplitRule).PropertyCount());
            Assert.True(typeof(CommissionSplitRule).HasProperty("Id"));
            Assert.True(typeof(CommissionSplitRule).HasProperty("UserId"));
            Assert.True(typeof(CommissionSplitRule).HasProperty("Name"));
            Assert.True(typeof(CommissionSplitRule).HasProperty("IsDefault"));
            Assert.True(typeof(CommissionSplitRule).HasProperty("Split"));
        }

        [Fact]
        public void CommissionSplitModelComposition()
        {
            Assert.Equal(2, typeof(CommissionSplit).PropertyCount());
            Assert.True(typeof(CommissionSplit).HasProperty("UserId"));
            Assert.True(typeof(CommissionSplit).HasProperty("Percentage"));
        }

        [Fact]
        public async Task Index()
        {
            var rule = new CommissionSplitRule()
            {
                Id = Guid.NewGuid(),
                Name = Guid.NewGuid().ToString(),
                UserId = Guid.NewGuid(),
                IsDefault = true,
                Split = new List<CommissionSplit>(),
            };

            var pagedItems = new PagedItems<CommissionSplitRule>()
            {
                TotalItems = 1,
                Items = new List<CommissionSplitRule>()
                {
                    rule
                }
            };

            var service = new Mock<ICommissionSplitService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            CommissionSplitRuleQueryOptions queryOptions = null;
            service.Setup(c => c.GetCommissionSplitRules(It.IsAny<CommissionSplitRuleQueryOptions>()))
                .Callback((CommissionSplitRuleQueryOptions options) => queryOptions = options)
                .ReturnsAsync(pagedItems);

            var controller = new CommissionSplitRulesController(service.Object, authService.Object);

            var result = await controller.Index("Name", "desc", 15, 2, $"UserId={rule.UserId}");

            Assert.Equal(Scope.Branch, queryOptions.Scope.Scope);
            Assert.Equal("Name", queryOptions.SortOptions.Column);
            Assert.Equal(SortDirection.Descending, queryOptions.SortOptions.Direction);
            Assert.Equal(15, queryOptions.PageOptions.Size);
            Assert.Equal(2, queryOptions.PageOptions.Number);

            Assert.Equal(rule.UserId, queryOptions.UserId.Single());

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedItems<CommissionSplitRule>>(okResult.Value);

            Assert.Same(pagedItems, returnValue);
        }


        [Fact]
        public async Task Get()
        {
            var rule = new CommissionSplitRule()
            {
                Id = Guid.NewGuid(),
                Name = Guid.NewGuid().ToString(),
                UserId = Guid.NewGuid(),
                IsDefault = true,
                Split = new List<CommissionSplit>(),
            };

            var pagedItems = new PagedItems<CommissionSplitRule>()
            {
                TotalItems = 1,
                Items = new List<CommissionSplitRule>()
                {
                    rule
                }
            };

            var service = new Mock<ICommissionSplitService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            service.Setup(c => c.GetCommissionSplitRule(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == rule.Id.Value)))
                .ReturnsAsync(rule);

            var controller = new CommissionSplitRulesController(service.Object, authService.Object);

            var result = await controller.Get(rule.Id.Value);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<CommissionSplitRule>(okResult.Value);

            Assert.Same(rule, returnValue);
        }


        [Fact]
        public async Task Insert()
        {
            var rule = new CommissionSplitRule()
            {
                Id = Guid.NewGuid(),
                Name = Guid.NewGuid().ToString(),
                UserId = Guid.NewGuid(),
                IsDefault = true,
                Split = new List<CommissionSplit>(),
            };

            var service = new Mock<ICommissionSplitService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            CommissionSplitRule inserted = null;
            service.Setup(c => c.InsertCommissionSplitRule(It.IsAny<ScopeOptions>(), It.IsAny<CommissionSplitRule>()))
                .Callback((ScopeOptions o, CommissionSplitRule i) =>
                {
                    inserted = i;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new CommissionSplitRulesController(service.Object, authService.Object);

            var actual = await controller.Insert(rule);

            Assert.Same(rule, inserted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Update()
        {
            var rule = new CommissionSplitRule()
            {
                Id = Guid.NewGuid(),
                Name = Guid.NewGuid().ToString(),
                UserId = Guid.NewGuid(),
                IsDefault = true,
                Split = new List<CommissionSplit>(),
            };

            var service = new Mock<ICommissionSplitService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            CommissionSplitRule updated = null;
            service.Setup(c => c.UpdateCommissionSplitRule(It.IsAny<ScopeOptions>(), It.IsAny<CommissionSplitRule>()))
                .Callback((ScopeOptions o, CommissionSplitRule i) =>
                {
                    updated = i;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new CommissionSplitRulesController(service.Object, authService.Object);

            var actual = await controller.Update(rule.Id.Value, rule);

            Assert.Same(rule, updated);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Delete()
        {
            var ruleId = Guid.NewGuid();

            var service = new Mock<ICommissionSplitService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            Guid deleted = Guid.Empty;

            service.Setup(c => c.DeleteCommissionSplitRule(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == ruleId)))
                .Callback((ScopeOptions o, Guid d) =>
                {
                    deleted = d;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new CommissionSplitRulesController(service.Object, authService.Object);

            var actual = await controller.Delete(ruleId);

            Assert.Equal(ruleId, deleted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

    }


}