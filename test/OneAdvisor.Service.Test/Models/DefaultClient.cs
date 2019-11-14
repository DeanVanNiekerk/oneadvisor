using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Service.Test.Models
{
    public class DefaultClient
    {
        public OrganisationEntity Organisation { get; set; }
        public ClientEntity Client { get; set; }
    }
}