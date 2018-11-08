using System.Collections.Generic;
using System.Threading.Tasks;

namespace OneAdvisor.Model.Directory.Interface.Repository
{
    public interface IRoleRepository
    {
         Task<bool> HasUseCase(IEnumerable<string> roleIds, string useCase);
    }
}