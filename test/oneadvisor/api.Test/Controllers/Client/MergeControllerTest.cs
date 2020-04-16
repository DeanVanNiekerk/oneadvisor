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

namespace api.Test.Controllers.Client
{
    public class MergeControllerTest
    {
        [Fact]
        public void ClientEditModelComposition()
        {
            Assert.Equal(2, typeof(MergeClients).PropertyCount());
            Assert.True(typeof(MergeClients).HasProperty("TargetClient"));
            Assert.True(typeof(MergeClients).HasProperty("SourceClientIds"));
        }

        [Fact]
        public async Task Merge()
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

            var controller = new MergeController(service.Object, authService.Object);

            var actual = await controller.Merge(merge);

            Assert.Same(merge, merged);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }
    }
}