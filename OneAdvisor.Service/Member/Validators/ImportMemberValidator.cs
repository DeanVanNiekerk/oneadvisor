
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Data;
using OneAdvisor.Model.Member.Model.ImportMember;


namespace OneAdvisor.Service.Member.Validators
{
    public class ImportMemberValidator : AbstractValidator<ImportMember>
    {
        private List<string> _policyTypeCodes = new List<string>();

        public ImportMemberValidator(DataContext dataContext)
        {
            _policyTypeCodes = dataContext.PolicyType.Select(p => p.Code).ToList();

            RuleFor(m => m.PolicyCompanyId).NotEmpty().WithName("Policy Company").When(m => !string.IsNullOrEmpty(m.PolicyNumber));
            RuleFor(m => m.PolicyUserFullName).NotEmpty().WithName("Policy Broker").When(m => !string.IsNullOrEmpty(m.PolicyNumber));

            RuleFor(m => m.PolicyType)
                .Must(policyType => _policyTypeCodes.Any(t => policyType.ToLower() == t))
                .When(importMember => !string.IsNullOrEmpty(importMember.PolicyType))
                .WithMessage($"Invalid Policy Type. Must be one of: {string.Join(",", _policyTypeCodes)}");
        }
    }
}