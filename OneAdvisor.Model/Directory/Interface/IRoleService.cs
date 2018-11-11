using System.Collections.Generic;
using System.Threading.Tasks;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IRoleService
    {
         Task<bool> HasUseCase(IEnumerable<string> roleIds, string useCase);
    }
}