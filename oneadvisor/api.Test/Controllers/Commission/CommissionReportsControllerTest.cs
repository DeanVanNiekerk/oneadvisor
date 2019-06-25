using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Controllers.Commission.Commissions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.CommissionReport;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using Xunit;

namespace api.Test.Controllers.Commission
{
    public class CommissionReportsControllerTest
    {
        [Fact]
        public void ClientRevenueDataModelComposition()
        {
            Assert.Equal(12, typeof(ClientRevenueData).PropertyCount());
            Assert.True(typeof(ClientRevenueData).HasProperty("RowNumber"));
            Assert.True(typeof(ClientRevenueData).HasProperty("ClientId"));
            Assert.True(typeof(ClientRevenueData).HasProperty("ClientLastName"));
            Assert.True(typeof(ClientRevenueData).HasProperty("ClientInitials"));
            Assert.True(typeof(ClientRevenueData).HasProperty("ClientDateOfBirth"));
            Assert.True(typeof(ClientRevenueData).HasProperty("MonthlyAnnuityMonth"));
            Assert.True(typeof(ClientRevenueData).HasProperty("AnnualAnnuityAverage"));
            Assert.True(typeof(ClientRevenueData).HasProperty("TotalMonthlyEarnings"));
            Assert.True(typeof(ClientRevenueData).HasProperty("OnceOff"));
            Assert.True(typeof(ClientRevenueData).HasProperty("LifeFirstYears"));
            Assert.True(typeof(ClientRevenueData).HasProperty("GrandTotal"));
            Assert.True(typeof(ClientRevenueData).HasProperty("AllocationsCount"));
        }

        [Fact]
        public async Task GetClientRevenueData()
        {
            var data = new ClientRevenueData()
            {
                RowNumber = 1,
                ClientId = Guid.NewGuid(),
                ClientLastName = "van Niekerk",
                ClientInitials = "DJ",
                ClientDateOfBirth = DateTime.Now,
                MonthlyAnnuityMonth = 2,
                AnnualAnnuityAverage = 3,
                TotalMonthlyEarnings = 4,
                OnceOff = 5,
                LifeFirstYears = 6,
                GrandTotal = 7,
                AllocationsCount = 8
            };

            var pagedItems = new PagedItems<ClientRevenueData>()
            {
                TotalItems = 1,
                Items = new List<ClientRevenueData>() {
                data
                }
            };

            var service = new Mock<ICommissionReportService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            ClientRevenueQueryOptions queryOptions = null;
            service.Setup(c => c.GetClientRevenueData(It.IsAny<ClientRevenueQueryOptions>()))
                .Callback((ClientRevenueQueryOptions options) => queryOptions = options)
                .ReturnsAsync(pagedItems);

            var controller = new CommissionReportsController(service.Object, authService.Object);

            var result = await controller.GetClientRevenueData("MonthlyAnnuityMonth", "desc", 15, 2, $"yearEnding=2019;monthEnding=1");

            Assert.Equal(Scope.Branch, queryOptions.Scope.Scope);
            Assert.Equal("MonthlyAnnuityMonth", queryOptions.SortOptions.Column);
            Assert.Equal(SortDirection.Descending, queryOptions.SortOptions.Direction);
            Assert.Equal(15, queryOptions.PageOptions.Size);
            Assert.Equal(2, queryOptions.PageOptions.Number);

            Assert.Equal(2019, queryOptions.YearEnding);
            Assert.Equal(1, queryOptions.MonthEnding);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedItems<ClientRevenueData>>(okResult.Value);

            Assert.Same(pagedItems, returnValue);
        }

        [Fact]
        public void UserEarningsTypeMonthlyCommissionDataModelComposition()
        {
            Assert.Equal(2, typeof(UserEarningsTypeMonthlyCommissionData).PropertyCount());
            Assert.True(typeof(UserEarningsTypeMonthlyCommissionData).HasProperty("AmountExcludingVAT"));
            Assert.True(typeof(UserEarningsTypeMonthlyCommissionData).HasProperty("CommissionEarningsTypeId"));
        }

        [Fact]
        public async Task GetUserEarningsTypeMonthlyCommissionData()
        {
            var data = new UserEarningsTypeMonthlyCommissionData()
            {
                AmountExcludingVAT = 100,
                CommissionEarningsTypeId = Guid.NewGuid(),
            };

            var items = new List<UserEarningsTypeMonthlyCommissionData>() {
                data
            };

            var service = new Mock<ICommissionReportService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            UserEarningsTypeMonthlyCommissionQueryOptions queryOptions = null;
            service.Setup(c => c.GetUserEarningsTypeMonthlyCommissionData(It.IsAny<UserEarningsTypeMonthlyCommissionQueryOptions>()))
                .Callback((UserEarningsTypeMonthlyCommissionQueryOptions options) => queryOptions = options)
                .ReturnsAsync(items);

            var controller = new CommissionReportsController(service.Object, authService.Object);

            var companyId = Guid.NewGuid();
            var result = await controller.GetUserEarningsTypeMonthlyCommissionData("AmountExcludingVAT", "desc", 15, 2, $"month=" + companyId.ToString());

            Assert.Equal(Scope.Branch, queryOptions.Scope.Scope);
            Assert.Equal("AmountExcludingVAT", queryOptions.SortOptions.Column);
            Assert.Equal(SortDirection.Descending, queryOptions.SortOptions.Direction);
            Assert.Equal(15, queryOptions.PageOptions.Size);
            Assert.Equal(2, queryOptions.PageOptions.Number);

            Assert.Equal(companyId, queryOptions.CompanyId.Single());

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<UserEarningsTypeMonthlyCommissionData>>(okResult.Value);

            Assert.Same(items, returnValue);
        }

        [Fact]
        public void UserCompanyMonthlyCommissionDataModelComposition()
        {
            Assert.Equal(2, typeof(UserCompanyMonthlyCommissionData).PropertyCount());
            Assert.True(typeof(UserCompanyMonthlyCommissionData).HasProperty("AmountExcludingVAT"));
            Assert.True(typeof(UserCompanyMonthlyCommissionData).HasProperty("CompanyId"));
        }

        [Fact]
        public async Task GetUserCompanyMonthlyCommissionData()
        {
            var data = new UserCompanyMonthlyCommissionData()
            {
                AmountExcludingVAT = 100,
                CompanyId = Guid.NewGuid(),
            };

            var items = new List<UserCompanyMonthlyCommissionData>() {
                data
            };

            var service = new Mock<ICommissionReportService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            UserCompanyMonthlyCommissionQueryOptions queryOptions = null;
            service.Setup(c => c.GetUserCompanyMonthlyCommissionData(It.IsAny<UserCompanyMonthlyCommissionQueryOptions>()))
                .Callback((UserCompanyMonthlyCommissionQueryOptions options) => queryOptions = options)
                .ReturnsAsync(items);

            var controller = new CommissionReportsController(service.Object, authService.Object);

            var result = await controller.GetUserCompanyMonthlyCommissionData("AmountExcludingVAT", "desc", 15, 2, $"month=9");

            Assert.Equal(Scope.Branch, queryOptions.Scope.Scope);
            Assert.Equal("AmountExcludingVAT", queryOptions.SortOptions.Column);
            Assert.Equal(SortDirection.Descending, queryOptions.SortOptions.Direction);
            Assert.Equal(15, queryOptions.PageOptions.Size);
            Assert.Equal(2, queryOptions.PageOptions.Number);

            Assert.Equal(9, queryOptions.Month.Single());

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<UserCompanyMonthlyCommissionData>>(okResult.Value);

            Assert.Same(items, returnValue);
        }
    }
}