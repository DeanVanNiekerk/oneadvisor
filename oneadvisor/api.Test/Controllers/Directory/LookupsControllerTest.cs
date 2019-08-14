using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Controllers.Directory.Lookups;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Lookup;
using Xunit;

namespace api.Test.Controllers.Directory
{
    public class LookupsControllerTest
    {
        [Fact]
        public void LookupsModelComposition()
        {
            Assert.Equal(2, typeof(api.Controllers.Directory.Lookups.Dto.Lookups).PropertyCount());

            Assert.True(typeof(api.Controllers.Directory.Lookups.Dto.Lookups).HasProperty("Companies"));
            Assert.True(typeof(api.Controllers.Directory.Lookups.Dto.Lookups).HasProperty("UserTypes"));
        }

        [Fact]
        public void CompanyModelComposition()
        {
            Assert.Equal(3, typeof(Company).PropertyCount());
            Assert.True(typeof(Company).HasProperty("Id"));
            Assert.True(typeof(Company).HasProperty("Name"));
            Assert.True(typeof(Company).HasProperty("CommissionPolicyNumberPrefixes"));
        }

        [Fact]
        public void UserTypeModelComposition()
        {
            Assert.Equal(3, typeof(UserType).PropertyCount());
            Assert.True(typeof(UserType).HasProperty("Id"));
            Assert.True(typeof(UserType).HasProperty("Name"));
            Assert.True(typeof(UserType).HasProperty("DisplayOrder"));
        }

        [Fact]
        public async Task All()
        {
            var company = new Company() { Id = Guid.NewGuid(), Name = "Name2" };
            var userType = new UserType() { Id = Guid.NewGuid(), Name = "Name2" };

            var companies = new List<Company>() { company };
            var userTypes = new List<UserType>() { userType };

            var service = new Mock<IDirectoryLookupService>();
            service.Setup(c => c.GetCompanies()).ReturnsAsync(companies);
            service.Setup(c => c.GetUserTypes()).ReturnsAsync(userTypes);

            var controller = new LookupsController(service.Object);

            var result = await controller.All();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<api.Controllers.Directory.Lookups.Dto.Lookups>(okResult.Value);

            var all = new api.Controllers.Directory.Lookups.Dto.Lookups()
            {
                Companies = companies,
                UserTypes = userTypes,
            };

            Assert.NotStrictEqual(all, returnValue);
        }

        #region Companies

        [Fact]
        public async Task Companies()
        {
            var company = new Company()
            {
                Id = Guid.NewGuid(),
                Name = "Name1"
            };

            var companies = new List<Company>()
            {
                company
            };

            var service = new Mock<IDirectoryLookupService>();

            service.Setup(c => c.GetCompanies())
                .ReturnsAsync(companies);

            var controller = new LookupsController(service.Object);

            var result = await controller.Companies();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<Company>>(okResult.Value);

            Assert.Same(companies, returnValue);
        }

        [Fact]
        public async Task InsertCompany()
        {
            var company = new Company()
            {
                Id = Guid.NewGuid(),
                Name = "Name1"
            };

            var service = new Mock<IDirectoryLookupService>();

            var result = new Result()
            {
                Success = true
            };

            Company inserted = null;
            service.Setup(c => c.InsertCompany(It.IsAny<Company>()))
                .Callback((Company i) =>
                {
                    inserted = i;
                })
                .ReturnsAsync(result);

            var controller = new LookupsController(service.Object);

            var actual = await controller.InsertCompany(company);

            Assert.Same(company, inserted);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task UpdateCompany()
        {
            var company = new Company()
            {
                Id = Guid.NewGuid(),
                Name = "Name1"
            };

            var service = new Mock<IDirectoryLookupService>();

            var result = new Result()
            {
                Success = true
            };

            Company updated = null;
            service.Setup(c => c.UpdateCompany(It.IsAny<Company>()))
                .Callback((Company i) =>
                {
                    updated = i;
                })
                .ReturnsAsync(result);

            var controller = new LookupsController(service.Object);

            var actual = await controller.UpdateCompany(company.Id.Value, company);

            Assert.Same(company, updated);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        #endregion
    }
}