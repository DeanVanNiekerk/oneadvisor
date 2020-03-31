using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace OneAdvisor.Model.Export
{
    public interface IExportRenderer<T>
    {
        Task Render(Stream stream, IEnumerable<T> items);
    }
}
