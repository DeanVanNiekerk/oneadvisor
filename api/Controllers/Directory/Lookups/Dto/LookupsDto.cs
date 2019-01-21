using System.Collections.Generic;

namespace api.Controllers.Directory.Lookups.Dto
{
    public class LookupsDto
    {
        public List<CompanyDto> Companies { get; set; }
        public List<CommissionTypeDto> CommissionTypes { get; set; }
    }
}