using System;
using System.Threading.Tasks;
using api.Controllers.Client.Import;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Model.Client.Model.ImportClient;
using Xunit;

namespace api.Test.Controllers.Client
{
    public class ImportControllerTest
    {
        [Fact]
        public void ImportClientModelComposition()
        {
            Assert.Equal(14, typeof(ImportClient).PropertyCount());
            Assert.True(typeof(ImportClient).HasProperty("IdNumber"));
            Assert.True(typeof(ImportClient).HasProperty("FirstName"));
            Assert.True(typeof(ImportClient).HasProperty("LastName"));
            Assert.True(typeof(ImportClient).HasProperty("Email"));
            Assert.True(typeof(ImportClient).HasProperty("Cellphone"));
            Assert.True(typeof(ImportClient).HasProperty("TaxNumber"));
            Assert.True(typeof(ImportClient).HasProperty("DateOfBirth"));
            Assert.True(typeof(ImportClient).HasProperty("PolicyNumber"));
            Assert.True(typeof(ImportClient).HasProperty("PolicyCompanyId"));
            Assert.True(typeof(ImportClient).HasProperty("PolicyUserFullName"));
            Assert.True(typeof(ImportClient).HasProperty("PolicyPremium"));
            Assert.True(typeof(ImportClient).HasProperty("PolicyTypeCode"));
            Assert.True(typeof(ImportClient).HasProperty("PolicyStartDate"));
            Assert.True(typeof(ImportClient).HasProperty("ClientTypeCode"));
        }

        [Fact]
        public async Task Insert()
        {
            var client = new ImportClient()
            {
                IdNumber = "0",
                FirstName = "1",
                LastName = "2",
                Email = "3",
                Cellphone = "4",
                TaxNumber = "5",
                DateOfBirth = DateTime.Now,
                PolicyNumber = "6",
                PolicyCompanyId = Guid.NewGuid(),
                PolicyUserFullName = "7",
                PolicyPremium = 1,
                PolicyTypeCode = "8",
                PolicyStartDate = DateTime.Now,
                ClientTypeCode = "9",
            };

            var service = new Mock<IClientImportService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            ImportClient inserted = null;
            service.Setup(c => c.ImportClient(It.IsAny<ScopeOptions>(), It.Is<ImportClient>(m => m == client)))
                .Callback((ScopeOptions o, ImportClient i) =>
                {
                    inserted = i;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new ImportController(service.Object, authService.Object);

            var actual = await controller.Import(client);

            Assert.Same(client, inserted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }
    }
}