using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Directory.Model.UseCase;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IUseCaseService
    {
        Task<List<UseCase>> GetUseCases();
        Task<List<string>> GetUseCases(IEnumerable<string> roleIds);
    }
}