using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Commission.Model.CommissionAllocation
{
    public class CommissionAllocation
    {
        public Guid Id { get; set; }
        public Guid FromClientId { get; set; }
        public Guid ToClientId { get; set; }
        public int PolicyIdCount { get; set; }

        public string FromClientFirstName { get; set; }
        public string FromClientLastName { get; set; }
    }
}