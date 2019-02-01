using System;

namespace OneAdvisor.Model.Directory.Model.Lookup
{
    public class CommissionType
    {
        public Guid? Id { get; set; }
        public Guid? PolicyTypeId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
    }
}