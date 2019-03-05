using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Controllers.Commission.Commissions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Newtonsoft.Json;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;

namespace api.Test.Controllers.Commission
{
    [TestClass]
    public class CommissionsControllerTest
    {
        [TestMethod]
        public async Task Index()
        {
            var commission = new OneAdvisor.Model.Commission.Model.Commission.Commission()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                AmountIncludingVAT = 100,
                VAT = 20,
                CommissionStatementId = Guid.Parse("d5887153-b373-4275-8eb1-6b7c1e9d57db"),
                CommissionTypeId = Guid.Parse("24b55c80-4624-478f-a73a-647bb77f22d8"),
                PolicyId = Guid.Parse("e36c892a-f608-4d24-b29f-d031f4ebf855"),
                PolicyNumber = "123456",
                UserId = Guid.Parse("bb49cd0d-c66d-4c16-858b-0bd6b68df65c")
            };

            var pagedItems = new PagedCommissions()
            {
                TotalItems = 1,
                AverageAmountIncludingVAT = 100,
                AverageVAT = 200,
                SumAmountIncludingVAT = 300,
                SumVAT = 400,
                Items = new List<OneAdvisor.Model.Commission.Model.Commission.Commission>()
                {
                    commission
                }
            };

            var service = new Mock<ICommissionService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            CommissionQueryOptions queryOptions = null;
            service.Setup(c => c.GetCommissions(It.IsAny<CommissionQueryOptions>()))
                .Callback((CommissionQueryOptions options) => queryOptions = options)
                .ReturnsAsync(pagedItems);

            var controller = new CommissionsController(service.Object, authService.Object);

            var actual = await controller.Index("policyNumber", "desc", 15, 2, "commissionTypeId=24b55c80-4624-478f-a73a-647bb77f22d8");

            Assert.AreEqual(Scope.Branch, queryOptions.Scope.Scope);
            Assert.AreEqual("policyNumber", queryOptions.SortOptions.Column);
            Assert.AreEqual(SortDirection.Descending, queryOptions.SortOptions.Direction);
            Assert.AreEqual(15, queryOptions.PageOptions.Size);
            Assert.AreEqual(2, queryOptions.PageOptions.Number);

            Assert.AreEqual(commission.CommissionTypeId, queryOptions.CommissionTypeId.Single());

            Assert.AreEqual("{\"SumAmountIncludingVAT\":300.0,\"SumVAT\":400.0,\"AverageAmountIncludingVAT\":100.0,\"AverageVAT\":200.0,\"TotalItems\":1,\"Items\":[{\"Id\":\"21f9f54f-0bbc-4afc-a588-b6bae4f47ae6\",\"CommissionStatementId\":\"d5887153-b373-4275-8eb1-6b7c1e9d57db\",\"PolicyId\":\"e36c892a-f608-4d24-b29f-d031f4ebf855\",\"CommissionTypeId\":\"24b55c80-4624-478f-a73a-647bb77f22d8\",\"AmountIncludingVAT\":100.0,\"VAT\":20.0,\"UserId\":\"bb49cd0d-c66d-4c16-858b-0bd6b68df65c\",\"PolicyNumber\":\"123456\"}]}", JsonConvert.SerializeObject(actual));
        }

        [TestMethod]
        public async Task Get()
        {
            var commission = new CommissionEdit()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                AmountIncludingVAT = 100,
                VAT = 20,
                CommissionStatementId = Guid.Parse("d5887153-b373-4275-8eb1-6b7c1e9d57db"),
                CommissionTypeId = Guid.Parse("24b55c80-4624-478f-a73a-647bb77f22d8"),
                PolicyId = Guid.Parse("e36c892a-f608-4d24-b29f-d031f4ebf855"),
                SourceData = null
            };

            var service = new Mock<ICommissionService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            service.Setup(c => c.GetCommission(It.IsAny<ScopeOptions>(), It.Is<Guid>(m => m == commission.Id.Value)))
                .ReturnsAsync(commission);

            var controller = new CommissionsController(service.Object, authService.Object);

