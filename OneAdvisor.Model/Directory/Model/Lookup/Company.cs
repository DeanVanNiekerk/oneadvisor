using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Directory.Model.Lookup
{
    public class Company
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<string> CommissionPolicyNumberPrefixes { get; set; }
    }
}