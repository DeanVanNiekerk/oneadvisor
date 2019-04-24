using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Commission.Model.CommissionAllocation
{
    public class CommissionAllocationEdit
    {
        public CommissionAllocationEdit()
        {
            PolicyIds = new List<Guid>();
        }

        public Guid? Id { get; set; }
        public Guid? FromClientId { get; set; }
        public Guid? ToClientId { get; set; }
        public List<Guid> PolicyIds { get; set; }
    }
}