using System.Text.RegularExpressions;

namespace OneAdvisor.Service.Common.Validation
{
    public class Utils
    {
        public static bool IsValidExcelColumn(string column)
        {
            var regex = new Regex(@"^[a-zA-Z]{1,3}$");
            return regex.IsMatch(column ?? "");
        }
    }
}