
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Member.Model.ImportMember;


namespace OneAdvisor.Service.Member.Validators
{
    public class ImportMemberValidator : AbstractValidator<ImportMember>
    {
        public ImportMemberValidator(bool isInsert)
        {
            RuleFor(o => o.IdNumber).NotEmpty().MaximumLength(32);
        }
    }
}