using System;

namespace OneAdvisor.Model.Client.Model.Lookup
{
    public class ClientType
    {
        public static readonly Guid CLIENT_TYPE_INDIVIDUAL = new Guid("27bb22b3-4c3d-41a3-48bf-690a98f8f780");
        public static readonly Guid CLIENT_TYPE_UNKNOWN_ENTITY = new Guid("bc0b4043-25cc-dbb6-cfd5-981557a10ca1");

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
    }
}