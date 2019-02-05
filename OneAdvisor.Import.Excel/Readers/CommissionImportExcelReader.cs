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

                        commission.PolicyNumber = reader.GetValue(0).ToString();
                        commission.AmountIncludingVAT = reader.GetValue(1).ToString();
                        commission.VAT = reader.GetValue(2).ToString();
                        commission.CommissionTypeCode = reader.GetValue(3).ToString();

                        yield return commission;
                    }
                } while (reader.NextResult());
            }
        }
    }
}