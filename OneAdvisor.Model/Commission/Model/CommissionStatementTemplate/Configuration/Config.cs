using System.Collections.Generic;

namespace OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration
{
    public class Config
    {
        public Config()
        {
            DataStart = new DataStart();
            Fields = new List<Field>();
            CommissionTypes = new CommissionTypes();
        }

        public DataStart DataStart { get; set; }
        public IEnumerable<Field> Fields { get; set; }
        public CommissionTypes CommissionTypes { get; set; }
    }
}