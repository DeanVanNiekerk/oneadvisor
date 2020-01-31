using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Controllers.Commission.CommissionSplitRules;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.CommissionSplitRulePolicy;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using Xunit;

namespace api.Test.Controllers.Commission
{
    public class CommissionSplitRulePoliciesControllerTest
    {
        [Fact]
        public void CommissionSplitRulePolicyInfoModelComposition()
        {
            Assert.Equal(11, typeof(CommissionSplitRulePolicyInfo).PropertyCount());
            Assert.True(typeof(CommissionSplitRulePolicyInfo).HasProperty("PolicyId"));
            Assert.True(typeof(CommissionSplitRulePolicyInfo).HasProperty("PolicyNumber"));
            Assert.True(typeof(CommissionSplitRulePolicyInfo).HasProperty("PolicyCompanyId"));
            Assert.True(typeof(CommissionSplitRulePolicyInfo).HasProperty("PolicyUserId"));
            Assert.True(typeof(CommissionSplitRulePolicyInfo).HasProperty("PolicyClientId"));
            Assert.True(typeof(CommissionSplitRulePolicyInfo).HasProperty("PolicyClientFirstName"));
            Assert.True(typeof(CommissionSplitRulePolicyInfo).HasProperty("PolicyClientLastName"));
            Assert.True(typeof(CommissionSplitRulePolicyInfo).HasProperty("DefaultCommissionSplitRuleId"));
            Assert.True(typeof(CommissionSplitRulePolicyInfo).HasProperty("DefaultCommissionSplitRuleName"));
            Assert.True(typeof(CommissionSplitRulePolicyInfo).HasProperty("CommissionSplitRuleId"));
            Assert.True(typeof(CommissionSplitRulePolicyInfo).HasProperty("CommissionSplitRuleName"));
        }

        [Fact]
        public void CommissionSplitRulePolicyModelComposition()
        {
            Assert.Equal(3, typeof(CommissionSplitRulePolicy).PropertyCount());
            Assert.True(typeof(CommissionSplitRulePolicy).HasProperty("Id"));
            Assert.True(typeof(CommissionSplitRulePolicy).HasProperty("CommissionSplitRuleId"));
            Assert.True(typeof(CommissionSplitRulePolicy).HasProperty("PolicyId"));
        }

        [Fact]
        public async Task Index()
        {
            var rule = new CommissionSplitRulePolicyInfo()
            {
                PolicyId = Guid.NewGuid(),
                PolicyNumber = Guid.NewGuid().ToString(),
                PolicyCompanyId = Guid.NewGuid(),
                PolicyUserId = Guid.NewGuid()
            };

            var pagedItems = new PagedItems<CommissionSplitRulePolicyInfo>()
            {
                TotalItems = 1,
                Items = new List<CommissionSplitRulePolicyInfo>()
                {
                    rule
                }
            };

            var service = new Mock<ICommissionSplitRulePolicyService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            CommissionSplitRulePolicyInfoQueryOptions queryOptions = null;
            service.Setup(c => c.GetCommissionSplitRulePolicyInfoList(It.IsAny<CommissionSplitRulePolicyInfoQueryOptions>()))
                .Callback((CommissionSplitRulePolicyInfoQueryOptions options) => queryOptions = options)
                .ReturnsAsync(pagedItems);

            var controller = new CommissionSplitRulePoliciesController(service.Object, authService.Object);

            var result = await controller.Index("PolicyUserId", "desc", 15, 2, $"PolicyUserId={rule.PolicyUserId}");

            Assert.Equal(Scope.Branch, queryOptions.Scope.Scope);
            Assert.Equal("PolicyUserId", queryOptions.SortOptions.Column);
            Assert.Equal(SortDirection.Descending, queryOptions.SortOptions.Direction);
            Assert.Equal(15, queryOptions.PageOptions.Size);
            Assert.Equal(2, queryOptions.PageOptions.Number);

            Assert.Equal(rule.PolicyUserId, queryOptions.PolicyUserId.Single());

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedItems<CommissionSplitRulePolicyInfo>>(okResult.Value);

            Assert.Same(pagedItems, returnValue);
        }


        [Fact]
        public async Task Get()
        {
            var rule = new CommissionSplitRulePolicy()
            {
                Id = Guid.NewGuid(),
                PolicyId = Guid.NewGuid(),
                CommissionSplitRuleId = Guid.NewGuid()
            };

            var service = new Mock<ICommissionSplitRulePolicyService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            service.Setup(c => c.GetCommissionSplitRulePolicy(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == rule.Id.Value)))
                .ReturnsAsync(rule);

            var controller = new CommissionSplitRulePoliciesController(service.Object, authService.Object);

            var result = await controller.Get(rule.Id.Value);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<CommissionSplitRulePolicy>(okResult.Value);

            Assert.Same(rule, returnValue);
        }


        [Fact]
        public async Task Insert()
        {
            var rule = new CommissionSplitRulePolicy()
            {
                Id = Guid.NewGuid(),
                PolicyId = Guid.NewGuid(),
                CommissionSplitRuleId = Guid.NewGuid()
            };

            var service = new Mock<ICommissionSplitRulePolicyService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            CommissionSplitRulePolicy inserted = null;
            service.Setup(c => c.InsertCommissionSplitRulePolicy(It.IsAny<ScopeOptions>(), It.IsAny<CommissionSplitRulePolicy>()))
                .Callback((ScopeOptions o, CommissionSplitRulePolicy i) =>
                {
                    inserted = i;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new CommissionSplitRulePoliciesController(service.Object, authService.Object);

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
            var rule = new CommissionSplitRulePolicy()
            {
                Id = Guid.NewGuid(),
                PolicyId = Guid.NewGuid(),
                CommissionSplitRuleId = Guid.NewGuid()
            };

            var service = new Mock<ICommissionSplitRulePolicyService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            CommissionSplitRulePolicy updated = null;
            service.Setup(c => c.UpdateCommissionSplitRulePolicy(It.IsAny<ScopeOptions>(), It.IsAny<CommissionSplitRulePolicy>()))
                .Callback((ScopeOptions o, CommissionSplitRulePolicy i) =>
                {
                    updated = i;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new CommissionSplitRulePoliciesController(service.Object, authService.Object);

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

            var service = new Mock<ICommissionSplitRulePolicyService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            Guid deleted = Guid.Empty;

            service.Setup(c => c.DeleteCommissionSplitRulePolicy(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == ruleId)))
                .Callback((ScopeOptions o, Guid d) =>
                {
                    deleted = d;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new CommissionSplitRulePoliciesController(service.Object, authService.Object);

            var actual = await controller.Delete(ruleId);

            Assert.Equal(ruleId, deleted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

    }


}