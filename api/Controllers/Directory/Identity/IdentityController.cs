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
        public IdentityController(IHttpContextAccessor contextAccessor, IAuthService authService, IUseCaseService useCaseService, IOrganisationService organisationService, IBranchService branchService)
         : base(contextAccessor)
        {
            UseCaseService = useCaseService;
            OrganisationService = organisationService;
            BranchService = branchService;
        }

        private IMapper Mapper { get; }
        private IUseCaseService UseCaseService { get; }
        private IOrganisationService OrganisationService { get; }
        private IBranchService BranchService { get; }
        private IAuthService AuthService { get; }

        [HttpGet("")]
        public async Task<IdentityDto> Index()
        {
            var scope = await AuthService.GetScope(UserId, Scope);

            var identity = Context.GetIdentity(User);
            var useCaseIds = await UseCaseService.GetUseCases(identity.RoleIds);
            var branch = await BranchService.GetBranch(identity.BranchId);

            Organisation organisation = null;
            if (branch != null)
                organisation = await OrganisationService.GetOrganisation(scope, branch.OrganisationId);

            return new IdentityDto()
            {
                Id = identity.Id,
                Name = identity.Name,
                OrganisationName = organisation != null ? organisation.Name : "NOT IN DB",
                OrganisationId = organisation.Id,
                BranchName = branch != null ? branch.Name : "NOT IN DB",
                BranchId = branch.Id,
                RoleIds = identity.RoleIds.Where(r => r != "Everyone"),
                UseCaseIds = useCaseIds,
                AssistantToUserId = identity.AssistantToUserId,
                Scope = ScopeParser.Format(identity.Scope)
            };
        }
    }
}
