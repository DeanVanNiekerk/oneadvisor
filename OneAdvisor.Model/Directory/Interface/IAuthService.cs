using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.Role;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IAuthService
    {
        Task<ScopeOptions> GetScope(string userId, Scope scope);
    }
}