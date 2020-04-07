using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Directory.Model.User.Configuration
{
    public class Config
    {
        public Config()
        {
            AdviceScopeIds = new List<Guid>();
            LicenseCategoryIds = new List<Guid>();
        }

        public List<Guid> AdviceScopeIds { get; set; }
        public List<Guid> LicenseCategoryIds { get; set; }
    }
}