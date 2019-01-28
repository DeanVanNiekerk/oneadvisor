using System;
using System.Collections.Generic;
using System.IO;

namespace OneAdvisor.Model.Export
{
    public interface IExportRenderer<T>
    {
        void Render(Stream stream, IEnumerable<T> items);
    }
}
