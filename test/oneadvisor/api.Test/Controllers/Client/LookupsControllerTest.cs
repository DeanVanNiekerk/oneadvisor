using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Controllers.Client.Contacts;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Model.Client.Model.Lookup;
using OneAdvisor.Model.Common;
using Xunit;

namespace api.Test.Controllers.Client
{
    public class LookupsControllerTest
    {
        [Fact]
        public void PolicyTypeModelComposition()
        {
            Assert.Equal(3, typeof(PolicyType).PropertyCount());
            Assert.True(typeof(PolicyType).HasProperty("Id"));
            Assert.True(typeof(PolicyType).HasProperty("Name"));
            Assert.True(typeof(PolicyType).HasProperty("Code"));
        }

        [Fact]
        public void PolicyProductTypeModelComposition()
        {
            Assert.Equal(5, typeof(PolicyProductType).PropertyCount());
            Assert.True(typeof(PolicyProductType).HasProperty("Id"));
            Assert.True(typeof(PolicyProductType).HasProperty("PolicyTypeId"));
            Assert.True(typeof(PolicyProductType).HasProperty("Name"));
            Assert.True(typeof(PolicyProductType).HasProperty("Code"));
            Assert.True(typeof(PolicyProductType).HasProperty("PolicyTypeCharacteristics"));
        }

        [Fact]
        public void PolicyProductModelComposition()
        {
            Assert.Equal(5, typeof(PolicyProduct).PropertyCount());
            Assert.True(typeof(PolicyProduct).HasProperty("Id"));
            Assert.True(typeof(PolicyProduct).HasProperty("PolicyProductTypeId"));
            Assert.True(typeof(PolicyProduct).HasProperty("CompanyId"));
            Assert.True(typeof(PolicyProduct).HasProperty("Name"));
            Assert.True(typeof(PolicyProduct).HasProperty("Code"));
        }

