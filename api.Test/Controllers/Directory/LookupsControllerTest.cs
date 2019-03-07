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
            Assert.Equal(7, typeof(api.Controllers.Directory.Lookups.Dto.Lookups).PropertyCount());
            Assert.True(typeof(api.Controllers.Directory.Lookups.Dto.Lookups).HasProperty("CommissionTypes"));
            Assert.True(typeof(api.Controllers.Directory.Lookups.Dto.Lookups).HasProperty("Companies"));
            Assert.True(typeof(api.Controllers.Directory.Lookups.Dto.Lookups).HasProperty("CommissionEarningsTypes"));
            Assert.True(typeof(api.Controllers.Directory.Lookups.Dto.Lookups).HasProperty("PolicyTypes"));
            Assert.True(typeof(api.Controllers.Directory.Lookups.Dto.Lookups).HasProperty("ContactTypes"));
            Assert.True(typeof(api.Controllers.Directory.Lookups.Dto.Lookups).HasProperty("MarritalStatus"));
            Assert.True(typeof(api.Controllers.Directory.Lookups.Dto.Lookups).HasProperty("CommissionStatementTemplateFieldNames"));
        }

        [Fact]
        public void CompanyModelComposition()
        {
            Assert.Equal(2, typeof(Company).PropertyCount());
            Assert.True(typeof(Company).HasProperty("Id"));
            Assert.True(typeof(Company).HasProperty("Name"));
        }

        [Fact]
        public void CommissionEarningsTypeModelComposition()
        {
            Assert.Equal(2, typeof(CommissionEarningsType).PropertyCount());
            Assert.True(typeof(CommissionEarningsType).HasProperty("Id"));
            Assert.True(typeof(CommissionEarningsType).HasProperty("Name"));
        }

        [Fact]
        public void PolicyTypeModelComposition()
        {
            Assert.Equal(2, typeof(PolicyType).PropertyCount());
            Assert.True(typeof(PolicyType).HasProperty("Id"));
            Assert.True(typeof(PolicyType).HasProperty("Name"));
        }

        [Fact]
        public void ContactTypeModelComposition()
        {
            Assert.Equal(2, typeof(ContactType).PropertyCount());
            Assert.True(typeof(ContactType).HasProperty("Id"));
            Assert.True(typeof(ContactType).HasProperty("Name"));
        }

        [Fact]
        public void MarritalStatusModelComposition()
        {
            Assert.Equal(2, typeof(MarritalStatus).PropertyCount());
            Assert.True(typeof(MarritalStatus).HasProperty("Id"));
            Assert.True(typeof(MarritalStatus).HasProperty("Name"));
        }

        [Fact]
        public void CommissionStatementTemplateFieldNameModelComposition()
        {
            Assert.Equal(2, typeof(CommissionStatementTemplateFieldName).PropertyCount());
            Assert.True(typeof(CommissionStatementTemplateFieldName).HasProperty("Id"));
            Assert.True(typeof(CommissionStatementTemplateFieldName).HasProperty("Name"));
        }

        [Fact]
        public void CommissionTypeModelComposition()
        {
            Assert.Equal(5, typeof(CommissionType).PropertyCount());
            Assert.True(typeof(CommissionType).HasProperty("Id"));
            Assert.True(typeof(CommissionType).HasProperty("Name"));
            Assert.True(typeof(CommissionType).HasProperty("Code"));
            Assert.True(typeof(CommissionType).HasProperty("PolicyTypeId"));
            Assert.True(typeof(CommissionType).HasProperty("CommissionEarningsTypeId"));
        }

        [Fact]
        public async Task All()
        {
            var commissionType = new CommissionType()
            {
                Id = Guid.NewGuid(),
                Name = "Name1",
                Code = "Code1",
                PolicyTypeId = Guid.NewGuid(),
                CommissionEarningsTypeId = Guid.NewGuid()
            };
            var company = new Company() { Id = Guid.NewGuid(), Name = "Name2" };
            var commissionEarningsType = new CommissionEarningsType() { Id = Guid.NewGuid(), Name = "Name3" };
            var policyType = new PolicyType() { Id = Guid.NewGuid(), Name = "Name4" };
            var contactType = new ContactType() { Id = Guid.NewGuid(), Name = "Name5" };
            var marritalStatus = new MarritalStatus() { Id = Guid.NewGuid(), Name = "Name6" };
            var commissionStatementTemplateFieldName = new CommissionStatementTemplateFieldName() { Id = Guid.NewGuid().ToString(), Name = "Name7" };

            var commissionTypes = new List<CommissionType>() { commissionType };
            var companies = new List<Company>() { company };
            var commissionEarningsTypes = new List<CommissionEarningsType>() { commissionEarningsType };
            var policyTypes = new List<PolicyType>() { policyType };
            var contactTypes = new List<ContactType>() { contactType };
            var marritalStatusList = new List<MarritalStatus>() { marritalStatus };
            var commissionStatementTemplateFieldNames = new List<CommissionStatementTemplateFieldName>() { commissionStatementTemplateFieldName };

            var service = new Mock<ILookupService>();

            service.Setup(c => c.GetCommissionTypes()).ReturnsAsync(commissionTypes);
            service.Setup(c => c.GetCompanies()).ReturnsAsync(companies);
            service.Setup(c => c.GetCommissionEarningsTypes()).ReturnsAsync(commissionEarningsTypes);
            service.Setup(c => c.GetPolicyTypes()).ReturnsAsync(policyTypes);
            service.Setup(c => c.GetContactTypes()).ReturnsAsync(contactTypes);
            service.Setup(c => c.GetMarritalStatus()).ReturnsAsync(marritalStatusList);
            service.Setup(c => c.GetCommissionStatementTemplateFieldNames()).Returns(commissionStatementTemplateFieldNames);

            var controller = new LookupsController(service.Object);

            var result = await controller.All();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<api.Controllers.Directory.Lookups.Dto.Lookups>(okResult.Value);

            var all = new api.Controllers.Directory.Lookups.Dto.Lookups()
            {
                CommissionTypes = commissionTypes,
                Companies = companies,
                CommissionEarningsTypes = commissionEarningsTypes,
                PolicyTypes = policyTypes,
                ContactTypes = contactTypes,
                MarritalStatus = marritalStatusList,
                CommissionStatementTemplateFieldNames = commissionStatementTemplateFieldNames
            };

            Assert.NotStrictEqual(all, returnValue);
        }

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

            var service = new Mock<ILookupService>();

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

            var service = new Mock<ILookupService>();

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

            var service = new Mock<ILookupService>();

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

        [Fact]
        public async Task GetCommissionTypes()
        {
            var type = new CommissionType()
            {
                Id = Guid.NewGuid(),
                Name = "Name1",
                Code = "Code1",
                PolicyTypeId = Guid.NewGuid(),
                CommissionEarningsTypeId = Guid.NewGuid()
            };

            var types = new List<CommissionType>()
            {
                type
            };

            var service = new Mock<ILookupService>();

            service.Setup(c => c.GetCommissionTypes())
                .ReturnsAsync(types);

            var controller = new LookupsController(service.Object);

            var result = await controller.CommissionTypes();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<CommissionType>>(okResult.Value);

            Assert.Same(types, returnValue);
        }

        [Fact]
        public async Task InsertCommissionType()
        {
            var type = new CommissionType()
            {
                Id = Guid.NewGuid(),
                Name = "Name1",
                Code = "Code1",
                PolicyTypeId = Guid.NewGuid(),
                CommissionEarningsTypeId = Guid.NewGuid()
            };

            var service = new Mock<ILookupService>();

            var result = new Result()
            {
                Success = true
            };

            CommissionType inserted = null;
            service.Setup(c => c.InsertCommissionType(It.IsAny<CommissionType>()))
                .Callback((CommissionType i) =>
                {
                    inserted = i;
                })
                .ReturnsAsync(result);

            var controller = new LookupsController(service.Object);

            var actual = await controller.InsertCommissionType(type);

            Assert.Same(type, inserted);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task UpdateCommissionType()
        {
            var type = new CommissionType()
            {
                Id = Guid.NewGuid(),
                Name = "Name1",
                Code = "Code1",
                PolicyTypeId = Guid.NewGuid(),
                CommissionEarningsTypeId = Guid.NewGuid()
            };

            var service = new Mock<ILookupService>();

            var result = new Result()
            {
                Success = true
            };

            CommissionType updated = null;
            service.Setup(c => c.UpdateCommissionType(It.IsAny<CommissionType>()))
                .Callback((CommissionType i) =>
                {
                    updated = i;
                })
                .ReturnsAsync(result);

            var controller = new LookupsController(service.Object);

            var actual = await controller.UpdateCommissionType(type.Id.Value, type);

            Assert.Same(type, updated);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }
    }
}