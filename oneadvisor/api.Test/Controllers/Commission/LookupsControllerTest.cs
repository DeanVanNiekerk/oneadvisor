using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Controllers.Commission.Lookups;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Lookup;
using OneAdvisor.Model.Common;
using Xunit;

namespace api.Test.Controllers.Commission
{
    public class LookupsControllerTest
    {
        [Fact]
        public void CommissionEarningsTypeModelComposition()
        {
            Assert.Equal(2, typeof(CommissionEarningsType).PropertyCount());
            Assert.True(typeof(CommissionEarningsType).HasProperty("Id"));
            Assert.True(typeof(CommissionEarningsType).HasProperty("Name"));
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
        public void LookupsModelComposition()
        {
            Assert.Equal(3, typeof(api.Controllers.Commission.Lookups.Dto.Lookups).PropertyCount());

            Assert.True(typeof(api.Controllers.Commission.Lookups.Dto.Lookups).HasProperty("CommissionTypes"));
            Assert.True(typeof(api.Controllers.Commission.Lookups.Dto.Lookups).HasProperty("CommissionEarningsTypes"));
            Assert.True(typeof(api.Controllers.Commission.Lookups.Dto.Lookups).HasProperty("CommissionStatementTemplateFieldNames"));
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
            var commissionEarningsType = new CommissionEarningsType() { Id = Guid.NewGuid(), Name = "Name3" };
            var commissionStatementTemplateFieldName = new CommissionStatementTemplateFieldName() { Id = Guid.NewGuid().ToString(), Name = "Name7" };

            var commissionTypes = new List<CommissionType>() { commissionType };
            var commissionEarningsTypes = new List<CommissionEarningsType>() { commissionEarningsType };
            var commissionStatementTemplateFieldNames = new List<CommissionStatementTemplateFieldName>() { commissionStatementTemplateFieldName };

            var service = new Mock<ICommissionLookupService>();
            service.Setup(c => c.GetCommissionTypes()).ReturnsAsync(commissionTypes);
            service.Setup(c => c.GetCommissionEarningsTypes()).ReturnsAsync(commissionEarningsTypes);
            service.Setup(c => c.GetCommissionStatementTemplateFieldNames()).Returns(commissionStatementTemplateFieldNames);

            var controller = new LookupsController(service.Object);

            var result = await controller.All();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<api.Controllers.Commission.Lookups.Dto.Lookups>(okResult.Value);

            var all = new api.Controllers.Commission.Lookups.Dto.Lookups()
            {
                CommissionTypes = commissionTypes,
                CommissionEarningsTypes = commissionEarningsTypes,
                CommissionStatementTemplateFieldNames = commissionStatementTemplateFieldNames,
            };

            Assert.NotStrictEqual(all, returnValue);
        }

        #region Commission Types

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

            var service = new Mock<ICommissionLookupService>();

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

            var service = new Mock<ICommissionLookupService>();

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

            var service = new Mock<ICommissionLookupService>();

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

        #endregion
    }
}