using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using ExcelDataReader;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using OneAdvisor.Model.Import.Commission;

namespace OneAdvisor.Import.Excel.Readers
{
    //WARNING: SERIOUS DO_MAGIC() IN HERE: enter at own peril...

    public class CommissionGroupLoader
    {
        public List<SheetGroups> Load(Config config, Stream stream)
        {
            var sheetGroups = new List<SheetGroups>();

            if (!config.Sheets.Any(s => s.Config.Groups.Any()))
                return sheetGroups;

            var reader = ExcelReaderFactory.CreateReader(stream);
            var sheetNumber = 0;

            do
            {
                //Increment the sheet number
                sheetNumber++;

                var sheet = config.Sheets.FirstOrDefault(s => s.Position == sheetNumber);

                if (sheet != null)
                {
                    var sheetGroup = GetSheetGroups(reader, sheet.Config, sheetNumber);
                    sheetGroup = ApplyCascade(sheetGroup, sheet.Config);
                    sheetGroups.Add(sheetGroup);
                }

            } while (reader.NextResult());

            return sheetGroups;
        }

        public SheetGroups LoadForSheet(Sheet sheet, Stream stream)
        {
            if (!sheet.Config.Groups.Any())
                return null;

            var reader = ExcelReaderFactory.CreateReader(stream);

            var sheetNumber = 0;

            do
            {
                //Increment the sheet number
                sheetNumber++;

                if (sheet != null)
                {
                    var sheetGroup = GetSheetGroups(reader, sheet.Config, sheetNumber);
                    return ApplyCascade(sheetGroup, sheet.Config);
                }

            } while (reader.NextResult());

            return null;
        }

        private SheetGroups GetSheetGroups(IExcelDataReader reader, SheetConfig config, int sheetNumber)
        {
            var sheetGroups = new SheetGroups()
            {
                SheetNumber = sheetNumber,
                RowGroups = new List<RowGroups>()
            };

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

                var rowGroups = new RowGroups(rowNumber);

                //Check groupings
                int hierarchyOrder = 0;
                foreach (var group in config.Groups)
                {
                    hierarchyOrder++;

                    var groupValue = new GroupValue(group.FieldName, hierarchyOrder);

                    //Check for match
                    var isMatch = true;
                    foreach (var identifier in group.Identifiers)
                    {
                        var value = CommissionImportReader.GetValue(reader, identifier.Column) ?? "";
                        if (Regex.Matches(value, identifier.Value).Count == 0)
                            isMatch = false;
                    }

                    if (isMatch)
                    {
                        var value = CommissionImportReader.GetValue(reader, group.Column) ?? "";

                        if (!string.IsNullOrEmpty(group.Formatter))
                        {
                            var match = Regex.Match(value, group.Formatter);
                            if (match.Success)
                                value = match.Value;
                        }

                        groupValue.Value = value;
                        groupValue.IsInherited = false;
                    }

                    rowGroups.GroupValues.Add(groupValue);
                }

                sheetGroups.RowGroups.Add(rowGroups);

            };

            return sheetGroups;
        }

        private SheetGroups ApplyCascade(SheetGroups sheetGroup, SheetConfig config)
        {
            List<GroupValue> lastGroupValues = null;

            foreach (var group in config.Groups)
            {
                var rows = sheetGroup.RowGroups.ToList();
                if (group.ReverseOrder)
                    rows.Reverse();

                foreach (var rowGroups in rows)
                {
                    foreach (var groupValue in rowGroups.GroupValues.Where(g => g.GroupFieldName == group.FieldName))
                    {
                        if (lastGroupValues == null)
                            continue;

                        if (!groupValue.IsInherited)
                            continue;

                        var shouldClear = lastGroupValues.Any(g =>
                            //If last section has a row that
                            g.IsInherited == false //is a section row
                            && g.GroupFieldName != groupValue.GroupFieldName //and is different from current section
                            && g.HierarchyOrder < groupValue.HierarchyOrder //and the hierarchy is less (further up) than current section
                        );

                        //Inherit from previous value
                        if (shouldClear)
                            groupValue.Value = "";
                        else
                            groupValue.Value = lastGroupValues.Find(g => g.GroupFieldName == groupValue.GroupFieldName).Value;
                    }

                    lastGroupValues = rowGroups.GroupValues;
                }

            }

            return sheetGroup;
        }

    }
}