            var actual = await controller.Get(commission.Id.Value);

            Assert.AreEqual("{\"Result\":{\"Value\":{\"Id\":\"21f9f54f-0bbc-4afc-a588-b6bae4f47ae6\",\"CommissionStatementId\":\"d5887153-b373-4275-8eb1-6b7c1e9d57db\",\"PolicyId\":\"e36c892a-f608-4d24-b29f-d031f4ebf855\",\"CommissionTypeId\":\"24b55c80-4624-478f-a73a-647bb77f22d8\",\"AmountIncludingVAT\":100.0,\"VAT\":20.0,\"SourceData\":null},\"Formatters\":[],\"ContentTypes\":[],\"DeclaredType\":null,\"StatusCode\":200},\"Value\":null}", JsonConvert.SerializeObject(actual));
        }

        [TestMethod]
        public async Task Insert()
        {
            var commission = new CommissionEdit()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                AmountIncludingVAT = 100,
                VAT = 20,
                CommissionStatementId = Guid.Parse("d5887153-b373-4275-8eb1-6b7c1e9d57db"),
                CommissionTypeId = Guid.Parse("24b55c80-4624-478f-a73a-647bb77f22d8"),
                PolicyId = Guid.Parse("e36c892a-f608-4d24-b29f-d031f4ebf855"),
                SourceData = null
            };

            var service = new Mock<ICommissionService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            CommissionEdit inserted = null;
            service.Setup(c => c.InsertCommission(It.IsAny<ScopeOptions>(), It.Is<CommissionEdit>(m => m == commission)))
                .Callback((ScopeOptions o, CommissionEdit i) =>
                {
                    inserted = i;
                    options = o;
                }
                    )
                .ReturnsAsync(result);

            var controller = new CommissionsController(service.Object, authService.Object);

            var actual = await controller.Insert(commission);

            Assert.AreSame(commission, inserted);
            Assert.AreEqual(Scope.Branch, options.Scope);

            Assert.AreEqual("{\"Result\":{\"Value\":{\"Success\":true,\"Tag\":null,\"Errors\":[],\"ValidationFailures\":[]},\"Formatters\":[],\"ContentTypes\":[],\"DeclaredType\":null,\"StatusCode\":200},\"Value\":null}", JsonConvert.SerializeObject(actual));
        }

        [TestMethod]
        public async Task Update()
        {
            var commission = new CommissionEdit()
            {
                Id = Guid.Parse("21f9f54f-0bbc-4afc-a588-b6bae4f47ae6"),
                AmountIncludingVAT = 100,
                VAT = 20,
                CommissionStatementId = Guid.Parse("d5887153-b373-4275-8eb1-6b7c1e9d57db"),
                CommissionTypeId = Guid.Parse("24b55c80-4624-478f-a73a-647bb77f22d8"),
                PolicyId = Guid.Parse("e36c892a-f608-4d24-b29f-d031f4ebf855"),
                SourceData = null
            };

            var service = new Mock<ICommissionService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            var result = new Result()
            {
                Success = true
            };

            ScopeOptions options = null;
            CommissionEdit updated = null;
            service.Setup(c => c.UpdateCommission(It.IsAny<ScopeOptions>(), It.Is<CommissionEdit>(m => m == commission)))
                .Callback((ScopeOptions o, CommissionEdit i) =>
                {
                    updated = i;
                    options = o;
                }
                    )
                .ReturnsAsync(result);

            var controller = new CommissionsController(service.Object, authService.Object);

            var actual = await controller.Update(commission.Id.Value, commission);

            Assert.AreSame(commission, updated);
            Assert.AreEqual(Scope.Branch, options.Scope);

            Assert.AreEqual("{\"Result\":{\"Value\":{\"Success\":true,\"Tag\":null,\"Errors\":[],\"ValidationFailures\":[]},\"Formatters\":[],\"ContentTypes\":[],\"DeclaredType\":null,\"StatusCode\":200},\"Value\":null}", JsonConvert.SerializeObject(actual));
        }
    }
}