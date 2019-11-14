using System.Collections.Generic;

namespace OneAdvisor.Model.Import.Commission
{
    public class RowGroups
    {
        public RowGroups(int rowNumber)
        {
            RowNumber = rowNumber;
            GroupValues = new List<GroupValue>();
        }

        public int RowNumber { get; set; }
        public List<GroupValue> GroupValues { get; set; }
    }
}