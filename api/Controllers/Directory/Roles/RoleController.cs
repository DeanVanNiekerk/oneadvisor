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
using OneAdvisor.Model.Directory.Model.Role;

namespace api.Controllers.Directory.Roles
{

    [ApiController]
    [Route("api/directory/roles")]
    public class RolesController : Controller
    {
        public RolesController(IRoleService roleService)
        {
            RoleService = roleService;
        }

        private IRoleService RoleService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("dir_view_roles")]
        public async Task<IActionResult> Index()
        {
            var roles = await RoleService.GetRoles();

            return Ok(roles);
        }

        [HttpGet("{roleId}")]
        [UseCaseAuthorize("dir_view_roles")]
        public async Task<IActionResult> Get(Guid roleId)
        {
            var model = await RoleService.GetRole(roleId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost]
        [UseCaseAuthorize("dir_edit_roles")]
        public async Task<IActionResult> Insert([FromBody] RoleEdit role)
        {
            var result = await RoleService.InsertRole(role);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{roleId}")]
        [UseCaseAuthorize("dir_edit_roles")]
        public async Task<IActionResult> Update(Guid roleId, [FromBody] RoleEdit role)
        {
            role.Id = roleId;

            var result = await RoleService.UpdateRole(role);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

    }

}
