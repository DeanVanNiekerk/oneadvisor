using System.IO;
using System.Collections.Generic;
using OneAdvisor.Model.Export;
using System.Threading.Tasks;

namespace OneAdvisor.Service.Test.Export
{
    public class MockClientExportRenderer<T> : IExportRenderer<T>
    {
        public IEnumerable<T> Items { get; set; }

        public async Task Render(Stream stream, IEnumerable<T> items)
        {
            Items = items;
            await Task.CompletedTask;
        }
    }
}