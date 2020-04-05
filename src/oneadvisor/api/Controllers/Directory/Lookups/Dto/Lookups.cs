using System.Collections.Generic;
using OneAdvisor.Model.Directory.Model.Lookup;

namespace api.Controllers.Directory.Lookups.Dto
{
    public class Lookups
    {
        public List<Company> Companies { get; set; }
        public List<AdviceScope> AdviceScopes { get; set; }
        public List<AdviceService> AdviceServices { get; set; }
        public List<LicenseCategory> LicenseCategories { get; set; }
        public List<UserType> UserTypes { get; set; }
    }
}