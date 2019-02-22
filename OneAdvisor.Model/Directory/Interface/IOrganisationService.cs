﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Authentication;
using OneAdvisor.Model.Directory.Model.Organisation;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IOrganisationService
    {
        Task<PagedItems<Organisation>> GetOrganisations(OrganisationQueryOptions queryOptions);
        Task<Organisation> GetOrganisation(ScopeOptions scope, Guid id);
        Task<Result> UpdateOrganisation(ScopeOptions scope, Organisation user);
        Task<Result> InsertOrganisation(ScopeOptions scope, Organisation user);
    }
}
