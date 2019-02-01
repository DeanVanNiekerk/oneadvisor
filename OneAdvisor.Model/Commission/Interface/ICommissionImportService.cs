using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionImportService
    {
        Task<Result> ImportCommission(ScopeOptions scope, ImportCommission data);
    }
}