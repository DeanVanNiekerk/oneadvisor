using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Common
{
    public abstract class QueryOptionsBase
    {
        public QueryOptionsBase(int pageSize, int pageNumber)
        {
            SortOptions = new SortOptions();
            PageOptions = new PageOptions(pageSize, pageNumber);
        }

        public SortOptions SortOptions { get; private set; }        
        public PageOptions PageOptions { get; private set; } 
    }
}