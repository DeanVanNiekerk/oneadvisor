using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Data;
using OneAdvisor.Model.Directory.Interface;

namespace api.Controllers.Database
{
    [ApiController]
    [Route("api/database")]
    public class DatabaseController : Controller
    {
        public DatabaseController(IDefaultDbContextInitializer contextInitializer)
        {
            DbContextInitializer = contextInitializer;
        }

        private IDefaultDbContextInitializer DbContextInitializer { get; }

        [HttpGet("[action]")]
        public async Task<string> Reset()
        {
            await DbContextInitializer.Clean();
            await DbContextInitializer.Seed();
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
            return "Success";
        }

        [HttpGet("[action]")]
        public async Task<string> SeedLookups()
        {
            await DbContextInitializer.SeedLookups();
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