using System;

namespace OneAdvisor.Model.Client.Model.Lookup
{
    public class PolicyTypeCharacteristic
    {
        public Guid? Id { get; set; }
        public Guid? PolicyTypeId { get; set; }
        public string Name { get; set; }
        public int? DisplayOrder { get; set; }
    }
}