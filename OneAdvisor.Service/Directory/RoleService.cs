using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Directory.Interface.Repository;
using OneAdvisor.Model.Directory.Interface.Service;

namespace OneAdvisor.Service.Directory
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _repository;

        public RoleService(IRoleRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> HasUseCase(IEnumerable<string> roleIds, string useCase)
        {
            return await _repository.HasUseCase(roleIds, useCase);
        }
    }
}
