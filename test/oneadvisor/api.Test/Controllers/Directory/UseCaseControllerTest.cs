using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Controllers.Directory.UseCases;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.UseCase;
using Xunit;

namespace api.Test.Controllers.Directory
{
    public class UseCaseControllerTest
    {
        [Fact]
        public void UseCaseModelComposition()
        {
            Assert.Equal(3, typeof(UseCase).PropertyCount());
            Assert.True(typeof(UseCase).HasProperty("Id"));
            Assert.True(typeof(UseCase).HasProperty("Name"));
            Assert.True(typeof(UseCase).HasProperty("ApplicationId"));
        }

        [Fact]
        public async Task Index()
        {
            var useCase = new UseCase()
            {
                Id = Guid.NewGuid().ToString(),
                Name = "uc_1",
                ApplicationId = Guid.NewGuid()
            };

            var items = new List<UseCase>()
            {
                useCase
            };

            var service = new Mock<IUseCaseService>();

            service.Setup(c => c.GetUseCases())
                .ReturnsAsync(items);

            var controller = new UseCasesController(service.Object);

            var result = await controller.Index();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<UseCase>>(okResult.Value);

            Assert.Same(items, returnValue);
        }

    }
}