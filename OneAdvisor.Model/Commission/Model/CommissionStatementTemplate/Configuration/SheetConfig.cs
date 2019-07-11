using System.Collections.Generic;

namespace OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration
{
    public class SheetConfig
    {
        public SheetConfig()
        {
            HeaderIdentifier = new Identifier();
            Fields = new List<Field>();
            CommissionTypes = new CommissionTypes();
            Groups = new List<Group>();
        }

        public Identifier HeaderIdentifier { get; set; }
        public IEnumerable<Field> Fields { get; set; }
        public CommissionTypes CommissionTypes { get; set; }
        public IEnumerable<Group> Groups { get; set; }
    }
}