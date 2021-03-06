using System;

namespace OneAdvisor.Model.Client.Model.Lookup
{
    public class PolicyType
    {
        public static readonly Guid POLICY_TYPE_INVESTMENT = new Guid("a98bb718-4acb-4fad-afe9-5fbba00203b9");
        public static readonly Guid POLICY_TYPE_LIFE_INSURANCE = new Guid("f3d877b4-1800-4711-8cc9-35169f8bd60b");
        public static readonly Guid POLICY_TYPE_SHORT_TERM = new Guid("a90a5869-4da5-4cce-8973-9a8194c2bdcb");
        public static readonly Guid POLICY_TYPE_MEDICAL_COVER = new Guid("023107f5-97a6-456d-9182-7bbda72ca82a");
        public static readonly Guid POLICY_TYPE_REWARDS = new Guid("3d991459-2043-46b9-9357-5446a993b81d");

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
    }
}