using System;

namespace OneAdvisor.Model.Client.Model.Lookup
{
    public class PolicyProduct
    {
        public Guid? Id { get; set; }
        public Guid? PolicyProductTypeId { get; set; }
        public Guid? CompanyId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
    }
}