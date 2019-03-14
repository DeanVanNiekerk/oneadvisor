using System;
using System.Threading.Tasks;
using api.Controllers.Member.Import;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Model.Member.Model.ImportMember;
using Xunit;

namespace api.Test.Controllers.Member
{
    public class ImportControllerTest
    {
        [Fact]
        public void ImportMemberModelComposition()
        {
            Assert.Equal(13, typeof(ImportMember).PropertyCount());
            Assert.True(typeof(ImportMember).HasProperty("IdNumber"));
            Assert.True(typeof(ImportMember).HasProperty("FirstName"));
            Assert.True(typeof(ImportMember).HasProperty("LastName"));
            Assert.True(typeof(ImportMember).HasProperty("Email"));
            Assert.True(typeof(ImportMember).HasProperty("Cellphone"));
            Assert.True(typeof(ImportMember).HasProperty("TaxNumber"));
            Assert.True(typeof(ImportMember).HasProperty("DateOfBirth"));
            Assert.True(typeof(ImportMember).HasProperty("PolicyNumber"));
            Assert.True(typeof(ImportMember).HasProperty("PolicyCompanyId"));
            Assert.True(typeof(ImportMember).HasProperty("PolicyUserFullName"));
            Assert.True(typeof(ImportMember).HasProperty("PolicyPremium"));
            Assert.True(typeof(ImportMember).HasProperty("PolicyType"));
            Assert.True(typeof(ImportMember).HasProperty("PolicyStartDate"));
        }

        [Fact]
        public async Task Insert()
        {
            var member = new ImportMember()
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
                PolicyType = "8",
                PolicyStartDate = DateTime.Now,
            };

            var service = new Mock<IMemberImportService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            ImportMember inserted = null;
            service.Setup(c => c.ImportMember(It.IsAny<ScopeOptions>(), It.Is<ImportMember>(m => m == member)))
                .Callback((ScopeOptions o, ImportMember i) =>
                {
                    inserted = i;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new ImportController(service.Object, authService.Object);

            var actual = await controller.Import(member);

            Assert.Same(member, inserted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }
    }
}