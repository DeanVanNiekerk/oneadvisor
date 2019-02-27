using System.Collections.Generic;

namespace OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration
{
    public class Config
    {
        public Config()
        {
            Fields = new List<Field>();
        }

        public DataStart DataStart { get; set; }
        public IEnumerable<Field> Fields { get; set; }
        public CommissionTypes CommissionTypes { get; set; }
    }
}