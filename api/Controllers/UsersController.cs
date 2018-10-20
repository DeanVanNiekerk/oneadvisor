using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        [HttpGet("[action]")]
        public IEnumerable<User> Index()
        {
            return new List<User>() 
            {
                new User() { Id = 1, FirstName = "Dean", LastName = "Jackson"}
            };
        }
    }

    public class User 
    {
        public int Id { get; set; }
        public string FirstName { get; set; }  
        public string LastName { get; set; }  
    }
}
