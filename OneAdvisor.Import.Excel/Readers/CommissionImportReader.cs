using System.Collections.Generic;
using System.IO;
using ExcelDataReader;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Import;

namespace OneAdvisor.Import.Excel.Readers
{
    public class CommissionImportReader : IImportReader<ImportCommission>
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

                        commission.PolicyNumber = Utils.GetValue(reader, 0);
                        commission.AmountIncludingVAT = Utils.GetValue(reader, 1);
                        commission.VAT = Utils.GetValue(reader, 2);
                        commission.CommissionTypeCode = Utils.GetValue(reader, 3);

                        commission.LastName = Utils.GetValue(reader, 4);
                        commission.DateOfBirth = Utils.GetDate(reader, 5);
                        commission.FirstName = Utils.GetValue(reader, 6);
                        commission.IdNumber = Utils.GetValue(reader, 7);
                        commission.Initials = Utils.GetValue(reader, 8);
                        commission.FullName = Utils.GetValue(reader, 9);
                        commission.BrokerFullName = Utils.GetValue(reader, 10);

                        if (string.IsNullOrWhiteSpace(commission.PolicyNumber))
                            continue;

                        yield return commission;
                    }
                } while (reader.NextResult());
            }
        }
    }
}