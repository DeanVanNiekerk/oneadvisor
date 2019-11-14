using System;

namespace OneAdvisor.Model.Commission.Model.CommissionSplitRulePolicy
{
    public class CommissionSplitRulePolicyInfo
    {
        public Guid PolicyId { get; set; }
        public string PolicyNumber { get; set; }
        public Guid PolicyCompanyId { get; set; }
        public Guid PolicyUserId { get; set; }
        public Guid PolicyClientId { get; set; }
        public string PolicyClientFirstName { get; set; }
        public string PolicyClientLastName { get; set; }
        public Guid? DefaultCommissionSplitRuleId { get; set; }
        public string DefaultCommissionSplitRuleName { get; set; }
        public Guid? CommissionSplitRuleId { get; set; }
        public string CommissionSplitRuleName { get; set; }
    }
}