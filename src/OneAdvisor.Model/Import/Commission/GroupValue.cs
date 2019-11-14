
namespace OneAdvisor.Model.Import.Commission
{
    public class GroupValue
    {
        public GroupValue(string groupFieldName, int hierarchyOrder)
        {
            IsInherited = true;
            GroupFieldName = groupFieldName;
            HierarchyOrder = hierarchyOrder;
        }

        public string GroupFieldName { get; set; }
        public string Value { get; set; }
        public bool IsInherited { get; set; }
        public int HierarchyOrder { get; set; }
    }
}