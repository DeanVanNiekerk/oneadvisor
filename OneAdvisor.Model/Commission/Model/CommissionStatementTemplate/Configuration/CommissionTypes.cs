using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration
{
    public class CommissionTypes
    {
        public static readonly string COMMISSION_TYPE_SEPARATOR = ";";

        public CommissionTypes()
        {
            Types = new List<CommissionType>();
        }

        public string MappingTemplate { get; set; }
        public Guid? DefaultCommissionTypeId { get; set; }
        public List<CommissionType> Types { get; set; }
    }
}