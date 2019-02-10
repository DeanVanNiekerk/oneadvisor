using System.Collections.Generic;
using System.IO;
using ExcelDataReader;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Import;

namespace OneAdvisor.Import.Excel.Readers
{
    public class CommissionImportExcelReader : IImportReader<ImportCommission>
    {
        public IEnumerable<ImportCommission> Read(Stream stream)
        {
            using (var reader = ExcelReaderFactory.CreateReader(stream))
            {
                do
                {
                    while (reader.Read())
                    {
                        var commission = new ImportCommission();

                        commission.PolicyNumber = GetValue(reader, 0);
                        commission.AmountIncludingVAT = GetValue(reader, 1);
                        commission.VAT = GetValue(reader, 2);
                        commission.CommissionTypeCode = GetValue(reader, 3);

                        if (string.IsNullOrWhiteSpace(commission.PolicyNumber))
                            continue;

                        yield return commission;
                    }
                } while (reader.NextResult());
            }
        }

        private string GetValue(IExcelDataReader reader, int index)
        {
            var value = reader.GetValue(index);
            return value != null ? value.ToString() : null;
        }
    }
}