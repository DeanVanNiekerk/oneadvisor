using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Directory.Model.Role;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IRoleService
    {
        Task<List<Role>> GetRoles();
        Task<RoleEdit> GetRole(string id);
        Task<bool> HasUseCase(IEnumerable<string> roleIds, IEnumerable<string> useCases);
    }
}