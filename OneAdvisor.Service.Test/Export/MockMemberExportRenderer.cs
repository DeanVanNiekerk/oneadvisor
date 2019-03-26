using System.Collections.Generic;
using System.IO;
using OneAdvisor.Model.Export;
using OneAdvisor.Model.Member.Model.ExportMember;

namespace OneAdvisor.Service.Test.Export
{
    public class MockMemberExportRenderer<T> : IExportRenderer<T>
    {
        public IEnumerable<T> Items { get; set; }

        public void Render(Stream stream, IEnumerable<T> items)
        {
            Items = items;
        }
    }
}