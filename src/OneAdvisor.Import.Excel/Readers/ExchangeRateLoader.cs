using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ExcelDataReader;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using OneAdvisor.Model.Import.Commission;
using OneAdvisor.Model.Import.Excel;

namespace OneAdvisor.Import.Excel.Readers
{
    public class ExchangeRateLoader
    {
        public List<SheetExchangeRates> Load(Config config, Stream stream)
        {
            var sheetExchangeRates = new List<SheetExchangeRates>();

            var reader = ExcelReaderFactory.CreateReader(stream);

            var sheetNumber = 0;

            do
            {
                //Increment the sheet number
                sheetNumber++;

                var sheet = config.Sheets.FirstOrDefault(s => s.Position == sheetNumber);

                if (sheet != null)
                {
                    var exchangeRates = Read(reader, sheet);
                    var sheetExchangeRate = new SheetExchangeRates()
                    {
                        SheetNumber = sheetNumber,
                        ExchangeRates = exchangeRates.ToList(),
                    };

                    sheetExchangeRates.Add(sheetExchangeRate);
                }

            } while (reader.NextResult());

            return sheetExchangeRates;
        }

        private IEnumerable<ExchangeRate> Read(IExcelDataReader reader, Sheet sheet)
        {
            var config = sheet.Config.ExchangeRates;

            if (string.IsNullOrEmpty(config.HeaderIdentifier.Column))
                yield break;

            var rowNumber = 0;
            var header = new HeaderLocator(config.HeaderIdentifier);

            while (reader.Read())
            {
                rowNumber++;

                if (!header.Found)
                {
                    header.Check(reader);
                    continue;
                }

                var currency = GetValue(reader, config.CurrencyColumn);
                var rate = GetValue(reader, config.ExchangeRateColumn);

                if (string.IsNullOrEmpty(currency))
                    continue;

                var parsedRate = 0m;
                var success = Decimal.TryParse(rate, out parsedRate);

                if (!success)
                    continue;

                yield return new ExchangeRate() { Currency = currency, Rate = parsedRate };
            }
        }

        public string GetValue(IExcelDataReader reader, string column)
        {
            var index = ExcelUtils.ColumnToIndex(column);
            return Utils.GetValue(reader, index);
        }
    }
}