using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs.Hosting;
using OneAdvisor.Function;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;
using System;

[assembly: WebJobsStartup(typeof(Startup))]
namespace OneAdvisor.Function
{
    public class HelloWorld
    {
        public HelloWorld(ICommissionStatementService commissionStatementService)
        {
            CommissionStatementService = commissionStatementService;
        }

        private ICommissionStatementService CommissionStatementService { get; }

        [FunctionName("com_import_commission")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {

            var scope = new ScopeOptions(Guid.Empty, Guid.Empty, Guid.Empty, Scope.Organisation, true);
            var statement = await CommissionStatementService.GetCommissionStatement(scope, Guid.Parse("7a4690f5-0e5d-4a1f-6b81-08d6c3066137"));

            log.LogInformation("C# HTTP trigger function processed a request.");

            string name = req.Query["name"];

            var runtime = Environment.GetEnvironmentVariable("FUNCTIONS_WORKER_RUNTIME");

            return name != null
                ? (ActionResult)new OkObjectResult($"Hello {name}, runtime is {runtime}, Amout {statement.AmountIncludingVAT.ToString()}")
                : new BadRequestObjectResult("Please pass a name on the query string or in the request body");
        }
    }
}
