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
using api.Controllers.Directory.Roles.Dto;
using OneAdvisor.Model.Directory.Model.Role;

namespace api.Controllers.Directory.Roles
{
    
    [ApiController]
    [Route("api/directory/roles")]
    public class RolesController : Controller
    {
        public RolesController(IMapper mapper, IRoleService roleService)
        {
            Mapper = mapper;
            RoleService = roleService;
        }

        private IMapper Mapper { get; }
        private IRoleService RoleService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("dir_view_roles")]
        public async Task<List<RoleDto>> Index()
        {
            var roles = await RoleService.GetRoles();

            return Mapper.MapList<Role, RoleDto>(roles);
        }

    }

}
