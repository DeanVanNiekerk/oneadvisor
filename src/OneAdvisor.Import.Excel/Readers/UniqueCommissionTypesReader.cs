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
    public class UniqueCommissionTypesReader : IImportReader<string>
    {
        private Sheet _sheet;

        public UniqueCommissionTypesReader(Sheet sheet)
        {
            _sheet = sheet;
        }

        public IEnumerable<string> Read(Stream stream)
        {
            var groupLoader = new CommissionGroupLoader();
            var sheetGroups = groupLoader.LoadForSheet(_sheet, stream);

            var commissionTypes = new List<string>();

            using (var reader = ExcelReaderFactory.CreateReader(stream))
            {
                var sheetNumber = 0;

                do
                {
                    //Increment the sheet number
                    sheetNumber++;

                    if (_sheet.Position != sheetNumber)
                        continue;

                    var rowNumber = 0;
                    var header = new HeaderLocator(_sheet.Config.HeaderIdentifier);

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

                        //Ignore row if any of the primary field values are empty
                        var requiredFields = _sheet.Config.Fields.Where(f => Fields.PrimaryFieldNames().Any(p => p == f.Name));
                        var anyMissingRequiredFields = requiredFields.Any(field =>
                        {
                            var fieldValue = Utils.GetValue(reader, ExcelUtils.ColumnToIndex(field.Column));
                            return string.IsNullOrWhiteSpace(fieldValue);
                        });

                        if (anyMissingRequiredFields)
                            continue;

                        var value = CommissionImportReader.GetCommissionTypeValue(reader, _sheet.Config, groupValues);

                        commissionTypes.Add(value);
                    }
                } while (reader.NextResult());
            }

            return commissionTypes.Distinct().ToList();
        }

        private List<int> GetCommissionIndexes()
        {
            var commissionTypeIndexes = new List<int>();

            if (string.IsNullOrEmpty(_sheet.Config.CommissionTypes.MappingTemplate))
                return commissionTypeIndexes;

            return MappingTemplate.Parse(_sheet.Config.CommissionTypes.MappingTemplate)
                .Select(c => ExcelUtils.ColumnToIndex(c))
                .ToList();
        }

    }
}