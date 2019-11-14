using System;

namespace OneAdvisor.Model.Client.Model.Lookup
{
    public class PolicyProductType
    {
        public Guid? Id { get; set; }
        public Guid? PolicyTypeId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
    }
}