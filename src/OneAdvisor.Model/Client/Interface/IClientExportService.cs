using System.IO;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Export;
using OneAdvisor.Model.Client.Model.ExportClient;

namespace OneAdvisor.Model.Client.Interface
{
    public interface IClientExportService
    {
        Task PolicyAggregates(IExportRenderer<ClientPolicyAggregate> renderer, Stream stream, ScopeOptions scope);
        Task Policies(IExportRenderer<ClientPolicy> renderer, Stream stream, ScopeOptions scope);
    }
}