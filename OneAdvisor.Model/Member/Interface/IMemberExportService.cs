using System.IO;
using System.Threading.Tasks;
using OneAdvisor.Model.Export;
using OneAdvisor.Model.Member.Model.ExportMember;

namespace OneAdvisor.Model.Member.Interface
{
    public interface IMemberExportService
    {
        Task Export(IExportRenderer<ExportMember> renderer, Stream stream, ExportMemberQueryOptions options);
    }
}