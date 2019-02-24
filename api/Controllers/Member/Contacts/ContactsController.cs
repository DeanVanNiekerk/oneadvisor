using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Member.Interface;
using api.App.Dtos;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Directory.Interface;
using api.Controllers.Member.Policies.Dto;
using OneAdvisor.Model.Member.Model.Policy;
using OneAdvisor.Model.Member.Model.Contact;
using api.Controllers.Member.Contacts.Dto;

namespace api.Controllers.Member.Contacts
{

    [ApiController]
    [Route("api/member/contacts")]
    public class ContactsController : Controller
    {
        public ContactsController(IMapper mapper, IContactService contactService, IAuthenticationService authenticationService)
        {
            Mapper = mapper;
            ContactService = contactService;
            AuthenticationService = authenticationService;
        }

        private IMapper Mapper { get; }
        private IContactService ContactService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("mem_view_contacts")]
        public async Task<PagedItemsDto<ContactDto>> Index(string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new ContactQueryOptions(scope, filters);
            var pagedItems = await ContactService.GetContacts(queryOptions);

            return Mapper.MapToPageItemsDto<Contact, ContactDto>(pagedItems);
        }

        [HttpGet("{contactId}")]
        [UseCaseAuthorize("mem_view_contacts")]
        public async Task<ActionResult<ContactDto>> Get(Guid contactId)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = await ContactService.GetContact(scope, contactId);

            if (model == null)
                return NotFound();

            return Ok(Mapper.Map<ContactDto>(model));
        }

        [HttpPost]
        [UseCaseAuthorize("mem_edit_contacts")]
        public async Task<ActionResult<Result>> Insert([FromBody] ContactDto contact)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = Mapper.Map<Contact>(contact);

            var result = await ContactService.InsertContact(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{contactId}")]
        [UseCaseAuthorize("mem_edit_contacts")]
        public async Task<ActionResult<Result>> Update(Guid contactId, [FromBody] ContactDto contact)
        {
            contact.Id = contactId;

            var model = Mapper.Map<Contact>(contact);

            var scope = AuthenticationService.GetScope(User);

            var result = await ContactService.UpdateContact(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpDelete("{contactId}")]
        [UseCaseAuthorize("mem_edit_contacts")]
        public async Task<ActionResult<Result>> Delete(Guid contactId)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await ContactService.DeleteContact(scope, contactId);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
