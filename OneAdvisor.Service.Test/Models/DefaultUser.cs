using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Directory.Model.Auth;

namespace OneAdvisor.Service.Test.Models
{
    public class DefaultUser
    {
        public OktaUserEntity User { get; set; }
        public OrganisationEntity Organisation { get; set; }
        public BranchEntity Branch { get; set; }
    }
}