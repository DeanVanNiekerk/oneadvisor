
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
            RuleFor(m => m.IdNumber).NotEmpty();
            RuleFor(m => m.PolicyCompanyId).NotEmpty().When(m => !string.IsNullOrEmpty(m.PolicyNumber));
            RuleFor(m => m.PolicyUserFullName).NotEmpty().When(m => !string.IsNullOrEmpty(m.PolicyNumber));
        }
    }
}