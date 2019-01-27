using System;

namespace OneAdvisor.Model.Directory.Model.Lookup
{
    public class ContactType
    {
        public static readonly Guid CONTACT_TYPE_EMAIL = new Guid("b3c261d0-4e1d-4dd8-b944-6d6afd1795e0");
        public static readonly Guid CONTACT_TYPE_CELLPHONE = new Guid("d6349e22-3e27-404a-8584-58e420510834");

        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}