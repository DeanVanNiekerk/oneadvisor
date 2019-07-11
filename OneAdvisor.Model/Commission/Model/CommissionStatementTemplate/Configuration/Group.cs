using System.Collections.Generic;

namespace OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration
{
    public enum GroupFieldNames
    {
        BrokerFullName,
        CommissionType,
    }

    public class Group
    {
        public Group()
        {
            Identifiers = new List<Identifier>();
        }

        public string FieldName { get; set; }
        public string Column { get; set; }
        public string Formatter { get; set; }
        public IEnumerable<Identifier> Identifiers { get; set; }
    }
}