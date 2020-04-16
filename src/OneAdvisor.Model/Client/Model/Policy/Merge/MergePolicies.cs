using System;
using System.Collections.Generic;
using OneAdvisor.Model.Client.Model.Policy;

namespace OneAdvisor.Model.Client.Model.Policy.Merge
{
    public class MergePolicies
    {
        public MergePolicies()
        {
            SourcePolicyIds = new List<Guid>();
        }

        public PolicyEdit TargetPolicy { get; set; }
        public List<Guid> SourcePolicyIds { get; set; }
    }
}