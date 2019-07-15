using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Branch;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IBranchService
    {
        Task<PagedItems<Branch>> GetBranches(BranchQueryOptions queryOptions);
        Task<Branch> GetBranch(ScopeOptions scope, Guid branchId);
        Task<Result> UpdateBranch(ScopeOptions scope, Branch branch);
        Task<Result> InsertBranch(ScopeOptions scope, Branch branch);
        Task<List<BranchSimple>> GetBranchesSimple(ScopeOptions scope);
    }
}
