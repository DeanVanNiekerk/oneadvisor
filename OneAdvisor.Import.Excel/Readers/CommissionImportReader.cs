using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ExcelDataReader;
using OneAdvisor.Model;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Helpers;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Import.Excel;
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
                var sheetNumber = 0;

                do
                {
                    //Increment the sheet number
                    sheetNumber++;

                    var sheet = _config.Sheets.FirstOrDefault(s => s.Position == sheetNumber);
                    if (sheet != null)
                        foreach (var commission in Read(reader, sheet))
                            yield return commission;

                } while (reader.NextResult());
            }
        }

        private IEnumerable<ImportCommission> Read(IExcelDataReader reader, Sheet sheet)
        {
            var config = sheet.Config;

            var headerColumnIndex = ExcelUtils.ColumnToIndex(config.HeaderIdentifier.Column);
            var headerFound = false || headerColumnIndex == -1;
            var commissionTypeIndexes = GetCommissionIndexes(config);

            while (reader.Read())
            {
                if (!headerFound)
                {
                    var currentValue = Utils.GetValue(reader, headerColumnIndex);
                    headerFound = config.HeaderIdentifier.Value.IgnoreCaseEquals(currentValue);
                    continue;
                }

                //Ignore row if any of the primary field values are empty
                var requiredFields = config.Fields.Where(f => Fields.PrimaryFieldNames().Any(p => p == f.Name));
                var anyMissingRequiredFields = requiredFields.Any(field =>
                {
                    var fieldValue = Utils.GetValue(reader, ExcelUtils.ColumnToIndex(field.Column));
                    return string.IsNullOrWhiteSpace(fieldValue);
                });

                if (anyMissingRequiredFields)
                    continue;

                var commission = new ImportCommission();

                commission.PolicyNumber = GetValue(reader, FieldNames.PolicyNumber, config).Replace(" ", "");

                var commissionTypeValue = GetCommissionTypeValue(reader, commissionTypeIndexes, config);
                commission.CommissionTypeValue = commissionTypeValue;
                commission.CommissionTypeCode = GetCommissionTypeCode(commissionTypeValue, config);

                commission.LastName = GetValue(reader, FieldNames.LastName, config);
                commission.DateOfBirth = GetDate(reader, FieldNames.DateOfBirth, config);
                commission.FirstName = GetValue(reader, FieldNames.FirstName, config);
                commission.IdNumber = GetValue(reader, FieldNames.IdNumber, config);
                commission.Initials = GetValue(reader, FieldNames.Initials, config);
                commission.FullName = GetValue(reader, FieldNames.FullName, config);
                commission.BrokerFullName = GetValue(reader, FieldNames.BrokerFullName, config);

                commission.AmountIncludingVAT = GetValue(reader, FieldNames.AmountIncludingVAT, config);
                commission.VAT = GetValue(reader, FieldNames.VAT, config);

                if (string.IsNullOrEmpty(commission.AmountIncludingVAT))
                {
                    var amountExcludingVat = Convert.ToDecimal(GetValue(reader, FieldNames.AmountExcludingVAT, config));
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
        }

        private string GetValue(IExcelDataReader reader, FieldNames fieldName, SheetConfig config)
        {
            var index = GetFieldIndex(fieldName, config);
            var absolute = IsFieldValueAbsolute(fieldName, config);
            return Utils.GetValue(reader, index, absolute);
        }

        private string GetDate(IExcelDataReader reader, FieldNames fieldName, SheetConfig config)
        {
            var index = GetFieldIndex(fieldName, config);
            return Utils.GetDate(reader, index);
        }

        private int? GetFieldIndex(FieldNames fieldName, SheetConfig config)
        {
            var name = Enum.GetName(typeof(FieldNames), fieldName);
            var field = config.Fields.FirstOrDefault(f => f.Name == name);
            if (field == null)
                return null;
            return ExcelUtils.ColumnToIndex(field.Column);
        }

        private bool IsFieldValueAbsolute(FieldNames fieldName, SheetConfig config)
        {
            var name = Enum.GetName(typeof(FieldNames), fieldName);
            var field = config.Fields.FirstOrDefault(f => f.Name == name);
            if (field == null)
                return false;
            return field.AbsoluteValue;
        }

        private string GetCommissionTypeValue(IExcelDataReader reader, List<int> commissionTypeIndexes, SheetConfig config)
        {
            if (!commissionTypeIndexes.Any())
                return config.CommissionTypes.DefaultCommissionTypeCode;

            var values = new List<string>();
            foreach (var index in commissionTypeIndexes)
                values.Add(Utils.GetValue(reader, index));

            return MappingTemplate.Format(values);
        }

        private string GetCommissionTypeCode(string commissionTypeValue, SheetConfig config)
        {
            var commissionType = config.CommissionTypes.Types.FirstOrDefault(t => t.Value.IgnoreCaseEquals(commissionTypeValue));
            if (commissionType != null)
                return commissionType.CommissionTypeCode;

            return config.CommissionTypes.DefaultCommissionTypeCode;
        }

        private List<int> GetCommissionIndexes(SheetConfig config)
        {
            var commissionTypeIndexes = new List<int>();

            if (string.IsNullOrEmpty(config.CommissionTypes.MappingTemplate))
                return commissionTypeIndexes;

            return MappingTemplate.Parse(config.CommissionTypes.MappingTemplate)
                .Select(c => ExcelUtils.ColumnToIndex(c))
                .ToList();
        }
    }
}