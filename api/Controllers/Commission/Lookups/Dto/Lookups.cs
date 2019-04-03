using System.Collections.Generic;
using OneAdvisor.Model.Commission.Model.Lookup;

namespace api.Controllers.Commission.Lookups.Dto
{
    public class Lookups
    {
        public List<CommissionType> CommissionTypes { get; set; }
        public List<CommissionStatementTemplateFieldName> CommissionStatementTemplateFieldNames { get; set; }
        public List<CommissionEarningsType> CommissionEarningsTypes { get; set; }
    }
}