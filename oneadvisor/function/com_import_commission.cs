using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace OneAdvisor.Function
{
    public static class com_import_commission
    {
        [FunctionName("com_import_commission")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {

            string defaultConnection = "Server=127.0.0.1,1433;Database=OneAdvisor;User ID=sa;Password=2x&%bLn3c47Y!y&hv7";

            var options = new DbContextOptionsBuilder<DataContext>();
            options.UseSqlServer(defaultConnection);

            var db = new DataContext(options.Options);

            log.LogInformation("C# HTTP trigger function processed a request.");

            string name = req.Query["name"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            name = name ?? data?.name;

            //var runtime = Environment.GetEnvironmentVariable("FUNCTIONS_WORKER_RUNTIME");

            return name != null
                ? (ActionResult)new OkObjectResult($"Hello, {name}")
                : new BadRequestObjectResult("Please pass a name on the query string or in the request body");
        }
    }
}
