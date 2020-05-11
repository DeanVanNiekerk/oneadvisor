using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Controllers.Commission.CommissionStatements;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.CommissionStatement;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Storage.Interface;
using Xunit;

namespace api.Test.Controllers.Commission
{
    public class CommissionStatementControllerTest
    {
        [Fact]
        public void CommissionStatementModelComposition()
        {
            Assert.Equal(12, typeof(CommissionStatement).PropertyCount());
            Assert.True(typeof(CommissionStatement).HasProperty("Id"));
            Assert.True(typeof(CommissionStatement).HasProperty("AmountIncludingVAT"));
            Assert.True(typeof(CommissionStatement).HasProperty("VAT"));
            Assert.True(typeof(CommissionStatement).HasProperty("ActualAmountIncludingVAT"));
            Assert.True(typeof(CommissionStatement).HasProperty("ActualVAT"));
            Assert.True(typeof(CommissionStatement).HasProperty("CommissionCount"));
            Assert.True(typeof(CommissionStatement).HasProperty("CompanyId"));
            Assert.True(typeof(CommissionStatement).HasProperty("CompanyName"));
            Assert.True(typeof(CommissionStatement).HasProperty("Date"));
            Assert.True(typeof(CommissionStatement).HasProperty("MappingErrorCount"));
            Assert.True(typeof(CommissionStatement).HasProperty("Processed"));
            Assert.True(typeof(CommissionStatement).HasProperty("Notes"));
        }

        [Fact]
        public void CommissionStatementEditModelComposition()
        {
            Assert.Equal(7, typeof(CommissionStatementEdit).PropertyCount());
            Assert.True(typeof(CommissionStatementEdit).HasProperty("Id"));
            Assert.True(typeof(CommissionStatementEdit).HasProperty("AmountIncludingVAT"));
            Assert.True(typeof(CommissionStatementEdit).HasProperty("VAT"));
            Assert.True(typeof(CommissionStatementEdit).HasProperty("CompanyId"));
            Assert.True(typeof(CommissionStatementEdit).HasProperty("Date"));
            Assert.True(typeof(CommissionStatementEdit).HasProperty("Processed"));
            Assert.True(typeof(CommissionStatementEdit).HasProperty("Notes"));
        }

        [Fact]
        public void PagedCommissionStatementsModelComposition()
        {
            Assert.Equal(4, typeof(PagedCommissionStatements).PropertyCount());
            Assert.True(typeof(PagedCommissionStatements).HasProperty("TotalItems"));
            Assert.True(typeof(PagedCommissionStatements).HasProperty("SumAmountIncludingVAT"));
            Assert.True(typeof(PagedCommissionStatements).HasProperty("SumVAT"));
            Assert.True(typeof(PagedCommissionStatements).HasProperty("Items"));
        }

        [Fact]
        public async Task Index()
        {
            var statement = new CommissionStatement()
            {
                Id = Guid.NewGuid(),
                AmountIncludingVAT = 350000,
                VAT = 25000,
                ActualAmountIncludingVAT = 300000,
                ActualVAT = 20000,
                CommissionCount = 1000,
                CompanyId = Guid.NewGuid(),
                CompanyName = "Comp 1",
                Date = DateTime.Now,
                MappingErrorCount = 100,
                Processed = true
            };

            var pagedItems = new PagedCommissionStatements()
            {
                TotalItems = 1,
                SumAmountIncludingVAT = 300,
                SumVAT = 400,
                Items = new List<CommissionStatement>()
                {
                    statement
                }
            };

            var service = new Mock<ICommissionStatementService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            CommissionStatementQueryOptions queryOptions = null;
            service.Setup(c => c.GetCommissionStatements(It.IsAny<CommissionStatementQueryOptions>()))
                .Callback((CommissionStatementQueryOptions options) => queryOptions = options)
                .ReturnsAsync(pagedItems);

            var controller = new CommissionStatementsController(service.Object, authService.Object, null);

            var result = await controller.Index("date", "desc", 15, 2, $"commissionStatementId={statement.Id}");

            Assert.Equal(Scope.Branch, queryOptions.Scope.Scope);
            Assert.Equal("date", queryOptions.SortOptions.Column);
            Assert.Equal(SortDirection.Descending, queryOptions.SortOptions.Direction);
            Assert.Equal(15, queryOptions.PageOptions.Size);
            Assert.Equal(2, queryOptions.PageOptions.Number);

            Assert.Equal(statement.Id, queryOptions.CommissionStatementId);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedCommissionStatements>(okResult.Value);

            Assert.Same(pagedItems, returnValue);
        }

