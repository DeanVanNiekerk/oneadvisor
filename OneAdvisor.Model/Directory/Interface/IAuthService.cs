using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.Role;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IAuthService
    {
        Task<Scope> GetScope(string userId, IEnumerable<string> roleIds, string branchUseCase, string organisationUseCase);
    }
}