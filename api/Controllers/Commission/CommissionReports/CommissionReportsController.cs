﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Common;
using api.App.Dtos;
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

        [HttpGet("memberRevenueData")]
        [UseCaseAuthorize("com_view_report_member_revenue")]
        public async Task<IActionResult> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new MemberRevenueQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);

            var data = await CommissionReportService.GetMemberRevenueData(queryOptions);

            return Ok(data);
        }
    }
}