        [Fact]
        public async Task Get()
        {
            var statement = new CommissionStatementEdit()
            {
                Id = Guid.NewGuid(),
                AmountIncludingVAT = 350000,
                VAT = 25000,
                CompanyId = Guid.NewGuid(),
                Date = DateTime.Now,
                Processed = true
            };

            var service = new Mock<ICommissionStatementService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            service.Setup(c => c.GetCommissionStatement(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == statement.Id.Value)))
                .ReturnsAsync(statement);

            var controller = new CommissionStatementsController(service.Object, authService.Object, null);

            var result = await controller.Get(statement.Id.Value);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<CommissionStatementEdit>(okResult.Value);

            Assert.Same(statement, returnValue);
        }

        [Fact]
        public async Task GetNotFound()
        {
            var service = new Mock<ICommissionStatementService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            service.Setup(c => c.GetCommissionStatement(It.IsAny<ScopeOptions>(), It.IsAny<Guid>()))
                .ReturnsAsync((CommissionStatementEdit)null);

            var controller = new CommissionStatementsController(service.Object, authService.Object, null);

            var result = await controller.Get(Guid.NewGuid());

            var notFoundResult = Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Insert()
        {
            var statement = new CommissionStatementEdit()
            {
                Id = Guid.NewGuid(),
                AmountIncludingVAT = 350000,
                VAT = 25000,
                CompanyId = Guid.NewGuid(),
                Date = DateTime.Now,
                Processed = true
            };

            var service = new Mock<ICommissionStatementService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            CommissionStatementEdit inserted = null;
            service.Setup(c => c.InsertCommissionStatement(It.IsAny<ScopeOptions>(), It.IsAny<CommissionStatementEdit>()))
                .Callback((ScopeOptions o, CommissionStatementEdit i) =>
                {
                    inserted = i;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new CommissionStatementsController(service.Object, authService.Object, null);

            var actual = await controller.Insert(statement);

            Assert.Same(statement, inserted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Update()
        {
            var statement = new CommissionStatementEdit()
            {
                Id = Guid.NewGuid(),
                AmountIncludingVAT = 350000,
                VAT = 25000,
                CompanyId = Guid.NewGuid(),
                Date = DateTime.Now,
                Processed = true
            };

            var service = new Mock<ICommissionStatementService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            CommissionStatementEdit updated = null;
            service.Setup(c => c.UpdateCommissionStatement(It.IsAny<ScopeOptions>(), It.IsAny<CommissionStatementEdit>()))
                .Callback((ScopeOptions o, CommissionStatementEdit u) =>
                {
                    updated = u;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new CommissionStatementsController(service.Object, authService.Object, null);

            var actual = await controller.Update(statement.Id.Value, statement);

            Assert.Same(statement, updated);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Delete()
        {
            var commissionStatementId = Guid.NewGuid();

            var service = new Mock<ICommissionStatementService>();
            var fileStorageService = new Mock<IFileStorageService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            Guid deleted = Guid.Empty;

            service.Setup(c => c.DeleteCommissions(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == commissionStatementId)))
                .Callback((ScopeOptions o, Guid d) =>
                {
                    deleted = d;
                    options = o;
                })
                .Returns(Task.CompletedTask);

            var controller = new CommissionStatementsController(service.Object, authService.Object, fileStorageService.Object);

            var actual = await controller.DeleteCommissions(commissionStatementId);

            Assert.Equal(commissionStatementId, deleted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.NotStrictEqual(result, returnValue);
        }
    }
}