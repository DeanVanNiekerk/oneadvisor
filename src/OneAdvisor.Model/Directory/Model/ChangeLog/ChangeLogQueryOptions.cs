using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Directory.Model.ChangeLog
{
    public class ChangeLogQueryOptions : QueryOptionsBase<ChangeLog>
    {
        public ChangeLogQueryOptions(string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
         : base(sortColumn = "ReleaseDate", sortDirection = "desc", pageSize, pageNumber, filters)
        {
            var result = GetFilterValue<bool>("Published");
            if (result.Success)
                Published = result.Value;
        }

        public bool? Published { get; set; }
    }
}