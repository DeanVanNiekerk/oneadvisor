using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Client.Model.Policy;

namespace OneAdvisor.Service.Client.Query
{
    public static class PolicyQueryExtensions
    {
        public static IQueryable<PolicyEntity> WherePolicyNumberEquals(this IQueryable<PolicyEntity> query, string policyNumber)
        {
            var numberAliasPattern = policyNumber;
            if (!numberAliasPattern.Contains('%'))
                numberAliasPattern = $"%\"{numberAliasPattern}\"%";

            return query.Where(policy =>
                EF.Functions.Like(policy.Number, policyNumber)
                || EF.Functions.Like(policy._NumberAliases, numberAliasPattern));
        }

        public static async Task<PolicyEdit> MapToEditModel(this Task<PolicyEntity> task)
        {
            var policy = await task;
            return policy != null ? policy.MapToEditModel() : null;
        }

        public static PolicyEdit MapToEditModel(this PolicyEntity policy)
        {
            return new PolicyEdit()
            {
                Id = policy.Id,
                ClientId = policy.ClientId,
                Number = policy.Number,
                CompanyId = policy.CompanyId,
                UserId = policy.UserId,
                Premium = policy.Premium,
                StartDate = policy.StartDate,
                PolicyTypeId = policy.PolicyTypeId,
                PolicyProductTypeId = policy.PolicyProductTypeId,
                PolicyProductId = policy.PolicyProductId,
                NumberAliases = policy.NumberAliases != null ? policy.NumberAliases.ToList() : new List<string>(),
                IsActive = policy.IsActive,
            };
        }
    }
}