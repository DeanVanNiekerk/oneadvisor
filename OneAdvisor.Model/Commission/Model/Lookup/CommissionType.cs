using System;

namespace OneAdvisor.Model.Commission.Model.Lookup
{
    public class CommissionType
    {
        public static readonly Guid COMMISSION_TYPE_UNKNOWN = new Guid("7216609a-9f0b-4c74-9c50-b4c5377b72d6");

        public Guid? Id { get; set; }
        public Guid? PolicyTypeId { get; set; }
        public Guid? CommissionEarningsTypeId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
    }
}