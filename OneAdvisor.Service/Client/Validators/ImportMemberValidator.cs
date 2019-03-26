
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Data;
using OneAdvisor.Model.Client.Model.ImportClient;


namespace OneAdvisor.Service.Client.Validators
{
    public class ImportClientValidator : AbstractValidator<ImportClient>
    {
        private List<string> _policyTypeCodes = new List<string>();

        public ImportClientValidator(DataContext dataContext)
        {
            _policyTypeCodes = dataContext.PolicyType.Select(p => p.Code).ToList();

            RuleFor(m => m.PolicyCompanyId).NotEmpty().WithName("Policy Company").When(m => !string.IsNullOrEmpty(m.PolicyNumber));
            RuleFor(m => m.PolicyUserFullName).NotEmpty().WithName("Policy Broker").When(m => !string.IsNullOrEmpty(m.PolicyNumber));

            RuleFor(m => m.PolicyType)
                .Must(policyType => _policyTypeCodes.Any(t => policyType.ToLower() == t))
                .When(importClient => !string.IsNullOrEmpty(importClient.PolicyType))
                .WithMessage($"Invalid Policy Type. Must be one of: {string.Join(",", _policyTypeCodes)}");
        }
    }
}