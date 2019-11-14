using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Client.Model.ImportClient;
using OneAdvisor.Model.Client.Model.Client;

namespace OneAdvisor.Model.Client.Interface
{
    public interface IClientImportService
    {
        Task<Result> ImportClient(ScopeOptions scope, ImportClient data);
    }
}