using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Common;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Commission.Model.CommissionReport;

namespace api.Controllers.Commission.Commissions
{

    [ApiController]
    [Route("api/commission/report")]
    public class CommissionReportsController : Controller
    {
        public CommissionReportsController(ICommissionReportService commissionReportService, IAuthenticationService authenticationService)
        {
            CommissionReportService = commissionReportService;
            AuthenticationService = authenticationService;
        }

        private ICommissionReportService CommissionReportService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("clientRevenueData")]
        [UseCaseAuthorize("com_view_report_client_revenue")]
        public async Task<IActionResult> GetClientRevenueData(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new ClientRevenueQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);

            var data = await CommissionReportService.GetClientRevenueData(queryOptions);

            return Ok(data);
        }

        [HttpGet("userEarningsTypeMonthlyCommissionData")]
        [UseCaseAuthorize("com_view_report_user_monthly_commission")]
        public async Task<IActionResult> GetUserEarningsTypeMonthlyCommissionData(string sortColumn = "", string sortDirection = "", int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new UserEarningsTypeMonthlyCommissionQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);

            var data = await CommissionReportService.GetUserEarningsTypeMonthlyCommissionData(queryOptions);

            return Ok(data);
        }

        [HttpGet("userCompanyMonthlyCommissionData")]
        [UseCaseAuthorize("com_view_report_user_monthly_commission")]
        public async Task<IActionResult> GetUserCompanyMonthlyCommissionData(string sortColumn = "AmountExcludingVAT", string sortDirection = "desc", int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new UserCompanyMonthlyCommissionQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);

            var data = await CommissionReportService.GetUserCompanyMonthlyCommissionData(queryOptions);

            return Ok(data);
        }

        [HttpGet("pastRevenueCommissionData")]
        [UseCaseAuthorize("com_view_report_past_revenue_commission")]
        public async Task<IActionResult> GetPastRevenueCommissionData(string sortColumn = "AmountExcludingVAT", string sortDirection = "desc", int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new PastRevenueCommissionQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);

            var data = await CommissionReportService.GetPastRevenueCommissionData(queryOptions);

            return Ok(data);
        }

        [HttpGet("commissionLapseData")]
        [UseCaseAuthorize("com_view_report_commission_lapse")]
        public async Task<IActionResult> GetCommissionLapseData(string sortColumn = "", string sortDirection = "", int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new CommissionLapseQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);

            var data = await CommissionReportService.GetCommissionLapseData(queryOptions);

            return Ok(data);
        }
    }
}
