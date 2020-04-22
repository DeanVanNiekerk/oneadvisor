using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Controllers.Client.Merge;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Model.Client.Model.Client;
using OneAdvisor.Model.Client.Model.Client.Merge;
using Xunit;
using OneAdvisor.Model.Client.Model.Policy.Merge;
using OneAdvisor.Model.Client.Model.Policy;

namespace api.Test.Controllers.Client
{
    public class MergeControllerTest
    {
        [Fact]
        public void MergeClientsModelComposition()
        {
            Assert.Equal(2, typeof(MergeClients).PropertyCount());
            Assert.True(typeof(MergeClients).HasProperty("TargetClient"));
            Assert.True(typeof(MergeClients).HasProperty("SourceClientIds"));
        }

        [Fact]
        public void MergePoliciesModelComposition()
        {
            Assert.Equal(2, typeof(MergePolicies).PropertyCount());
            Assert.True(typeof(MergePolicies).HasProperty("TargetPolicy"));
            Assert.True(typeof(MergePolicies).HasProperty("SourcePolicyIds"));
        }

        [Fact]
        public async Task MergeClients()
        {
            var client = new ClientEdit()
            {
                Id = Guid.NewGuid(),
            };
            var merge = new MergeClients()
            {
                TargetClient = client,
                SourceClientIds = new List<Guid>() { Guid.NewGuid(), Guid.NewGuid() }
            };

            var service = new Mock<IClientService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            MergeClients merged = null;

            service.Setup(c => c.MergeClients(It.IsAny<ScopeOptions>(), It.Is<MergeClients>(m => m == merge)))
                .Callback((ScopeOptions o, MergeClients m) =>
                {
                    merged = m;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new MergeController(service.Object, null, authService.Object);

            var actual = await controller.MergeClients(merge);

            Assert.Same(merge, merged);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task MergePolicies()
        {
            var policy = new PolicyEdit()
            {
                Id = Guid.NewGuid(),
            };
            var merge = new MergePolicies()
            {
                TargetPolicy = policy,
                SourcePolicyIds = new List<Guid>() { Guid.NewGuid(), Guid.NewGuid() }
            };

            var service = new Mock<IPolicyService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            MergePolicies merged = null;

            service.Setup(c => c.MergePolicies(It.IsAny<ScopeOptions>(), It.Is<MergePolicies>(m => m == merge)))
                .Callback((ScopeOptions o, MergePolicies m) =>
                {
                    merged = m;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new MergeController(null, service.Object, authService.Object);

            var actual = await controller.MergePolicies(merge);

            Assert.Same(merge, merged);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }
    }
}