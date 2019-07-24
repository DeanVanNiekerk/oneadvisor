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
using OneAdvisor.Model.Import.Commission;

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
            var groupLoader = new CommissionGroupLoader();
            var sheetGroups = groupLoader.Load(_config, stream);

            using (var reader = ExcelReaderFactory.CreateReader(stream))
            {
                var sheetNumber = 0;

                do
                {
                    //Increment the sheet number
                    sheetNumber++;

                    var sheet = _config.Sheets.FirstOrDefault(s => s.Position == sheetNumber);
                    if (sheet != null)
                        foreach (var commission in Read(reader, sheet, sheetGroups.FirstOrDefault(s => s.SheetNumber == sheetNumber)))
                            yield return commission;

                } while (reader.NextResult());
            }
        }

        private IEnumerable<ImportCommission> Read(IExcelDataReader reader, Sheet sheet, SheetGroups sheetGroups)
        {
            var config = sheet.Config;

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

                var groupValues = new List<GroupValue>();
                if (sheetGroups != null)
                    groupValues = sheetGroups.RowGroups.Single(r => r.RowNumber == rowNumber).GroupValues;

                //Continue if this is a section row
                if (groupValues.Any(v => !v.IsInherited))
                    continue;

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

                commission.PolicyNumber = GetValue(reader, FieldNames.PolicyNumber, config);

                var commissionTypeValue = GetCommissionTypeValue(reader, config, groupValues);
                commission.CommissionTypeValue = commissionTypeValue;
                commission.CommissionTypeCode = GetCommissionTypeCode(commissionTypeValue, config);

                commission.LastName = GetValue(reader, FieldNames.LastName, config);
                commission.DateOfBirth = GetDate(reader, FieldNames.DateOfBirth, config);
                commission.FirstName = GetValue(reader, FieldNames.FirstName, config);
                commission.IdNumber = GetValue(reader, FieldNames.IdNumber, config);
                commission.Initials = GetValue(reader, FieldNames.Initials, config);
                commission.FullName = GetValue(reader, FieldNames.FullName, config);
                commission.AmountIncludingVAT = GetValue(reader, FieldNames.AmountIncludingVAT, config);
                commission.VAT = GetValue(reader, FieldNames.VAT, config);

                var brokerFullName = GetGroupValue(groupValues, GroupFieldNames.BrokerFullName);
                if (string.IsNullOrEmpty(brokerFullName))
                    brokerFullName = GetValue(reader, FieldNames.BrokerFullName, config);

                commission.BrokerFullName = brokerFullName;

                if (string.IsNullOrEmpty(commission.AmountIncludingVAT))
                {
                    var amountExcludingVatString = GetValue(reader, FieldNames.AmountExcludingVAT, config);

                    var amountExcludingVat = 0m;
                    var success = Decimal.TryParse(amountExcludingVatString, out amountExcludingVat);

                    if (!success)
                        continue;

                    if (string.IsNullOrEmpty(commission.VAT))
                        commission.VAT = Decimal.Round(amountExcludingVat * 0.15m, 2).ToString();

                    commission.AmountIncludingVAT = Decimal.Round(amountExcludingVat + Decimal.Parse(commission.VAT), 2).ToString();
                }
                else
                {
                    if (string.IsNullOrEmpty(commission.VAT))
                    {
                        var amountIncludingVat = 0m;
                        var success = Decimal.TryParse(commission.AmountIncludingVAT, out amountIncludingVat);

                        if (!success)
                            continue;

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
            return Utils.GetValue(reader, index, absolute).TrimWhiteSpace();
        }

        public static string GetValue(IExcelDataReader reader, string column)
        {
            var index = ExcelUtils.ColumnToIndex(column);
            return Utils.GetValue(reader, index);
        }

        private string GetDate(IExcelDataReader reader, FieldNames fieldName, SheetConfig config)
        {
            var index = GetFieldIndex(fieldName, config);
            return Utils.GetDate(reader, index).TrimWhiteSpace();
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

        public static string GetCommissionTypeValue(IExcelDataReader reader, SheetConfig config, List<GroupValue> groupValues)
        {
            var parts = MappingTemplate.Parse(config.CommissionTypes.MappingTemplate);

            if (!parts.Any())
                return config.CommissionTypes.DefaultCommissionTypeCode;

            var values = new List<string>();

            foreach (var part in parts)
            {
                string value = "";
                if (part == CommissionTypes.GROUP_COMMISSION_TYPE)
                    value = GetGroupValue(groupValues, GroupFieldNames.CommissionType);
                else
                {
                    var column = MappingTemplate.GetColumn(part);
                    var subStringIndex = MappingTemplate.GetSubStringIndex(part);

                    var index = ExcelUtils.ColumnToIndex(column);
                    value = Utils.GetValue(reader, index);

                    if (subStringIndex.Count == 2)
                    {
                        try
                        {
                            var startIndex = subStringIndex[0] - 1;
                            var length = subStringIndex[1] - subStringIndex[0] + 1;
                            value = value.Substring(startIndex, length);
                        }
                        catch { }
                    }
                }

                values.Add(value);
            }

            return MappingTemplate.Format(values);
        }

        private string GetCommissionTypeCode(string commissionTypeValue, SheetConfig config)
        {
            var commissionType = config.CommissionTypes.Types.FirstOrDefault(t => t.Value.IgnoreCaseEquals(commissionTypeValue));
            if (commissionType != null)
                return commissionType.CommissionTypeCode;

            return config.CommissionTypes.DefaultCommissionTypeCode;
        }

        public static string GetGroupValue(List<GroupValue> groupValues, GroupFieldNames groupFieldName)
        {
            var groupValue = groupValues.FirstOrDefault(g => g.GroupFieldName == Enum.GetName(typeof(GroupFieldNames), groupFieldName));
            if (groupValue == null)
                return "";
            return groupValue.Value;
        }

    }
}