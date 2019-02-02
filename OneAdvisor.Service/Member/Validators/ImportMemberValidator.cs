
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Member.Model.ImportMember;


namespace OneAdvisor.Service.Member.Validators
{
    public class ImportMemberValidator : AbstractValidator<ImportMember>
    {
        private List<string> _policyTypes = new List<string>()
        {
            "investment",
            "life_insurance",
            "short_term",
            "medical_cover",
            "rewards"
        };

        public ImportMemberValidator(bool isInsert)
        {
            RuleFor(m => m.PolicyCompanyId).NotEmpty().WithName("Policy Company").When(m => !string.IsNullOrEmpty(m.PolicyNumber));
            RuleFor(m => m.PolicyUserFullName).NotEmpty().WithName("Policy Broker").When(m => !string.IsNullOrEmpty(m.PolicyNumber));

            RuleFor(m => m.PolicyType)
                .Must(policyType => _policyTypes.Any(t => policyType.ToLower() == t))
                .When(importMember => !string.IsNullOrEmpty(importMember.PolicyType))
                .WithMessage($"Invalid Policy Type. Must be one of: {string.Join(",", _policyTypes)}");
        }
    }
}