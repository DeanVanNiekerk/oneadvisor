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
using System.Text.RegularExpressions;

namespace OneAdvisor.Import.Excel.Readers
{
    public class CommissionImportReader : IImportReader<ImportCommission>
    {
        private Config _config;
        private decimal _vatRate;

        public CommissionImportReader(Config config, decimal vatRate)
        {
            _config = config;
            _vatRate = vatRate;
        }

        public IEnumerable<ImportCommission> Read(Stream stream)
        {
            var groupLoader = new CommissionGroupLoader();
            var sheetGroups = groupLoader.Load(_config, stream);

            var exchangeRateLoader = new ExchangeRateLoader();
            var sheetExchangeRates = exchangeRateLoader.Load(_config, stream);

            var reader = ExcelReaderFactory.CreateReader(stream);

            var sheetNumber = 0;

            do
            {
                //Increment the sheet number
                sheetNumber++;

                var sheet = _config.Sheets.FirstOrDefault(s => s.Position == sheetNumber);
                if (sheet != null)
                {
                    var sheetGroup = sheetGroups.FirstOrDefault(s => s.SheetNumber == sheetNumber);
                    var sheetExchangeRate = sheetExchangeRates.FirstOrDefault(s => s.SheetNumber == sheetNumber);

                    foreach (var commission in Read(reader, sheet, sheetGroup, sheetExchangeRate))
                        yield return commission;
                }

            } while (reader.NextResult());
        }

        private IEnumerable<ImportCommission> Read(IExcelDataReader reader, Sheet sheet, SheetGroups sheetGroups, SheetExchangeRates sheetExchangeRates)
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

                var vatRate = GetVATRate(reader, config, _vatRate);

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
                commission.Currency = GetValue(reader, FieldNames.Currency, config);
                commission.VAT = GetCurrency(reader, FieldNames.VAT, config, sheetExchangeRates.ExchangeRates);
                commission.AmountIncludingVAT = GetAmountIncludingVATValue(reader, config, sheetExchangeRates.ExchangeRates, commission.VAT, vatRate);

                var brokerFullName = GetGroupValue(groupValues, GroupFieldNames.BrokerFullName);
                if (string.IsNullOrWhiteSpace(brokerFullName))
                    brokerFullName = GetValue(reader, FieldNames.BrokerFullName, config);

                commission.BrokerFullName = brokerFullName;

                if (string.IsNullOrWhiteSpace(commission.VAT))
                {
                    var amountIncludingVat = 0m;
                    var success = Decimal.TryParse(commission.AmountIncludingVAT, out amountIncludingVat);

                    if (!success)
                        continue;

                    commission.VAT = Decimal.Round(amountIncludingVat - (amountIncludingVat / ((vatRate / 100m) + 1m)), 2).ToString();
                }

                commission.AmountIncludingVAT = Exchange(sheetExchangeRates.ExchangeRates, commission.Currency, commission.AmountIncludingVAT);
                commission.VAT = Exchange(sheetExchangeRates.ExchangeRates, commission.Currency, commission.VAT);

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

        private string GetCurrency(IExcelDataReader reader, FieldNames fieldName, SheetConfig config, List<ExchangeRate> exchangeRates)
        {
            var index = GetFieldIndex(fieldName, config);
            var value = GetValue(reader, fieldName, config);

            value = value.Replace("R", "");

            foreach (var exchangeRate in exchangeRates)
                value = value.Replace(exchangeRate.Currency, "");

            return value;
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

        private string GetAmountIncludingVATValue(IExcelDataReader reader, SheetConfig config, List<ExchangeRate> exchangeRates, string vat, decimal vatRate)
        {
            var amountIncludingVAT = GetCurrency(reader, FieldNames.AmountIncludingVAT, config, exchangeRates);
            var amountExcludingVAT = "";

            if (!string.IsNullOrWhiteSpace(config.AmountIdentifier.Column))
            {
                var index = ExcelUtils.ColumnToIndex(config.AmountIdentifier.Column);
                var amountIdentifier = Utils.GetValue(reader, index);

                var amount = GetCurrency(reader, FieldNames.Amount, config, exchangeRates);

                var match = Regex.Match(amountIdentifier, config.AmountIdentifier.Value);
                if (config.AmountIdentifier.Type == AmountIdentifier.AmountIdentifierTypeIncludingVat)
                {
                    if (match.Success)
                        amountIncludingVAT = amount;
                    else
                        amountExcludingVAT = amount;
                }
                else
                {
                    if (match.Success)
                        amountExcludingVAT = amount;
                    else
                        amountIncludingVAT = amount;
                }
            }

            if (string.IsNullOrWhiteSpace(amountIncludingVAT))
            {
                var amountExcludingVatString = !string.IsNullOrWhiteSpace(amountExcludingVAT) ? amountExcludingVAT : GetCurrency(reader, FieldNames.AmountExcludingVAT, config, exchangeRates);

                var amountExcludingVat = 0m;
                var success = Decimal.TryParse(amountExcludingVatString, out amountExcludingVat);

                if (!success)
                    return "";

                if (string.IsNullOrWhiteSpace(vat))
                    vat = Decimal.Round(amountExcludingVat * (vatRate / 100m), 2).ToString();

                amountIncludingVAT = Decimal.Round(amountExcludingVat + Decimal.Parse(vat), 2).ToString();
            }

            return amountIncludingVAT;
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

        private decimal GetVATRate(IExcelDataReader reader, SheetConfig config, decimal defaultVatRate)
        {
            if (!config.VatRates.Any())
                return defaultVatRate;

            foreach (var rate in config.VatRates)
            {
                var index = ExcelUtils.ColumnToIndex(rate.Column);
                var value = Utils.GetValue(reader, index).TrimWhiteSpace();

                if (value.IgnoreCaseEquals(rate.Value))
                    return rate.Rate;
            }

            return defaultVatRate;
        }

        public static string GetGroupValue(List<GroupValue> groupValues, GroupFieldNames groupFieldName)
        {
            var groupValue = groupValues.FirstOrDefault(g => g.GroupFieldName == Enum.GetName(typeof(GroupFieldNames), groupFieldName));
            if (groupValue == null)
                return "";
            return groupValue.Value;
        }

        public string Exchange(List<ExchangeRate> exchangeRates, string currency, string amount)
        {
            if (currency == null || amount == null)
                return amount;

            var rate = exchangeRates.FirstOrDefault(r => r.Currency.Trim() == currency.Trim());

            if (rate == null)
                return amount;

            return Decimal.Round(Decimal.Parse(amount) * rate.Rate, 2).ToString();
        }

    }
}