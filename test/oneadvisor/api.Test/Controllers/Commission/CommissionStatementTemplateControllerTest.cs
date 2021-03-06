using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Controllers.Commission.CommissionStatementTemplates;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using OneAdvisor.Model.Common;
using Xunit;

namespace api.Test.Controllers.Commission
{
    public class CommissionStatementTemplateControllerTest
    {
        [Fact]
        public void CommissionStatementTemplateModelComposition()
        {
            Assert.Equal(6, typeof(CommissionStatementTemplate).PropertyCount());
            Assert.True(typeof(CommissionStatementTemplate).HasProperty("Id"));
            Assert.True(typeof(CommissionStatementTemplate).HasProperty("CompanyId"));
            Assert.True(typeof(CommissionStatementTemplate).HasProperty("Name"));
            Assert.True(typeof(CommissionStatementTemplate).HasProperty("StartDate"));
            Assert.True(typeof(CommissionStatementTemplate).HasProperty("EndDate"));
            Assert.True(typeof(CommissionStatementTemplate).HasProperty("BrokerSpecific"));
        }

        [Fact]
        public void CommissionStatementTemplateEditModelComposition()
        {
            Assert.Equal(7, typeof(CommissionStatementTemplateEdit).PropertyCount());
            Assert.True(typeof(CommissionStatementTemplateEdit).HasProperty("Id"));
            Assert.True(typeof(CommissionStatementTemplateEdit).HasProperty("CompanyId"));
            Assert.True(typeof(CommissionStatementTemplateEdit).HasProperty("Name"));
            Assert.True(typeof(CommissionStatementTemplateEdit).HasProperty("Config"));
            Assert.True(typeof(CommissionStatementTemplateEdit).HasProperty("StartDate"));
            Assert.True(typeof(CommissionStatementTemplateEdit).HasProperty("EndDate"));
            Assert.True(typeof(CommissionStatementTemplateEdit).HasProperty("BrokerSpecific"));
        }

        [Fact]
        public async Task Index()
        {
            var template = new CommissionStatementTemplate()
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 1"
            };

            var pagedItems = new PagedItems<CommissionStatementTemplate>()
            {
                TotalItems = 1,
                Items = new List<CommissionStatementTemplate>()
                {
                    template
                }
            };

            var service = new Mock<ICommissionStatementTemplateService>();

            CommissionStatementTemplateQueryOptions queryOptions = null;
            service.Setup(c => c.GetTemplates(It.IsAny<CommissionStatementTemplateQueryOptions>()))
               .Callback((CommissionStatementTemplateQueryOptions options) => queryOptions = options)
               .ReturnsAsync(pagedItems);

            var controller = new CommissionStatementTemplateController(service.Object);

            var result = await controller.Index("Name", "desc", 15, 2, $"CompanyId={template.CompanyId}");

            Assert.Equal("Name", queryOptions.SortOptions.Column);
            Assert.Equal(SortDirection.Descending, queryOptions.SortOptions.Direction);
            Assert.Equal(15, queryOptions.PageOptions.Size);
            Assert.Equal(2, queryOptions.PageOptions.Number);

            Assert.Equal(template.CompanyId, queryOptions.CompanyId.Single());

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedItems<CommissionStatementTemplate>>(okResult.Value);

            Assert.Same(pagedItems, returnValue);
        }

        [Fact]
        public async Task Get()
        {
            var template = new CommissionStatementTemplateEdit()
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 1",
                Config = new Config()
            };

            var service = new Mock<ICommissionStatementTemplateService>();

            service.Setup(c => c.GetTemplate(It.Is<Guid>(m => m == template.Id.Value)))
                .ReturnsAsync(template);

            var controller = new CommissionStatementTemplateController(service.Object);

            var result = await controller.Get(template.Id.Value);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<CommissionStatementTemplateEdit>(okResult.Value);

            Assert.Same(template, returnValue);
        }

        [Fact]
        public async Task GetNotFound()
        {
            var service = new Mock<ICommissionStatementTemplateService>();

            service.Setup(c => c.GetTemplate(It.IsAny<Guid>()))
                .ReturnsAsync((CommissionStatementTemplateEdit)null);

            var controller = new CommissionStatementTemplateController(service.Object);

            var result = await controller.Get(Guid.NewGuid());

            var notFoundResult = Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Insert()
        {
            var template = new CommissionStatementTemplateEdit()
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 1",
                Config = new Config()
            };

            var service = new Mock<ICommissionStatementTemplateService>();

            var result = new Result()
            {
                Success = true
            };

            CommissionStatementTemplateEdit inserted = null;
            service.Setup(c => c.InsertTemplate(It.IsAny<CommissionStatementTemplateEdit>()))
                .Callback((CommissionStatementTemplateEdit i) =>
                {
                    inserted = i;
                })
                .ReturnsAsync(result);

            var controller = new CommissionStatementTemplateController(service.Object);

            var actual = await controller.Insert(template);

            Assert.Same(template, inserted);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Update()
        {
            var template = new CommissionStatementTemplateEdit()
            {
                Id = Guid.NewGuid(),
                CompanyId = Guid.NewGuid(),
                Name = "Template 1",
                Config = new Config()
            };

            var service = new Mock<ICommissionStatementTemplateService>();

            var result = new Result()
            {
                Success = true
            };

            CommissionStatementTemplateEdit updated = null;
            service.Setup(c => c.UpdateTemplate(It.IsAny<CommissionStatementTemplateEdit>()))
                .Callback((CommissionStatementTemplateEdit u) =>
                {
                    updated = u;
                })
                .ReturnsAsync(result);

            var controller = new CommissionStatementTemplateController(service.Object);

            var actual = await controller.Update(template.Id.Value, false, template);

            Assert.Same(template, updated);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }
    }
}