using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Client.Interface;
using api.App.Dtos;
using OneAdvisor.Model.Client.Model.Client;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Account.Interface;

namespace api.Controllers.Client.Clients
{

    [ApiController]
    [Route("api/client/clients")]
    public class ClientsController : Controller
    {
        public ClientsController(IClientService clientService, IAuthenticationService authenticationService)
        {
            ClientService = clientService;
            AuthenticationService = authenticationService;
        }

        private IClientService ClientService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("clt_view_clients")]
        public async Task<IActionResult> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new ClientQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);

            var clients = await ClientService.GetClients(queryOptions);

            return Ok(clients);
        }

        [HttpGet("{clientId}")]
        [UseCaseAuthorize("clt_view_clients")]
        public async Task<IActionResult> Get(Guid clientId)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = await ClientService.GetClient(scope, clientId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpGet("{clientId}/preview")]
        [UseCaseAuthorize("clt_view_clients")]
        public async Task<IActionResult> GetPreview(Guid clientId)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = await ClientService.GetClientPreview(scope, clientId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost]
        [UseCaseAuthorize("clt_edit_clients")]
        public async Task<IActionResult> Insert([FromBody] ClientEdit client)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await ClientService.InsertClient(scope, client);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{clientId}")]
        [UseCaseAuthorize("clt_edit_clients")]
        public async Task<IActionResult> Update(Guid clientId, [FromBody] ClientEdit client)
        {
            client.Id = clientId;

            var scope = AuthenticationService.GetScope(User);

            var result = await ClientService.UpdateClient(scope, client);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpDelete("{clientId}")]
        [UseCaseAuthorize("clt_edit_clients")]
        public async Task<IActionResult> Delete(Guid clientId)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await ClientService.DeleteClient(scope, clientId);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }
}
