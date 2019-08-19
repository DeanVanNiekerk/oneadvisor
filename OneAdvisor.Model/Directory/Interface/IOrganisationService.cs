using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Organisation;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IOrganisationService
    {
        Task<PagedItems<Organisation>> GetOrganisations(OrganisationQueryOptions queryOptions);
        Task<OrganisationEdit> GetOrganisation(ScopeOptions scope, Guid id);
        Task<Result> UpdateOrganisation(ScopeOptions scope, OrganisationEdit organisation);
        Task<Result> InsertOrganisation(ScopeOptions scope, OrganisationEdit organisation);
    }
}
