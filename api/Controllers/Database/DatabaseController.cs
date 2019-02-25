using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Data;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Authentication;
using OneAdvisor.Model.Directory.Model.Role;
using OneAdvisor.Model.Directory.Model.User;

namespace api.Controllers.Database
{
    [ApiController]
    [Route("api/database")]
    public class DatabaseController : Controller
    {
        public DatabaseController(IDefaultDbContextInitializer contextInitializer, IUserService userService)
        {
            DbContextInitializer = contextInitializer;
            UserService = userService;
        }

        private IDefaultDbContextInitializer DbContextInitializer { get; }
        private IUserService UserService { get; }

        [HttpGet("[action]")]
        public async Task<string> Reset()
        {
            await DbContextInitializer.Clean();
            await Seed();
            return "Success";
        }

        [HttpGet("[action]")]
        public async Task<string> ResetRolesAndUseCase()
        {
            await DbContextInitializer.CleanRolesAndUseCase();
            await DbContextInitializer.SeedRolesAndUseCase();
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

            var options = new ScopeOptions(Guid.Empty, shellyBeachBranchId, Guid.Empty, Scope.Organisation, true);

            var user = new UserEdit()
            {
                FirstName = "Dean",
                LastName = "van Niekerk",
                Email = "deanvniekerk@gmail.com",
                Scope = Scope.Organisation,
                Roles = new List<string>() { "dir_administrator", "mem_administrator", "com_administrator", Role.SUPER_ADMINISTRATOR_ROLE },
                BranchId = shellyBeachBranchId,
            };

            await UserService.InsertUser(options, user, "Test123!");

            user = new UserEdit()
            {
                FirstName = "Marc",
                LastName = "Bormann",
                Email = "marc@smithbormann.co.za",
                Scope = Scope.Organisation,
                Roles = new List<string>() { "dir_administrator", "mem_administrator", "com_administrator", Role.SUPER_ADMINISTRATOR_ROLE },
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