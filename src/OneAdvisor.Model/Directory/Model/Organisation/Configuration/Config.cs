using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Directory.Model.Organisation.Configuration
{
    public class Config
    {
        public Config()
        {
            CompanyIds = new List<Guid>();
        }

        public List<Guid> CompanyIds { get; set; }
    }
}