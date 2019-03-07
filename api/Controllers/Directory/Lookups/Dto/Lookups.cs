using System.Collections.Generic;
using OneAdvisor.Model.Directory.Model.Lookup;

namespace api.Controllers.Directory.Lookups.Dto
{
    public class Lookups
    {
        public List<Company> Companies { get; set; }
        public List<CommissionType> CommissionTypes { get; set; }
        public List<CommissionEarningsType> CommissionEarningsTypes { get; set; }
        public List<ContactType> ContactTypes { get; set; }
        public List<PolicyType> PolicyTypes { get; set; }
        public List<MarritalStatus> MarritalStatus { get; set; }
        public List<CommissionStatementTemplateFieldName> CommissionStatementTemplateFieldNames { get; set; }
    }
}