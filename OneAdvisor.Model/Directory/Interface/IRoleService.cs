using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Role;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IRoleService
    {
        Task<List<Role>> GetRoles();
        Task<RoleEdit> GetRole(Guid id);
        Task<bool> HasUseCase(IEnumerable<string> roles, IEnumerable<string> useCases);
        Task<Result> UpdateRole(RoleEdit role);
        Task<Result> InsertRole(RoleEdit role);
    }
}