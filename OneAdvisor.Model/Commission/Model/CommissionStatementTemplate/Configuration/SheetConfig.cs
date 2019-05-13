using System.Collections.Generic;

namespace OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration
{
    public class SheetConfig
    {
        public SheetConfig()
        {
            HeaderIdentifier = new HeaderIdentifier();
            Fields = new List<Field>();
            CommissionTypes = new CommissionTypes();
        }

        public HeaderIdentifier HeaderIdentifier { get; set; }
        public IEnumerable<Field> Fields { get; set; }
        public CommissionTypes CommissionTypes { get; set; }
    }
}