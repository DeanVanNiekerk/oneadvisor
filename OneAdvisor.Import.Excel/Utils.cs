using System;
using ExcelDataReader;

namespace OneAdvisor.Import.Excel
{
    public class Utils
    {
        public static string GetValue(IExcelDataReader reader, int? index = null, bool? makeAbsolute = false)
        {
            if (index == null || index == -1 || index >= reader.FieldCount)
                return "";

            var value = reader.GetValue(index.Value);

            var stringValue = value != null ? value.ToString() : null;

            if (stringValue != null && makeAbsolute.HasValue && makeAbsolute.Value)
            {
                decimal d;
                var success = Decimal.TryParse(stringValue, out d);
                if (success)
                    stringValue = Math.Abs(d).ToString();
            }

            return stringValue;
        }

        public static string GetDate(IExcelDataReader reader, int? index)
        {
            if (index == null || index == -1 || index >= reader.FieldCount)
                return "";

            try
            {
                var value = reader.GetDateTime(index.Value);
                return value != null ? value.ToString("yyyy-MM-dd") : null;
            }
            catch
            {
                return GetValue(reader, index);
            }
        }
    }
}