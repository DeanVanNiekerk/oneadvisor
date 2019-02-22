using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Common;
using api.App.Dtos;
using api.Controllers.Directory.Identity.Dto;
using OneAdvisor.Model.Directory.Model.Organisation;
using OneAdvisor.Model.Directory.Model.User;
using Microsoft.AspNetCore.Http;

namespace api.Controllers.Directory.Identity
{
    [Authorize]
    [ApiController]
    [Route("api/directory/identity")]
    public class IdentityController : BaseController
    {
        public IdentityController(IHttpContextAccessor contextAccessor, IAuthenticationService authenticationService, IUseCaseService useCaseService, IOrganisationService organisationService, IBranchService branchService, IUserService userService)
         : base(contextAccessor)
        {
            UseCaseService = useCaseService;
            OrganisationService = organisationService;
            BranchService = branchService;
            AuthenticationService = authenticationService;
            UserService = userService;
        }

        private IMapper Mapper { get; }
        private IUseCaseService UseCaseService { get; }
        private IOrganisationService OrganisationService { get; }
        private IBranchService BranchService { get; }
        private IAuthenticationService AuthenticationService { get; }
        private IUserService UserService { get; }

        [HttpGet("")]
        public async Task<IdentityDto> Index()
        {
            var scope = await AuthenticationService.GetScope(UserId, IsSuperAdmin);

            var user = await UserService.GetUser(scope, UserId);
            var useCaseIds = await UseCaseService.GetUseCases(Roles);
            var branch = await BranchService.GetBranch(scope, user.BranchId.Value);
            var organisation = await OrganisationService.GetOrganisation(scope, branch.OrganisationId.Value);

            return new IdentityDto()
            {
                Id = user.Id,
                UserName = user.UserName,
                OrganisationName = organisation.Name,
                OrganisationId = organisation.Id.Value,
                BranchName = branch.Name,
                BranchId = branch.Id.Value,
                Roles = Roles,
                UseCaseIds = useCaseIds,
                Scope = user.Scope
            };
        }
    }
}
