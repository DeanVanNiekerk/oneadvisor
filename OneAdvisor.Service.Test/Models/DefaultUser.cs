using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Directory.Model.Authentication;

namespace OneAdvisor.Service.Test.Models
{
    public class DefaultUser
    {
        public UserEntity User { get; set; }
        public OrganisationEntity Organisation { get; set; }
        public BranchEntity Branch { get; set; }
    }
}