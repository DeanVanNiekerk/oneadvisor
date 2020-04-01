using System;

namespace OneAdvisor.Model.Directory.Model.Application
{
    public class Application
    {
        public static readonly Guid DIRECTORY_ID = Guid.Parse("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9");
        public static readonly Guid CLIENT_ID = Guid.Parse("605ea52c-3627-48e2-8f7c-4819c5ea555b");
        public static readonly Guid COMMISSION_ID = Guid.Parse("2fca4500-9142-4940-aaf4-b18925c96d66");
        public static readonly Guid COMPLIANCE_ID = Guid.Parse("ef1bb77d-981a-743f-9543-ec36f396536c");
        public static readonly Guid INVEST_ID = Guid.Parse("ca35b7ac-351a-0ff1-5d45-9bee6de9e051");

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ColourHex { get; set; }
    }
}