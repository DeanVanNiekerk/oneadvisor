using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Directory.Model.ChangeLog
{
    public class ChangeLogQueryOptions : QueryOptionsBase<ChangeLog>
    {
        public ChangeLogQueryOptions()
         : base("ReleaseDate", "desc", 0, 0)
        { }
    }
}