using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Controllers.Commission.CommissionError;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Newtonsoft.Json;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Commission.Model.CommissionError;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using Xunit;

namespace api.Test.Controllers.Commission
{
    public class CommissionErrorControllerTest
    {
        [Fact]
        public void CommissionErrorModelComposition()
        {
            Assert.Equal(10, typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).PropertyCount());
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).HasProperty("Id"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).HasProperty("CommissionStatementId"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).HasProperty("CommissionStatementYear"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).HasProperty("CommissionStatementMonth"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).HasProperty("PolicyId"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).HasProperty("ClientId"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).HasProperty("CommissionTypeId"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).HasProperty("Data"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).HasProperty("IsFormatValid"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).HasProperty("PolicyTypeCode"));
        }

        [Fact]
        public void CommissionErrorEditModelComposition()
        {
            Assert.Equal(7, typeof(CommissionErrorEdit).PropertyCount());
            Assert.True(typeof(CommissionErrorEdit).HasProperty("Id"));
            Assert.True(typeof(CommissionErrorEdit).HasProperty("CommissionStatementId"));
            Assert.True(typeof(CommissionErrorEdit).HasProperty("PolicyId"));
            Assert.True(typeof(CommissionErrorEdit).HasProperty("ClientId"));
            Assert.True(typeof(CommissionErrorEdit).HasProperty("CommissionTypeId"));
            Assert.True(typeof(CommissionErrorEdit).HasProperty("Data"));
            Assert.True(typeof(CommissionErrorEdit).HasProperty("IsFormatValid"));
        }

        [Fact]
        public async Task Index()
        {
            var error = new OneAdvisor.Model.Commission.Model.CommissionError.CommissionError()
            {
                Id = Guid.NewGuid(),
                CommissionStatementId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                IsFormatValid = true,
                ClientId = Guid.NewGuid(),
                PolicyId = Guid.NewGuid(),
                Data = new OneAdvisor.Model.Commission.Model.ImportCommission.ImportCommission()
                {
                    PolicyNumber = "123",
                    AmountIncludingVAT = "50",
                    VAT = "5"
                },
            };

            var errors = new PagedItems<OneAdvisor.Model.Commission.Model.CommissionError.CommissionError>()
            {
                TotalItems = 1,
                Items = new List<OneAdvisor.Model.Commission.Model.CommissionError.CommissionError>()
                {
                    error
                }
            };

            var service = new Mock<ICommissionErrorService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            CommissionErrorQueryOptions options = null;
            service.Setup(c => c.GetErrors(It.IsAny<CommissionErrorQueryOptions>()))
                .Callback((CommissionErrorQueryOptions o) => options = o)
                .ReturnsAsync(errors);

            var controller = new CommissionErrorController(service.Object, authService.Object);

            var result = await controller.Index("commissionTypeId", "desc", 15, 2);

            Assert.Equal(Scope.Branch, options.Scope.Scope);
            Assert.Equal(15, options.PageOptions.Size);
            Assert.Equal(2, options.PageOptions.Number);
            Assert.Equal("commissionTypeId", options.SortOptions.Column);
            Assert.Equal(SortDirection.Descending, options.SortOptions.Direction);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedItems<OneAdvisor.Model.Commission.Model.CommissionError.CommissionError>>(okResult.Value);

            Assert.Same(errors, returnValue);
        }

        [Fact]
        public async Task Next()
        {
            var error = new CommissionErrorEdit()
            {
                Id = Guid.NewGuid(),
                CommissionStatementId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                IsFormatValid = true,
                ClientId = Guid.NewGuid(),
                PolicyId = Guid.NewGuid(),
                Data = new OneAdvisor.Model.Commission.Model.ImportCommission.ImportCommission()
                {
                    PolicyNumber = "123",
                    AmountIncludingVAT = "50",
                    VAT = "5"
                },
            };

            var service = new Mock<ICommissionErrorService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            ScopeOptions options = null;
            service.Setup(c => c.GetNextError(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == error.CommissionStatementId), It.Is<bool>(i => i == true)))
                .Callback((ScopeOptions scopeOptions, Guid a, bool b) => options = scopeOptions)
                .ReturnsAsync(error);

            var controller = new CommissionErrorController(service.Object, authService.Object);

            var result = await controller.Next(error.CommissionStatementId, true);

            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<CommissionErrorEdit>(okResult.Value);

            Assert.Same(error, returnValue);
        }

        [Fact]
        public async Task Get()
        {
            var error = new CommissionErrorEdit()
            {
                Id = Guid.NewGuid(),
                CommissionStatementId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                IsFormatValid = true,
                ClientId = Guid.NewGuid(),
                PolicyId = Guid.NewGuid(),
                Data = new OneAdvisor.Model.Commission.Model.ImportCommission.ImportCommission()
                {
                    PolicyNumber = "123",
                    AmountIncludingVAT = "50",
                    VAT = "5"
                },
            };

            var service = new Mock<ICommissionErrorService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            ScopeOptions options = null;
            service.Setup(c => c.GetError(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == error.Id)))
                .Callback((ScopeOptions scopeOptions, Guid a) => options = scopeOptions)
                .ReturnsAsync(error);

            var controller = new CommissionErrorController(service.Object, authService.Object);

            var result = await controller.Get(error.Id);

            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<CommissionErrorEdit>(okResult.Value);

            Assert.Same(error, returnValue);
        }

        [Fact]
        public async Task ResolveFormatError()
        {
            var error = new CommissionErrorEdit()
            {
                Id = Guid.NewGuid(),
                CommissionStatementId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                IsFormatValid = true,
                ClientId = Guid.NewGuid(),
                PolicyId = Guid.NewGuid(),
                Data = new OneAdvisor.Model.Commission.Model.ImportCommission.ImportCommission()
                {
                    PolicyNumber = "123",
                    AmountIncludingVAT = "50",
                    VAT = "5"
                },
            };

            var service = new Mock<ICommissionErrorService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            CommissionErrorEdit resolved = null;

            service.Setup(c => c.ResolveFormatError(It.IsAny<ScopeOptions>(), It.Is<CommissionErrorEdit>(e => e == error)))
                .Callback((ScopeOptions o, CommissionErrorEdit e) =>
                {
                    resolved = e;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new CommissionErrorController(service.Object, authService.Object);

            var actual = await controller.ResolveFormatError(error);

            Assert.Equal(Scope.Branch, options.Scope);
            Assert.Same(error, resolved);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task ResolveMappingError()
        {
            var error = new CommissionErrorEdit()
            {
                Id = Guid.NewGuid(),
                CommissionStatementId = Guid.NewGuid(),
                CommissionTypeId = Guid.NewGuid(),
                IsFormatValid = true,
                ClientId = Guid.NewGuid(),
                PolicyId = Guid.NewGuid(),
                Data = new OneAdvisor.Model.Commission.Model.ImportCommission.ImportCommission()
                {
                    PolicyNumber = "123",
                    AmountIncludingVAT = "50",
                    VAT = "5"
                },
            };

            var service = new Mock<ICommissionErrorService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true,
                Tag = new CommissionEdit()
                {
                    CommissionStatementId = error.CommissionStatementId,
                    PolicyId = error.PolicyId
                }
            };

            ScopeOptions options1 = null;
            CommissionErrorEdit resolved = null;

            service.Setup(c => c.ResolveMappingError(It.IsAny<ScopeOptions>(), It.Is<CommissionErrorEdit>(e => e == error)))
                    .Callback((ScopeOptions o, CommissionErrorEdit e) =>
                    {
                        resolved = e;
                        options1 = o;
                    })
                    .ReturnsAsync(result);

            ScopeOptions options2 = null;
            service.Setup(c => c.AutoResolveMappingErrors(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == error.CommissionStatementId), It.Is<Guid>(m => m == error.PolicyId)))
                    .Callback((ScopeOptions o, Guid a, Guid b) =>
                    {
                        options2 = o;
                    })
                    .Returns(() => Task.CompletedTask);

            var controller = new CommissionErrorController(service.Object, authService.Object);

            var actual = await controller.ResolveMappingError(error);

            Assert.Equal(Scope.Branch, options1.Scope);
            Assert.Equal(Scope.Branch, options2.Scope);
            Assert.Same(error, resolved);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }

        [Fact]
        public async Task Delete()
        {
            var commissionErrorId = Guid.NewGuid();

            var service = new Mock<ICommissionErrorService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            Guid deleted = Guid.Empty;

            service.Setup(c => c.DeleteError(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == commissionErrorId)))
                .Callback((ScopeOptions o, Guid d) =>
                {
                    deleted = d;
                    options = o;
                })
                .ReturnsAsync(result);

            var controller = new CommissionErrorController(service.Object, authService.Object);

            var actual = await controller.Delete(commissionErrorId);

            Assert.Equal(commissionErrorId, deleted);
            Assert.Equal(Scope.Branch, options.Scope);

            var okResult = Assert.IsType<OkObjectResult>(actual);
            var returnValue = Assert.IsType<Result>(okResult.Value);

            Assert.Same(result, returnValue);
        }
    }
}