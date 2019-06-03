using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Commission.Model.CommissionSplitRule
{
    public class CommissionSplitRule
    {
        public CommissionSplitRule()
        {
            Split = new List<CommissionSplit>();
        }

        public Guid? Id { get; set; }
        public Guid? UserId { get; set; }
        public string Name { get; set; }
        public bool IsDefault { get; set; }

        public List<CommissionSplit> Split { get; set; }
    }
}