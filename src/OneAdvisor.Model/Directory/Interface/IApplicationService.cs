using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Directory.Model.Application;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IApplicationService
    {
         Task<List<Application>> GetApplications();
    }
}