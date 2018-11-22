namespace OneAdvisor.Model.Common
{
    public enum SortDirection {
        Ascending,
        Descending
    }

    public class SortOptions
    {
        public SortOptions()
        {
            //Defaults
            Direction = SortDirection.Ascending;
            Column = string.Empty;
        }

        public SortDirection Direction { get; set; }
        public string Column { get; set; }
    }
}