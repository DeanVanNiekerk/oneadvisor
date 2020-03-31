using System;
using System.Collections.Generic;
using System.IO;
using CsvHelper;
using CsvHelper.Configuration;
using CsvHelper.TypeConversion;
using OneAdvisor.Model.Export;
using System.Globalization;
using System.Threading.Tasks;

namespace OneAdvisor.Export.Csv.Renderers
{
    public class CsvRenderer<T> : IExportRenderer<T>
    {
        public async Task Render(Stream stream, IEnumerable<T> items)
        {
            var options = new TypeConverterOptions
            {
                Formats = new string[] { "yyyy-MM-dd" }
            };

            var configuration = new CsvConfiguration(CultureInfo.InvariantCulture);
            configuration.TypeConverterOptionsCache.AddOptions<DateTime?>(options);

            using (var writer = new StreamWriter(stream))
            using (var csv = new CsvWriter(writer, configuration))
            {
                await csv.WriteRecordsAsync(items);
            }
        }
    }
}