using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Client.Model.Client;
using OneAdvisor.Model.Client.Model.Client.Merge;

namespace OneAdvisor.Model.Client.Interface
{
    public interface IClientService
    {
        Task<PagedItems<Model.Client.Client>> GetClients(ClientQueryOptions queryOptions);
        Task<ClientEdit> GetClient(ScopeOptions scope, Guid id);
        Task<ClientPreview> GetClientPreview(ScopeOptions scope, Guid id);
        Task<Result> DeleteClient(ScopeOptions scope, Guid clientId);
        Task<Result> UpdateClient(ScopeOptions scope, ClientEdit client);
        Task<Result> InsertClient(ScopeOptions scope, ClientEdit client);
        Task<Result> MergeClients(ScopeOptions scope, MergeClients merge);
    }
}