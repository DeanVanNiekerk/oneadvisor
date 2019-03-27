using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Client.Model.Lookup;

namespace OneAdvisor.Model.Client.Interface
{
    public interface IClientLookupService
    {
        Task<List<ContactType>> GetContactTypes();
        Task<List<MarritalStatus>> GetMarritalStatus();
        Task<List<PolicyType>> GetPolicyTypes();
        Task<List<ClientType>> GetClientTypes();
    }
}