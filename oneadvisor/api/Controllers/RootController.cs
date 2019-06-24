using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers.Client.Contacts
{
    [ApiController]
    [Route("")]
    public class RootController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            return Ok(new { appName = "OneAdvisor API", version = System.Reflection.Assembly.GetEntryAssembly().GetName().Version.ToString(3) });
        }
    }
}
