using System;
using System.Linq;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;
using OneAdvisor.Data;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Client.Model.Contact;
using OneAdvisor.Service.Common;
using OneAdvisor.Service.Common.Query;

namespace OneAdvisor.Service.Client.Validators
{
    public class ContactValidator : AbstractValidator<Contact>
    {
        public ContactValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(c => c.Id).NotEmpty();

            RuleFor(c => c.ClientId).NotEmpty().WithName("Client");
            RuleFor(c => c.ContactTypeId).NotEmpty().WithName("Contact Type");
            RuleFor(c => c.Value).NotEmpty().MaximumLength(128);
        }
    }
}