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
            Assert.Equal(7, typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).PropertyCount());
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).HasProperty("Id"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).HasProperty("CommissionStatementId"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).HasProperty("PolicyId"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).HasProperty("MemberId"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).HasProperty("CommissionTypeId"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).HasProperty("Data"));
            Assert.True(typeof(OneAdvisor.Model.Commission.Model.CommissionError.CommissionError).HasProperty("IsFormatValid"));
        }

        [Fact]
        public async Task Index()
        {
            var error = new OneAdvisor.Model.Commission.Model.CommissionError.CommissionError()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                CommissionStatementId = Guid.Parse("d5887153-b373-4275-8eb1-6b7c1e9d57db"),
                CommissionTypeId = Guid.Parse("24b55c80-4624-478f-a73a-647bb77f22d8"),
                IsFormatValid = true,
                MemberId = Guid.Parse("e36c892a-f608-4d24-b29f-d031f4ebf855"),
                PolicyId = Guid.Parse("bb49cd0d-c66d-4c16-858b-0bd6b68df65c"),
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

            var result = await controller.Index(error.CommissionStatementId, "policyNumber", "desc", 15, 2);

            Assert.Equal(Scope.Branch, options.Scope.Scope);
            Assert.Equal(15, options.PageOptions.Size);
            Assert.Equal(2, options.PageOptions.Number);
            Assert.Equal("policyNumber", options.SortOptions.Column);
            Assert.Equal(SortDirection.Descending, options.SortOptions.Direction);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedItems<OneAdvisor.Model.Commission.Model.CommissionError.CommissionError>>(okResult.Value);

            Assert.Same(errors, returnValue);
        }

        [Fact]
        public async Task Next()
        {
            var error = new OneAdvisor.Model.Commission.Model.CommissionError.CommissionError()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                CommissionStatementId = Guid.Parse("d5887153-b373-4275-8eb1-6b7c1e9d57db"),
                CommissionTypeId = Guid.Parse("24b55c80-4624-478f-a73a-647bb77f22d8"),
                IsFormatValid = true,
                MemberId = Guid.Parse("e36c892a-f608-4d24-b29f-d031f4ebf855"),
                PolicyId = Guid.Parse("bb49cd0d-c66d-4c16-858b-0bd6b68df65c"),
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
            var returnValue = Assert.IsType<OneAdvisor.Model.Commission.Model.CommissionError.CommissionError>(okResult.Value);

            Assert.Same(error, returnValue);
        }

        [Fact]
        public async Task Get()
        {
            var error = new OneAdvisor.Model.Commission.Model.CommissionError.CommissionError()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                CommissionStatementId = Guid.Parse("d5887153-b373-4275-8eb1-6b7c1e9d57db"),
                CommissionTypeId = Guid.Parse("24b55c80-4624-478f-a73a-647bb77f22d8"),
                IsFormatValid = true,
                MemberId = Guid.Parse("e36c892a-f608-4d24-b29f-d031f4ebf855"),
                PolicyId = Guid.Parse("bb49cd0d-c66d-4c16-858b-0bd6b68df65c"),
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
            var returnValue = Assert.IsType<OneAdvisor.Model.Commission.Model.CommissionError.CommissionError>(okResult.Value);

            Assert.Same(error, returnValue);
        }

        [Fact]
        public async Task ResolveFormatError()
        {
            var error = new OneAdvisor.Model.Commission.Model.CommissionError.CommissionError()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                CommissionStatementId = Guid.Parse("d5887153-b373-4275-8eb1-6b7c1e9d57db"),
                CommissionTypeId = Guid.Parse("24b55c80-4624-478f-a73a-647bb77f22d8"),
                IsFormatValid = true,
                MemberId = Guid.Parse("e36c892a-f608-4d24-b29f-d031f4ebf855"),
                PolicyId = Guid.Parse("bb49cd0d-c66d-4c16-858b-0bd6b68df65c"),
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
            OneAdvisor.Model.Commission.Model.CommissionError.CommissionError resolved = null;

            service.Setup(c => c.ResolveFormatError(It.IsAny<ScopeOptions>(), It.Is<OneAdvisor.Model.Commission.Model.CommissionError.CommissionError>(e => e == error)))
                .Callback((ScopeOptions o, OneAdvisor.Model.Commission.Model.CommissionError.CommissionError e) =>
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
            var error = new OneAdvisor.Model.Commission.Model.CommissionError.CommissionError()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                CommissionStatementId = Guid.Parse("d5887153-b373-4275-8eb1-6b7c1e9d57db"),
                CommissionTypeId = Guid.Parse("24b55c80-4624-478f-a73a-647bb77f22d8"),
                IsFormatValid = true,
                MemberId = Guid.Parse("e36c892a-f608-4d24-b29f-d031f4ebf855"),
                PolicyId = Guid.Parse("bb49cd0d-c66d-4c16-858b-0bd6b68df65c"),
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
            OneAdvisor.Model.Commission.Model.CommissionError.CommissionError resolved = null;

            service.Setup(c => c.ResolveMappingError(It.IsAny<ScopeOptions>(), It.Is<OneAdvisor.Model.Commission.Model.CommissionError.CommissionError>(e => e == error)))
                    .Callback((ScopeOptions o, OneAdvisor.Model.Commission.Model.CommissionError.CommissionError e) =>
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
    }
}