        [Fact]
        public void ClientTypeModelComposition()
        {
            Assert.Equal(3, typeof(ClientType).PropertyCount());
            Assert.True(typeof(ClientType).HasProperty("Id"));
            Assert.True(typeof(ClientType).HasProperty("Name"));
            Assert.True(typeof(ClientType).HasProperty("Code"));
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
        public void PolicyTypeCharacteristicModelComposition()
        {
            Assert.Equal(4, typeof(PolicyTypeCharacteristic).PropertyCount());
            Assert.True(typeof(PolicyTypeCharacteristic).HasProperty("Id"));
            Assert.True(typeof(PolicyTypeCharacteristic).HasProperty("Name"));
            Assert.True(typeof(PolicyTypeCharacteristic).HasProperty("DisplayOrder"));
            Assert.True(typeof(PolicyTypeCharacteristic).HasProperty("PolicyTypeId"));
        }

        [Fact]
        public void LookupsModelComposition()
        {
            Assert.Equal(7, typeof(api.Controllers.Client.Lookups.Dto.Lookups).PropertyCount());

            Assert.True(typeof(api.Controllers.Client.Lookups.Dto.Lookups).HasProperty("PolicyTypes"));
            Assert.True(typeof(api.Controllers.Client.Lookups.Dto.Lookups).HasProperty("PolicyProductTypes"));
            Assert.True(typeof(api.Controllers.Client.Lookups.Dto.Lookups).HasProperty("PolicyProducts"));
            Assert.True(typeof(api.Controllers.Client.Lookups.Dto.Lookups).HasProperty("ClientTypes"));
            Assert.True(typeof(api.Controllers.Client.Lookups.Dto.Lookups).HasProperty("ContactTypes"));
            Assert.True(typeof(api.Controllers.Client.Lookups.Dto.Lookups).HasProperty("MarritalStatus"));
            Assert.True(typeof(api.Controllers.Client.Lookups.Dto.Lookups).HasProperty("PolicyTypeCharacteristics"));
        }

        [Fact]
        public async Task All()
        {
            var policyType = new PolicyType() { Id = Guid.NewGuid(), Name = "Name4", Code = "Code4" };
            var policyProductType = new PolicyProductType() { Id = Guid.NewGuid(), Name = "Name4", Code = "Code4", PolicyTypeId = Guid.NewGuid() };
            var policyProduct = new PolicyProduct() { Id = Guid.NewGuid(), Name = "Name4", Code = "Code4", PolicyProductTypeId = Guid.NewGuid(), CompanyId = Guid.NewGuid() };
            var contactType = new ContactType() { Id = Guid.NewGuid(), Name = "Name5" };
            var marritalStatus = new MarritalStatus() { Id = Guid.NewGuid(), Name = "Name6" };
            var clientType = new ClientType() { Id = Guid.NewGuid(), Name = "Name8", Code = "Code8" };
            var policyTypeCharacteristic = new PolicyTypeCharacteristic() { Id = Guid.NewGuid(), Name = "Name8", DisplayOrder = 1 };

            var policyTypes = new List<PolicyType>() { policyType };
            var policyProductTypes = new List<PolicyProductType>() { policyProductType };
            var policyProducts = new List<PolicyProduct>() { policyProduct };
            var clientTypes = new List<ClientType>() { clientType };
            var contactTypes = new List<ContactType>() { contactType };
            var marritalStatusList = new List<MarritalStatus>() { marritalStatus };
            var policyTypeCharacteristicList = new List<PolicyTypeCharacteristic>() { policyTypeCharacteristic };

            var service = new Mock<IClientLookupService>();
            service.Setup(c => c.GetPolicyTypes()).ReturnsAsync(policyTypes);
            service.Setup(c => c.GetPolicyProductTypes()).ReturnsAsync(policyProductTypes);
            service.Setup(c => c.GetPolicyProducts()).ReturnsAsync(policyProducts);
            service.Setup(c => c.GetContactTypes()).ReturnsAsync(contactTypes);
            service.Setup(c => c.GetClientTypes()).ReturnsAsync(clientTypes);
            service.Setup(c => c.GetMarritalStatus()).ReturnsAsync(marritalStatusList);
            service.Setup(c => c.GetPolicyTypeCharacteristics()).ReturnsAsync(policyTypeCharacteristicList);

            var controller = new LookupsController(service.Object);

            var result = await controller.All();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<api.Controllers.Client.Lookups.Dto.Lookups>(okResult.Value);

            var all = new api.Controllers.Client.Lookups.Dto.Lookups()
            {
                PolicyTypes = policyTypes,
                PolicyProductTypes = policyProductTypes,
                PolicyProducts = policyProducts,
                ContactTypes = contactTypes,
                MarritalStatus = marritalStatusList,
                PolicyTypeCharacteristics = policyTypeCharacteristicList
            };

            Assert.NotStrictEqual(all, returnValue);
        }

        #region Policy Type Characteristics

        [Fact]
        public async Task PolicyTypeCharacteristics()
        {
            var policyTypeCharacteristic = new PolicyTypeCharacteristic()
            {
                Id = Guid.NewGuid(),
                PolicyTypeId = Guid.NewGuid(),
                Name = "Name1",
                DisplayOrder = 1
            };

            var policyTypeCharacteristics = new List<PolicyTypeCharacteristic>()
            {
                policyTypeCharacteristic
            };

            var service = new Mock<IClientLookupService>();

            service.Setup(c => c.GetPolicyTypeCharacteristics())
                .ReturnsAsync(policyTypeCharacteristics);

            var controller = new LookupsController(service.Object);

            var result = await controller.GetPolicyTypeCharacteristics();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<PolicyTypeCharacteristic>>(okResult.Value);

            Assert.Same(policyTypeCharacteristics, returnValue);
        }

        [Fact]
        public async Task InsertPolicyTypeCharacteristic()
        {
            var policyTypeCharacteristic = new PolicyTypeCharacteristic()
            {
                Id = Guid.NewGuid(),
                PolicyTypeId = Guid.NewGuid(),
                Name = "Name1",
                DisplayOrder = 1
            };

            var service = new Mock<IClientLookupService>();

            var result = new Result()
            {
                Success = true
            };

            PolicyTypeCharacteristic inserted = null;
            service.Setup(c => c.InsertPolicyTypeCharacteristic(It.IsAny<PolicyTypeCharacteristic>()))
                .Callback((PolicyTypeCharacteristic i) =>
                {
                    inserted = i;
                })
                .ReturnsAsync(result);

            var controller = new LookupsController(service.Object);

            var actual = await controller.InsertPolicyTypeCharacteristic(policyTypeCharacteristic);

            Assert.Same(policyTypeCharacteristic, inserted);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task UpdatePolicyTypeCharacteristic()
        {
            var policyTypeCharacteristic = new PolicyTypeCharacteristic()
            {
                Id = Guid.NewGuid(),
                PolicyTypeId = Guid.NewGuid(),
                Name = "Name1",
                DisplayOrder = 1
            };

            var service = new Mock<IClientLookupService>();

            var result = new Result()
            {
                Success = true
            };

            PolicyTypeCharacteristic updated = null;
            service.Setup(c => c.UpdatePolicyTypeCharacteristic(It.IsAny<PolicyTypeCharacteristic>()))
                .Callback((PolicyTypeCharacteristic i) =>
                {
                    updated = i;
                })
                .ReturnsAsync(result);

            var controller = new LookupsController(service.Object);

            var actual = await controller.UpdatePolicyTypeCharacteristic(policyTypeCharacteristic.Id.Value, policyTypeCharacteristic);

            Assert.Same(policyTypeCharacteristic, updated);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        #endregion

        #region Policy Product Types

        [Fact]
        public async Task PolicyProductTypes()
        {
            var policyProductType = new PolicyProductType()
            {
                Id = Guid.NewGuid(),
                PolicyTypeId = Guid.NewGuid(),
                Name = "Name1",
                Code = "Code1"
            };

            var policyProductTypes = new List<PolicyProductType>()
            {
                policyProductType
            };

            var service = new Mock<IClientLookupService>();

            service.Setup(c => c.GetPolicyProductTypes())
                .ReturnsAsync(policyProductTypes);

            var controller = new LookupsController(service.Object);

            var result = await controller.PolicyProductTypes();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<PolicyProductType>>(okResult.Value);

            Assert.Same(policyProductTypes, returnValue);
        }

        [Fact]
        public async Task InsertPolicyProductType()
        {
            var policyProductType = new PolicyProductType()
            {
                Id = Guid.NewGuid(),
                PolicyTypeId = Guid.NewGuid(),
                Name = "Name1",
                Code = "Code1"
            };

            var service = new Mock<IClientLookupService>();

            var result = new Result()
            {
                Success = true
            };

            PolicyProductType inserted = null;
            service.Setup(c => c.InsertPolicyProductType(It.IsAny<PolicyProductType>()))
                .Callback((PolicyProductType i) =>
                {
                    inserted = i;
                })
                .ReturnsAsync(result);

            var controller = new LookupsController(service.Object);

            var actual = await controller.InsertPolicyProductType(policyProductType);

            Assert.Same(policyProductType, inserted);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task UpdatePolicyProductType()
        {
            var policyProductType = new PolicyProductType()
            {
                Id = Guid.NewGuid(),
                PolicyTypeId = Guid.NewGuid(),
                Name = "Name1",
                Code = "Code1"
            };

            var service = new Mock<IClientLookupService>();

            var result = new Result()
            {
                Success = true
            };

            PolicyProductType updated = null;
            service.Setup(c => c.UpdatePolicyProductType(It.IsAny<PolicyProductType>()))
                .Callback((PolicyProductType i) =>
                {
                    updated = i;
                })
                .ReturnsAsync(result);

            var controller = new LookupsController(service.Object);

            var actual = await controller.UpdatePolicyProductType(policyProductType.Id.Value, policyProductType);

            Assert.Same(policyProductType, updated);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        #endregion

        #region Policy Products

        [Fact]
        public async Task PolicyProducts()
        {
            var policyProduct = new PolicyProduct()
            {
                Id = Guid.NewGuid(),
                PolicyProductTypeId = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Name1",
                Code = "Code1"
            };

            var policyProducts = new List<PolicyProduct>()
            {
                policyProduct
            };

            var service = new Mock<IClientLookupService>();

            service.Setup(c => c.GetPolicyProducts())
                .ReturnsAsync(policyProducts);

            var controller = new LookupsController(service.Object);

            var result = await controller.PolicyProducts();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<PolicyProduct>>(okResult.Value);

            Assert.Same(policyProducts, returnValue);
        }

        [Fact]
        public async Task InsertPolicyProduct()
        {
            var policyProduct = new PolicyProduct()
            {
                Id = Guid.NewGuid(),
                PolicyProductTypeId = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Name1",
                Code = "Code1"
            };

            var service = new Mock<IClientLookupService>();

            var result = new Result()
            {
                Success = true
            };

            PolicyProduct inserted = null;
            service.Setup(c => c.InsertPolicyProduct(It.IsAny<PolicyProduct>()))
                .Callback((PolicyProduct i) =>
                {
                    inserted = i;
                })
                .ReturnsAsync(result);

            var controller = new LookupsController(service.Object);

            var actual = await controller.InsertPolicyProduct(policyProduct);

            Assert.Same(policyProduct, inserted);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task UpdatePolicyProduct()
        {
            var policyProduct = new PolicyProduct()
            {
                Id = Guid.NewGuid(),
                PolicyProductTypeId = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Name1",
                Code = "Code1"
            };

            var service = new Mock<IClientLookupService>();

            var result = new Result()
            {
                Success = true
            };

            PolicyProduct updated = null;
            service.Setup(c => c.UpdatePolicyProduct(It.IsAny<PolicyProduct>()))
                .Callback((PolicyProduct i) =>
                {
                    updated = i;
                })
                .ReturnsAsync(result);

            var controller = new LookupsController(service.Object);

            var actual = await controller.UpdatePolicyProduct(policyProduct.Id.Value, policyProduct);

            Assert.Same(policyProduct, updated);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        #endregion

    }
}