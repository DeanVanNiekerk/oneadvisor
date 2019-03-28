using System.Collections.Generic;
using System.IO;
using OneAdvisor.Model.Export;
using OneAdvisor.Model.Client.Model.ExportClient;

namespace OneAdvisor.Service.Test.Export
{
    public class MockClientExportRenderer<T> : IExportRenderer<T>
    {
        public IEnumerable<T> Items { get; set; }

        public void Render(Stream stream, IEnumerable<T> items)
        {
            Items = items;
        }
    }
}