using System.IO;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Export;
using OneAdvisor.Model.Member.Model.ExportMember;

namespace OneAdvisor.Model.Member.Interface
{
    public interface IMemberExportService
    {
        Task PolicyAggregates(IExportRenderer<MemberPolicyAggregate> renderer, Stream stream, ScopeOptions scope);
        Task Policies(IExportRenderer<MemberPolicy> renderer, Stream stream, ScopeOptions scope);
    }
}