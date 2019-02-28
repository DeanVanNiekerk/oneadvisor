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
    public class UniqueCommissionTypesReader : IImportReader<string>
    {
        private Config _config;

        public UniqueCommissionTypesReader(Config config)
        {
            _config = config;
        }

        public IEnumerable<string> Read(Stream stream)
        {
            var commissionTypes = new List<string>();

            using (var reader = ExcelReaderFactory.CreateReader(stream))
            {
                var headerFound = false;
                var headerColumnIndex = ExcelUtils.ColumnToIndex(_config.HeaderIdentifier.Column);
                var commissionTypeIndexes = MappingTemplate.Parse(_config.CommissionTypes.MappingTemplate)
                                                .Select(c => ExcelUtils.ColumnToIndex(c))
                                                .ToList();
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
                        foreach (var field in requiredFields)
                        {
                            var fieldValue = Utils.GetValue(reader, ExcelUtils.ColumnToIndex(field.Column));
                            if (string.IsNullOrWhiteSpace(fieldValue))
                                continue;
                        }

                        var values = new List<string>();
                        foreach (var index in commissionTypeIndexes)
                            values.Add(Utils.GetValue(reader, index));

                        var value = MappingTemplate.Format(values);

                        commissionTypes.Add(value.ToLower());
                    }
                } while (reader.NextResult());
            }

            return commissionTypes.Distinct().ToList();
        }

    }
}