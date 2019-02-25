using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Member.Model.ImportMember;
using OneAdvisor.Model.Member.Model.Member;

namespace OneAdvisor.Model.Member.Interface
{
    public interface IMemberImportService
    {
        Task<Result> ImportMember(ScopeOptions scope, ImportMember data);
    }
}