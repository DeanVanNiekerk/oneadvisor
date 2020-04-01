using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Controllers.Directory.Applications;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Application;
using Xunit;

namespace api.Test.Controllers.Directory
{
    public class ApplicationsControllerTest
    {
        [Fact]
        public void ApplicationModelComposition()
        {
            Assert.Equal(3, typeof(Application).PropertyCount());
            Assert.True(typeof(Application).HasProperty("Id"));
            Assert.True(typeof(Application).HasProperty("Name"));
            Assert.True(typeof(Application).HasProperty("ColourHex"));
        }

        [Fact]
        public async Task Index()
        {
            var app = new Application()
            {
                Id = Guid.NewGuid(),
                Name = "1",
                ColourHex = "#FFFFFF"
            };

            var items = new List<Application>()
            {
                app
            };

            var service = new Mock<IApplicationService>();

            service.Setup(c => c.GetApplications())
                .ReturnsAsync(items);

            var controller = new ApplicationsController(service.Object);

            var result = await controller.Index();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<Application>>(okResult.Value);

            Assert.Same(items, returnValue);
        }

    }
}