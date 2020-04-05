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
            Assert.Equal(5, typeof(api.Controllers.Directory.Lookups.Dto.Lookups).PropertyCount());

            Assert.True(typeof(api.Controllers.Directory.Lookups.Dto.Lookups).HasProperty("Companies"));
            Assert.True(typeof(api.Controllers.Directory.Lookups.Dto.Lookups).HasProperty("UserTypes"));
            Assert.True(typeof(api.Controllers.Directory.Lookups.Dto.Lookups).HasProperty("AdviceScopes"));
            Assert.True(typeof(api.Controllers.Directory.Lookups.Dto.Lookups).HasProperty("AdviceServices"));
            Assert.True(typeof(api.Controllers.Directory.Lookups.Dto.Lookups).HasProperty("LicenseCategories"));
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
        public void AdviceScopeModelComposition()
        {
            Assert.Equal(2, typeof(AdviceScope).PropertyCount());
            Assert.True(typeof(AdviceScope).HasProperty("Id"));
            Assert.True(typeof(AdviceScope).HasProperty("Name"));
        }

        [Fact]
        public void AdviceServiceModelComposition()
        {
            Assert.Equal(2, typeof(AdviceService).PropertyCount());
            Assert.True(typeof(AdviceService).HasProperty("Id"));
            Assert.True(typeof(AdviceService).HasProperty("Name"));
        }

        [Fact]
        public void LicenseCategoryModelComposition()
        {
            Assert.Equal(3, typeof(LicenseCategory).PropertyCount());
            Assert.True(typeof(LicenseCategory).HasProperty("Id"));
            Assert.True(typeof(LicenseCategory).HasProperty("Name"));
            Assert.True(typeof(LicenseCategory).HasProperty("Code"));
        }

        [Fact]
        public async Task All()
        {
            var company = new Company() { Id = Guid.NewGuid(), Name = "Name2" };
            var userType = new UserType() { Id = Guid.NewGuid(), Name = "Name2" };
            var adviceScope = new AdviceScope() { Id = Guid.NewGuid(), Name = "Name2" };
            var adviceService = new AdviceService() { Id = Guid.NewGuid(), Name = "Name2" };
            var licenseCategory = new LicenseCategory() { Id = Guid.NewGuid(), Name = "Name2" };

            var companies = new List<Company>() { company };
            var userTypes = new List<UserType>() { userType };
            var licenseCategories = new List<LicenseCategory>() { licenseCategory };
            var adviceServices = new List<AdviceService>() { adviceService };
            var adviceScopes = new List<AdviceScope>() { adviceScope };

            var service = new Mock<IDirectoryLookupService>();
            service.Setup(c => c.GetCompanies()).ReturnsAsync(companies);
            service.Setup(c => c.GetUserTypes()).ReturnsAsync(userTypes);
            service.Setup(c => c.GetLicenseCategories()).ReturnsAsync(licenseCategories);
            service.Setup(c => c.GetAdviceServices()).ReturnsAsync(adviceServices);
            service.Setup(c => c.GetAdviceScopes()).ReturnsAsync(adviceScopes);

            var controller = new LookupsController(service.Object);

            var result = await controller.All();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<api.Controllers.Directory.Lookups.Dto.Lookups>(okResult.Value);

            var all = new api.Controllers.Directory.Lookups.Dto.Lookups()
            {
                Companies = companies,
                UserTypes = userTypes,
                LicenseCategories = licenseCategories,
                AdviceScopes = adviceScopes,
                AdviceServices = adviceServices,
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

        #region Advice Scope

        [Fact]
        public async Task AdviceScopes()
        {
            var adviceScope = new AdviceScope()
            {
                Id = Guid.NewGuid(),
                Name = "Name1"
            };

            var adviceScopes = new List<AdviceScope>()
            {
                adviceScope
            };

            var service = new Mock<IDirectoryLookupService>();

            service.Setup(c => c.GetAdviceScopes())
                .ReturnsAsync(adviceScopes);

            var controller = new LookupsController(service.Object);

            var result = await controller.AdviceScopes();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<AdviceScope>>(okResult.Value);

            Assert.Same(adviceScopes, returnValue);
        }

        [Fact]
        public async Task InsertAdviceScope()
        {
            var company = new AdviceScope()
            {
                Id = Guid.NewGuid(),
                Name = "Name1"
            };

            var service = new Mock<IDirectoryLookupService>();

            var result = new Result()
            {
                Success = true
            };

            AdviceScope inserted = null;
            service.Setup(c => c.InsertAdviceScope(It.IsAny<AdviceScope>()))
                .Callback((AdviceScope i) =>
                {
                    inserted = i;
                })
                .ReturnsAsync(result);

            var controller = new LookupsController(service.Object);

            var actual = await controller.InsertAdviceScope(company);

            Assert.Same(company, inserted);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task UpdateAdviceScope()
        {
            var adviceScope = new AdviceScope()
            {
                Id = Guid.NewGuid(),
                Name = "Name1"
            };

            var service = new Mock<IDirectoryLookupService>();

            var result = new Result()
            {
                Success = true
            };

            AdviceScope updated = null;
            service.Setup(c => c.UpdateAdviceScope(It.IsAny<AdviceScope>()))
                .Callback((AdviceScope i) =>
                {
                    updated = i;
                })
                .ReturnsAsync(result);

            var controller = new LookupsController(service.Object);

            var actual = await controller.UpdateAdviceScope(adviceScope.Id.Value, adviceScope);

            Assert.Same(adviceScope, updated);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        #endregion

        #region Advice Services

        [Fact]
        public async Task AdviceServices()
        {
            var adviceService = new AdviceService()
            {
                Id = Guid.NewGuid(),
                Name = "Name1"
            };

            var adviceServices = new List<AdviceService>()
            {
                adviceService
            };

            var service = new Mock<IDirectoryLookupService>();

            service.Setup(c => c.GetAdviceServices())
                .ReturnsAsync(adviceServices);

            var controller = new LookupsController(service.Object);

            var result = await controller.AdviceServices();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<AdviceService>>(okResult.Value);

            Assert.Same(adviceServices, returnValue);
        }

        [Fact]
        public async Task InsertAdviceService()
        {
            var adviceService = new AdviceService()
            {
                Id = Guid.NewGuid(),
                Name = "Name1"
            };

            var service = new Mock<IDirectoryLookupService>();

            var result = new Result()
            {
                Success = true
            };

            AdviceService inserted = null;
            service.Setup(c => c.InsertAdviceService(It.IsAny<AdviceService>()))
                .Callback((AdviceService i) =>
                {
                    inserted = i;
                })
                .ReturnsAsync(result);

            var controller = new LookupsController(service.Object);

            var actual = await controller.InsertAdviceService(adviceService);

            Assert.Same(adviceService, inserted);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task UpdateAdviceService()
        {
            var adviceService = new AdviceService()
            {
                Id = Guid.NewGuid(),
                Name = "Name1"
            };

            var service = new Mock<IDirectoryLookupService>();

            var result = new Result()
            {
                Success = true
            };

            AdviceService updated = null;
            service.Setup(c => c.UpdateAdviceService(It.IsAny<AdviceService>()))
                .Callback((AdviceService i) =>
                {
                    updated = i;
                })
                .ReturnsAsync(result);

            var controller = new LookupsController(service.Object);

            var actual = await controller.UpdateAdviceService(adviceService.Id.Value, adviceService);

            Assert.Same(adviceService, updated);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        #endregion

        #region License Categories

        [Fact]
        public async Task LicenseCategories()
        {
            var licenseCategory = new LicenseCategory()
            {
                Id = Guid.NewGuid(),
                Name = "Name1",
                Code = "Code1",
            };

            var licenseCategories = new List<LicenseCategory>()
            {
                licenseCategory
            };

            var service = new Mock<IDirectoryLookupService>();

            service.Setup(c => c.GetLicenseCategories())
                .ReturnsAsync(licenseCategories);

            var controller = new LookupsController(service.Object);

            var result = await controller.LicenseCategories();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<LicenseCategory>>(okResult.Value);

            Assert.Same(licenseCategories, returnValue);
        }

        [Fact]
        public async Task InsertLicenseCategory()
        {
            var licenseCategory = new LicenseCategory()
            {
                Id = Guid.NewGuid(),
                Name = "Name1",
                Code = "Code1"
            };

            var service = new Mock<IDirectoryLookupService>();

            var result = new Result()
            {
                Success = true
            };

            LicenseCategory inserted = null;
            service.Setup(c => c.InsertLicenseCategory(It.IsAny<LicenseCategory>()))
                .Callback((LicenseCategory i) =>
                {
                    inserted = i;
                })
                .ReturnsAsync(result);

            var controller = new LookupsController(service.Object);

            var actual = await controller.InsertLicenseCategory(licenseCategory);

            Assert.Same(licenseCategory, inserted);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task UpdateLicenseCategory()
        {
            var licenseCategory = new LicenseCategory()
            {
                Id = Guid.NewGuid(),
                Name = "Name1",
                Code = "Code1"
            };

            var service = new Mock<IDirectoryLookupService>();

            var result = new Result()
            {
                Success = true
            };

            LicenseCategory updated = null;
            service.Setup(c => c.UpdateLicenseCategory(It.IsAny<LicenseCategory>()))
                .Callback((LicenseCategory i) =>
                {
                    updated = i;
                })
                .ReturnsAsync(result);

            var controller = new LookupsController(service.Object);

            var actual = await controller.UpdateLicenseCategory(licenseCategory.Id.Value, licenseCategory);

            Assert.Same(licenseCategory, updated);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        #endregion
    }
}