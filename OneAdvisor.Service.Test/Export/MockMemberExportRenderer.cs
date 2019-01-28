using System.Collections.Generic;
using System.IO;
using OneAdvisor.Model.Export;
using OneAdvisor.Model.Member.Model.ExportMember;

namespace OneAdvisor.Service.Test.Export
{
    public class MockMemberExportRenderer : IExportRenderer<ExportMember>
    {
        public IEnumerable<ExportMember> Items { get; set; }

        public void Render(Stream stream, IEnumerable<ExportMember> items)
        {
            Items = items;
        }
    }
}