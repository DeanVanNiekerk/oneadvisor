using System;
using System.Linq;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;
using OneAdvisor.Data;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Model.Contact;
using OneAdvisor.Service.Common;
using OneAdvisor.Service.Common.Query;

namespace OneAdvisor.Service.Member.Validators
{
    public class ContactValidator : AbstractValidator<Contact>
    {
        public ContactValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(c => c.Id).GuidNotEmpty();

            RuleFor(c => c.MemberId).GuidNotEmpty("Member");
            RuleFor(c => c.ContactTypeId).GuidNotEmpty("Type");
            RuleFor(c => c.Value).NotEmpty().MaximumLength(128);
        }
    }
}