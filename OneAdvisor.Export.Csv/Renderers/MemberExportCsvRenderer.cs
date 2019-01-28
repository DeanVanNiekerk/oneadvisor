using System.Collections.Generic;
using System.IO;
using CsvHelper;
using OneAdvisor.Model.Export;
using OneAdvisor.Model.Member.Model.ExportMember;

namespace OneAdvisor.Export.Csv.Renderers
{
    public class MemberExportCsvRenderer : IExportRenderer<ExportMember>
    {
        public void Render(Stream stream, IEnumerable<ExportMember> items)
        {
            using (var writer = new StreamWriter(stream))
            using (var csv = new CsvWriter((writer)))
            {
                csv.WriteRecords(items);
            }
        }
    }
}