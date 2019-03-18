using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers.Member.Contacts
{
    [ApiController]
    [Route("")]
    public class RootController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            return Ok(new { message = "Welcome to the OneAdvisor API." });
        }
    }
}
