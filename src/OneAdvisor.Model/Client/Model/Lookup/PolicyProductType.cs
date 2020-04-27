using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Client.Model.Lookup
{
    public class PolicyProductType
    {
        public PolicyProductType()
        {
            PolicyTypeCharacteristics = new List<PolicyTypeCharacteristicDescription>();
        }

        public Guid? Id { get; set; }
        public Guid? PolicyTypeId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public IEnumerable<PolicyTypeCharacteristicDescription> PolicyTypeCharacteristics { get; set; }
    }
}