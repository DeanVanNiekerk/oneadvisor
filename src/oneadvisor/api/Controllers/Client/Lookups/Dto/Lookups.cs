using System.Collections.Generic;
using OneAdvisor.Model.Client.Model.Lookup;

namespace api.Controllers.Client.Lookups.Dto
{
    public class Lookups
    {
        public List<ContactType> ContactTypes { get; set; }
        public List<ClientType> ClientTypes { get; set; }
        public List<MarritalStatus> MarritalStatus { get; set; }
        public List<PolicyType> PolicyTypes { get; set; }
        public List<PolicyProductType> PolicyProductTypes { get; set; }
        public List<PolicyProduct> PolicyProducts { get; set; }
    }
}