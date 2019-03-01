using ExcelDataReader;

namespace OneAdvisor.Import.Excel
{
    public class Utils
    {
        public static string GetValue(IExcelDataReader reader, int? index)
        {
            if (index == null || index == -1 || index >= reader.FieldCount)
                return "";

            var value = reader.GetValue(index.Value);
            return value != null ? value.ToString() : null;
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