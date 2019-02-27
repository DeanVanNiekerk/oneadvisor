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

                        commission.LastName = GetValue(reader, 4);
                        commission.DateOfBirth = GetDate(reader, 5);
                        commission.FirstName = GetValue(reader, 6);
                        commission.IdNumber = GetValue(reader, 7);
                        commission.Initials = GetValue(reader, 8);
                        commission.FullName = GetValue(reader, 9);
                        commission.BrokerFullName = GetValue(reader, 10);

                        if (string.IsNullOrWhiteSpace(commission.PolicyNumber))
                            continue;

                        yield return commission;
                    }
                } while (reader.NextResult());
            }
        }

        private string GetValue(IExcelDataReader reader, int index)
        {
            if (index >= reader.FieldCount)
                return "";

            var value = reader.GetValue(index);
            return value != null ? value.ToString() : null;
        }

        private string GetDate(IExcelDataReader reader, int index)
        {
            if (index >= reader.FieldCount)
                return "";

            try
            {
                var value = reader.GetDateTime(index);
                return value != null ? value.ToString("yyyy-MM-dd") : null;
            }
            catch
            {
                return GetValue(reader, index);
            }
        }
    }
}