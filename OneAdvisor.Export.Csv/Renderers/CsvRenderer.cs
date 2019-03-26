using System;
using System.Collections.Generic;
using System.IO;
using CsvHelper;
using CsvHelper.Configuration;
using CsvHelper.TypeConversion;
using OneAdvisor.Model.Export;
using OneAdvisor.Model.Client.Model.ExportClient;

namespace OneAdvisor.Export.Csv.Renderers
{
    public class CsvRenderer<T> : IExportRenderer<T>
    {
        public void Render(Stream stream, IEnumerable<T> items)
        {
            var options = new TypeConverterOptions
            {
                Formats = new string[] { "yyyy-MM-dd" }
            };

            var configuration = new Configuration();
            configuration.TypeConverterOptionsCache.AddOptions<DateTime?>(options);

            using (var writer = new StreamWriter(stream))
            using (var csv = new CsvWriter(writer, configuration))
            {
                csv.WriteRecords(items);
            }
        }
    }
}