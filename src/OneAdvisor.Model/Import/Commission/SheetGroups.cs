
using System.Collections.Generic;

namespace OneAdvisor.Model.Import.Commission
{
    public class SheetGroups
    {
        public int SheetNumber { get; set; }
        public List<RowGroups> RowGroups { get; set; }
    }
}