using System.Collections.Generic;

namespace OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration
{
    public class Config
    {
        public Config()
        {
            Sheets = new List<Sheet>();
        }

        public IEnumerable<Sheet> Sheets { get; set; }
    }
}