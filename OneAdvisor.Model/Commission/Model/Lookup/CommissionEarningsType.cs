using System;

namespace OneAdvisor.Model.Commission.Model.Lookup
{
    public class CommissionEarningsType
    {
        public static readonly Guid EARNINGS_TYPE_ANNUAL_ANNUITY = new Guid("e8799015-6f4a-5d45-5be9-0fcd516e0951");
        public static readonly Guid EARNINGS_TYPE_MONTHLY_ANNUITY = new Guid("8b42edc0-fac6-e946-c779-9d90a805c294");
        public static readonly Guid EARNINGS_TYPE_ONCE_OFF = new Guid("9f8fc29d-0f1c-b952-d446-79cc3ed967d7");
        public static readonly Guid EARNINGS_TYPE_LIFE_FIRST_YEARS = new Guid("e7f98561-f018-3edd-2118-e3646c89e2a2");


        public Guid? Id { get; set; }
        public string Name { get; set; }
    }
}