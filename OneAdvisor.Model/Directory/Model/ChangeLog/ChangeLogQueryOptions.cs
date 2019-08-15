using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Directory.Model.ChangeLog
{
    public class ChangeLogQueryOptions : QueryOptionsBase<ChangeLog>
    {
        public ChangeLogQueryOptions(string sortColumn, string sortDirection, int pageSize, int pageNumber)
         : base(sortColumn = "ReleaseDate", sortDirection = "desc", pageSize, pageNumber)
        { }
    }
}