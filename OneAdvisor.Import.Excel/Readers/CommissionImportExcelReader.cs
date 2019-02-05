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

                        commission.PolicyNumber = reader.GetString(0);
                        commission.CommissionTypeCode = reader.GetString(1);
                        commission.AmountIncludingVAT = reader.GetString(2);
                        commission.VAT = reader.GetString(3);

                        yield return commission;
                    }
                } while (reader.NextResult());
            }
        }
    }
}