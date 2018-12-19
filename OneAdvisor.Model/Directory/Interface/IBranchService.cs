using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Branch;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IBranchService
    {
        Task<PagedItems<Branch>> GetBranches(BranchQueryOptions queryOptions);
        Task<Result> UpdateBranch(Branch branch);
        Task<Result> InsertBranch(Branch branch);
    }
}
