using System.Collections.Generic;

namespace OneAdvisor.Model.Common
{
    public class PagedItems<T>
    {
        public int TotalItems { get; set; }
        public IEnumerable<T> Items { get; set; }
    }
}