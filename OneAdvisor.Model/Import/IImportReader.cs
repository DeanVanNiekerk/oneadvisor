using System.Collections.Generic;
using System.IO;

namespace OneAdvisor.Model.Import
{
    public interface IImportReader<T>
    {
        IEnumerable<T> Read(Stream stream);
    }
}