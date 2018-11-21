using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Organisation;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IOrganisationService
    {
        Task<IEnumerable<Organisation>> GetOrganisations();
        Task<Organisation> GetOrganisation(Guid id);
        Task<Result> UpdateOrganisation(Organisation user);
        Task<Result> InsertOrganisation(Organisation user);
    }
}
