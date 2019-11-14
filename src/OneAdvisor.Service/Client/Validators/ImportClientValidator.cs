
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Client.Model.ImportClient;
using OneAdvisor.Model.Client.Model.Lookup;
using OneAdvisor.Model.Directory.Model.Lookup;

namespace OneAdvisor.Service.Client.Validators
{
    public class ImportClientValidator : AbstractValidator<ImportClient>
    {
        public ImportClientValidator(List<PolicyType> policyTypes, List<ClientType> clientTypes, List<Company> companies)
        {
            var policyTypeCodes = policyTypes.Select(p => p.Code).ToList();
            var clientTypeCodes = clientTypes.Select(p => p.Code).ToList();
            var companyIds = companies.Select(c => c.Id).ToList();

            RuleFor(m => m.PolicyUserFullName).NotEmpty().WithName("Policy Broker").When(m => !string.IsNullOrEmpty(m.PolicyNumber));

            RuleFor(m => m.PolicyCompanyId)
                .Must(companyId => companyIds.Any(id => companyId == id))
                .When(importClient => !string.IsNullOrEmpty(importClient.PolicyNumber))
                .WithMessage($"Invalid Policy Company Id");

            RuleFor(m => m.PolicyTypeCode)
                .Must(policyType => policyTypeCodes.Any(t => policyType.ToLower() == t))
                .When(importClient => !string.IsNullOrEmpty(importClient.PolicyTypeCode))
                .WithMessage($"Invalid Policy Type Code. Must be one of: {string.Join(",", policyTypeCodes)}");

            RuleFor(m => m.ClientTypeCode)
                .Must(clientType => clientTypeCodes.Any(t => clientType.ToLower() == t))
                .When(importClient => !string.IsNullOrEmpty(importClient.ClientTypeCode))
                .WithMessage($"Invalid Client Type Code. Must be one of: {string.Join(",", clientTypeCodes)}");
        }
    }
}