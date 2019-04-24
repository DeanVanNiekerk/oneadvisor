using System;

namespace OneAdvisor.Model.Commission.Model.CommissionAllocation
{
    public class CommissionAllocationEdit
    {
        public Guid? Id { get; set; }
        public Guid? FromClientId { get; set; }
        public Guid? ToClientId { get; set; }
    }
}