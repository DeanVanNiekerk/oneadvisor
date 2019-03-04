using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ExcelDataReader;
using OneAdvisor.Model;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Helpers;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Export.Excel;
using OneAdvisor.Model.Import;

namespace OneAdvisor.Import.Excel.Readers
{
    public class CommissionImportReader : IImportReader<ImportCommission>
    {
        private Config _config;

        public CommissionImportReader(Config config)
        {
            _config = config;
        }

        public IEnumerable<ImportCommission> Read(Stream stream)
        {
            using (var reader = ExcelReaderFactory.CreateReader(stream))
            {
                var headerColumnIndex = ExcelUtils.ColumnToIndex(_config.HeaderIdentifier.Column);
                var headerFound = false || headerColumnIndex == -1;
                var commissionTypeIndexes = GetCommissionIndexes();
                do
                {
                    while (reader.Read())
                    {
                        if (!headerFound)
                        {
                            var currentValue = Utils.GetValue(reader, headerColumnIndex);
                            headerFound = _config.HeaderIdentifier.Value.IgnoreCaseEquals(currentValue);
                            continue;
                        }

                        //Ignore row if any of the primary field values are empty
                        var requiredFields = _config.Fields.Where(f => Fields.PrimaryFieldNames().Any(p => p == f.Name));
                        var anyMissingRequiredFields = requiredFields.Any(field =>
                        {
                            var fieldValue = Utils.GetValue(reader, ExcelUtils.ColumnToIndex(field.Column));
                            return string.IsNullOrWhiteSpace(fieldValue);
                        });

                        if (anyMissingRequiredFields)
                            continue;

                        var commission = new ImportCommission();

                        commission.PolicyNumber = GetValue(reader, FieldNames.PolicyNumber);

                        var commissionTypeValue = GetCommissionTypeValue(reader, commissionTypeIndexes);
                        commission.CommissionTypeValue = commissionTypeValue;
                        commission.CommissionTypeCode = GetCommissionTypeCode(commissionTypeValue);

                        commission.LastName = GetValue(reader, FieldNames.LastName);
                        commission.DateOfBirth = GetDate(reader, FieldNames.DateOfBirth);
                        commission.FirstName = GetValue(reader, FieldNames.FirstName);
                        commission.IdNumber = GetValue(reader, FieldNames.IdNumber);
                        commission.Initials = GetValue(reader, FieldNames.Initials);
                        commission.FullName = GetValue(reader, FieldNames.FullName);
                        commission.BrokerFullName = GetValue(reader, FieldNames.BrokerFullName);

                        commission.AmountIncludingVAT = GetValue(reader, FieldNames.AmountIncludingVAT);
                        commission.VAT = GetValue(reader, FieldNames.VAT);

                        if (string.IsNullOrEmpty(commission.AmountIncludingVAT))
                        {
                            var amountExcludingVat = Convert.ToDecimal(GetValue(reader, FieldNames.AmountExcludingVAT));
                            if (string.IsNullOrEmpty(commission.VAT))
                                commission.VAT = Decimal.Round(amountExcludingVat * 0.15m, 2).ToString();

                            commission.AmountIncludingVAT = Decimal.Round(amountExcludingVat + Decimal.Parse(commission.VAT), 2).ToString();
                        }
                        else
                        {
                            if (string.IsNullOrEmpty(commission.VAT))
                            {
                                var amountIncludingVat = Decimal.Parse(commission.AmountIncludingVAT);
                                commission.VAT = Decimal.Round(amountIncludingVat - (amountIncludingVat / 1.15m), 2).ToString();
                            }
                        }

                        yield return commission;
                    }
                } while (reader.NextResult());
            }
        }

        private string GetValue(IExcelDataReader reader, FieldNames fieldName)
        {
            var index = GetFieldIndex(fieldName);
            return Utils.GetValue(reader, index);
        }

        private string GetDate(IExcelDataReader reader, FieldNames fieldName)
        {
            var index = GetFieldIndex(fieldName);
            return Utils.GetDate(reader, index);
        }

        private int? GetFieldIndex(FieldNames fieldName)
        {
            var name = Enum.GetName(typeof(FieldNames), fieldName);
            var field = _config.Fields.FirstOrDefault(f => f.Name == name);
            if (field == null)
                return null;
            return ExcelUtils.ColumnToIndex(field.Column);
        }

        private string GetCommissionTypeValue(IExcelDataReader reader, List<int> commissionTypeIndexes)
        {
            if (!commissionTypeIndexes.Any())
                return _config.CommissionTypes.DefaultCommissionTypeCode;

            var values = new List<string>();
            foreach (var index in commissionTypeIndexes)
                values.Add(Utils.GetValue(reader, index));

            return MappingTemplate.Format(values);
        }

        private string GetCommissionTypeCode(string commissionTypeValue)
        {
            var commissionType = _config.CommissionTypes.Types.FirstOrDefault(t => t.Value.IgnoreCaseEquals(commissionTypeValue));
            if (commissionType != null)
                return commissionType.CommissionTypeCode;

            return _config.CommissionTypes.DefaultCommissionTypeCode;
        }

        private List<int> GetCommissionIndexes()
        {
            var commissionTypeIndexes = new List<int>();

            if (string.IsNullOrEmpty(_config.CommissionTypes.MappingTemplate))
                return commissionTypeIndexes;

            return MappingTemplate.Parse(_config.CommissionTypes.MappingTemplate)
                .Select(c => ExcelUtils.ColumnToIndex(c))
                .ToList();
        }
    }
}