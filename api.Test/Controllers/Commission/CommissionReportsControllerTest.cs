using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Controllers.Commission.Commissions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Newtonsoft.Json;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Commission.Model.CommissionReport;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;
using Xunit;

namespace api.Test.Controllers.Commission
{
    public class CommissionReportsControllerTest
    {
        [Fact]
        public void MemberRevenueDataModelComposition()
        {
            Assert.Equal(12, typeof(MemberRevenueData).PropertyCount());
            Assert.True(typeof(MemberRevenueData).HasProperty("RowNumber"));
            Assert.True(typeof(MemberRevenueData).HasProperty("MemberId"));
            Assert.True(typeof(MemberRevenueData).HasProperty("MemberFirstName"));
            Assert.True(typeof(MemberRevenueData).HasProperty("MemberLastName"));
            Assert.True(typeof(MemberRevenueData).HasProperty("AnnualAnnuity"));
            Assert.True(typeof(MemberRevenueData).HasProperty("AnnualAnnuityMonth"));
            Assert.True(typeof(MemberRevenueData).HasProperty("MonthlyAnnuity"));
            Assert.True(typeof(MemberRevenueData).HasProperty("MonthlyAnnuityMonth"));
            Assert.True(typeof(MemberRevenueData).HasProperty("OnceOff"));
            Assert.True(typeof(MemberRevenueData).HasProperty("OnceOffMonth"));
            Assert.True(typeof(MemberRevenueData).HasProperty("LifeFirstYears"));
            Assert.True(typeof(MemberRevenueData).HasProperty("LifeFirstYearsMonth"));
        }

        [Fact]
        public async Task Index()
        {
            var data = new MemberRevenueData()
            {
                RowNumber = 1,
                MemberId = Guid.NewGuid(),
                MemberFirstName = "Dean",
                MemberLastName = "van Niekerk",
                AnnualAnnuity = 1,
                AnnualAnnuityMonth = 2,
                MonthlyAnnuity = 3,
                MonthlyAnnuityMonth = 4,
                OnceOff = 5,
                OnceOffMonth = 6,
                LifeFirstYears = 7,
                LifeFirstYearsMonth = 8
            };

            var pagedItems = new PagedItems<MemberRevenueData>()
            {
                TotalItems = 1,
                Items = new List<MemberRevenueData>()
                {
                    data
                }
            };

            var service = new Mock<ICommissionReportService>();
            var authService = TestHelper.MockAuthenticationService(Scope.Branch);

            MemberRevenueQueryOptions queryOptions = null;
            service.Setup(c => c.GetMemberRevenueData(It.IsAny<MemberRevenueQueryOptions>()))
                .Callback((MemberRevenueQueryOptions options) => queryOptions = options)
                .ReturnsAsync(pagedItems);

            var controller = new CommissionReportsController(service.Object, authService.Object);

            var result = await controller.Index("AnnualAnnuityMonth", "desc", 15, 2, $"start=2019-01-01");

            Assert.Equal(Scope.Branch, queryOptions.Scope.Scope);
            Assert.Equal("AnnualAnnuityMonth", queryOptions.SortOptions.Column);
            Assert.Equal(SortDirection.Descending, queryOptions.SortOptions.Direction);
            Assert.Equal(15, queryOptions.PageOptions.Size);
            Assert.Equal(2, queryOptions.PageOptions.Number);

            Assert.Equal("2019-01-01", queryOptions.Start.Value.ToString("yyyy-MM-dd"));

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PagedItems<MemberRevenueData>>(okResult.Value);

            Assert.Same(pagedItems, returnValue);
        }
    }
}