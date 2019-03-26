using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.App.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Role;
using OneAdvisor.Model.Directory.Model.User;

namespace api.Controllers.Database
{
    [ApiController]
    //[RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
    [Route("api/database")]
    public class DatabaseController : Controller
    {
        private List<string> _allRoles = new List<string>() { "dir_administrator", "clt_administrator", "com_administrator", Role.SUPER_ADMINISTRATOR_ROLE };
        private List<string> _limitedRoles = new List<string>() { "clt_administrator", "com_administrator" };

        public DatabaseController(IDefaultDbContextInitializer contextInitializer, IUserService userService, UserManager<UserEntity> userManager)
        {
            DbContextInitializer = contextInitializer;
            UserService = userService;
            UserManager = userManager;
        }

        private IDefaultDbContextInitializer DbContextInitializer { get; }
        private IUserService UserService { get; }
        private UserManager<UserEntity> UserManager { get; }

        [HttpGet("[action]")]
        public async Task<string> ResetRolesAndUseCase()
        {
            await DbContextInitializer.CleanRolesAndUseCase();
            await DbContextInitializer.SeedRolesAndUseCase();

            var user = await UserManager.FindByEmailAsync("deanvniekerk@gmail.com");
            await UserManager.AddToRolesAsync(user, _allRoles);

            user = await UserManager.FindByEmailAsync("marc@smithbormann.co.za");
            await UserManager.AddToRolesAsync(user, _allRoles);

            user = await UserManager.FindByEmailAsync("advice@smithbormann.co.za");
            await UserManager.AddToRolesAsync(user, _limitedRoles);

            user = await UserManager.FindByEmailAsync("gavin@lifeplanbrokers.co.za");
            await UserManager.AddToRolesAsync(user, _limitedRoles);

            return "Success";
        }

        [HttpGet("[action]")]
        public async Task<string> Seed()
        {
            await DbContextInitializer.Seed();
            await SeedUsers();
            return "Success";
        }

        [HttpGet("[action]")]
        public async Task<string> SeedLookups()
        {
            await DbContextInitializer.SeedLookups();
            return "Success";
        }


        [HttpGet("[action]")]
        public async Task<string> SeedUsers()
        {
            var shellyBeachBranchId = Guid.Parse("cfaa7bf4-bff8-4c8c-b71e-f64bd8249750");
            var lifeBranchId = Guid.Parse("7ab8bcd9-0544-4613-a82e-06b6de99d7ac");

            var options = new ScopeOptions(Guid.Empty, shellyBeachBranchId, Guid.Empty, Scope.Organisation, true);

            var user = new UserEdit()
            {
                FirstName = "Dean",
                LastName = "van Niekerk",
                Email = "deanvniekerk@gmail.com",
                UserName = "deanvniekerk@gmail.com",
                Scope = Scope.Organisation,
                Roles = _allRoles,
                BranchId = shellyBeachBranchId,
            };
            await UserService.InsertUser(options, user, "Test123!");

            user = new UserEdit()
            {
                FirstName = "Marc",
                LastName = "Bormann",
                Email = "marc@smithbormann.co.za",
                UserName = "marc@smithbormann.co.za",
                Scope = Scope.Organisation,
                Roles = _allRoles,
                BranchId = shellyBeachBranchId,
            };
            await UserService.InsertUser(options, user, "Test123!");

            user = new UserEdit()
            {
                FirstName = "Joanne",
                LastName = "Bormann",
                Email = "advice@smithbormann.co.za",
                UserName = "advice@smithbormann.co.za",
                Scope = Scope.Organisation,
                Roles = _limitedRoles,
                BranchId = shellyBeachBranchId,
            };
            await UserService.InsertUser(options, user, "Test123!");

            user = new UserEdit()
            {
                FirstName = "Gavin",
                LastName = "Smith",
                Email = "gavin@lifeplanbrokers.co.za",
                UserName = "gavin@lifeplanbrokers.co.za",
                Scope = Scope.Organisation,
                Roles = _limitedRoles,
                BranchId = shellyBeachBranchId,
            };
            await UserService.InsertUser(options, user, "Test123!");

            return "Success";
        }

        [HttpGet("[action]")]
        public async Task<string> Clean()
        {
            var total = await DbContextInitializer.Clean();
            return "Success. Rows nuked: " + total.ToString();
        }
    }
}