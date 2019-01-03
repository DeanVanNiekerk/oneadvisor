using System.Collections.Generic;

namespace OneAdvisor.Model.Common
{
    public class Filter
    {
        public string FieldName { get; set; }
        public List<string> Values { get; set; }
    }
}