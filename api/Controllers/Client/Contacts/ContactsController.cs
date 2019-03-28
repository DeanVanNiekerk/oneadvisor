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
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Client.Model.Policy;
using OneAdvisor.Model.Client.Model.Contact;
using OneAdvisor.Model.Account.Interface;

namespace api.Controllers.Client.Contacts
{

    [ApiController]
    [Route("api/client/contacts")]
    public class ContactsController : Controller
    {
        public ContactsController(IContactService contactService, IAuthenticationService authenticationService)
        {
            ContactService = contactService;
            AuthenticationService = authenticationService;
        }

        private IContactService ContactService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("clt_view_contacts")]
        public async Task<IActionResult> Index(string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new ContactQueryOptions(scope, filters);
            var pagedItems = await ContactService.GetContacts(queryOptions);

            return Ok(pagedItems);
        }

        [HttpGet("{contactId}")]
        [UseCaseAuthorize("clt_view_contacts")]
        public async Task<IActionResult> Get(Guid contactId)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = await ContactService.GetContact(scope, contactId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost]
        [UseCaseAuthorize("clt_edit_contacts")]
        public async Task<IActionResult> Insert([FromBody] Contact contact)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await ContactService.InsertContact(scope, contact);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{contactId}")]
        [UseCaseAuthorize("clt_edit_contacts")]
        public async Task<IActionResult> Update(Guid contactId, [FromBody] Contact contact)
        {
            contact.Id = contactId;

            var scope = AuthenticationService.GetScope(User);

            var result = await ContactService.UpdateContact(scope, contact);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpDelete("{contactId}")]
        [UseCaseAuthorize("clt_edit_contacts")]
        public async Task<IActionResult> Delete(Guid contactId)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await ContactService.DeleteContact(scope, contactId);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
