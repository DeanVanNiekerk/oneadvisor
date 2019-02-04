namespace OneAdvisor.Model.Common
{
    public enum SortDirection
    {
        Ascending,
        Descending
    }

    public class SortOptions
    {
        public SortOptions()
            : this(string.Empty, "asc")
        { }

        public SortOptions(string column, string direction)
        {
            direction = string.IsNullOrWhiteSpace(direction) ? "asc" : direction.ToLower();

            Direction = direction == "desc" || direction == "descending" ? SortDirection.Descending : SortDirection.Ascending;
            Column = column;
        }

        public SortDirection Direction { get; private set; }
        public string Column { get; private set; }
    }
}