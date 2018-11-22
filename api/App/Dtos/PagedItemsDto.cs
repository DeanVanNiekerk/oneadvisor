using System.Collections.Generic;

namespace api.App.Dtos
{
    public class PagedItemsDto<T>
    {
        public int TotalItems { get; set; }
        public IEnumerable<T> Items { get; set; }
    }
}