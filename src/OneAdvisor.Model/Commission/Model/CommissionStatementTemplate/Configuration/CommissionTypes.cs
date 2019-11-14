using System;
using System.Collections.Generic;
using System.Linq;

namespace OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration
{
    public class CommissionTypes
    {
        public static readonly string COMMISSION_TYPE_SEPARATOR = ";";
        public static readonly string GROUP_COMMISSION_TYPE = "GRP_CT";

        public CommissionTypes()
        {
            Types = new List<CommissionType>();
        }

        public string MappingTemplate { get; set; }
        public string DefaultCommissionTypeCode { get; set; }
        public List<CommissionType> Types { get; set; }
    }
}