using ExcelDataReader;
using OneAdvisor.Model;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using OneAdvisor.Model.Import.Excel;

namespace OneAdvisor.Import.Excel.Readers
{
    public class HeaderLocator
    {
        private Identifier _identifier;

        public HeaderLocator(Identifier identifier)
        {
            _identifier = identifier;

            HeaderColumnIndex = ExcelUtils.ColumnToIndex(_identifier.Column);

            Found = false || HeaderColumnIndex == -1;
        }

        public bool Found { get; set; }
        public int HeaderColumnIndex { get; set; }

        public void Check(IExcelDataReader reader)
        {
            var currentValue = Utils.GetValue(reader, HeaderColumnIndex);
            Found = _identifier.Value.IgnoreCaseEquals(currentValue);
        }
    }
}