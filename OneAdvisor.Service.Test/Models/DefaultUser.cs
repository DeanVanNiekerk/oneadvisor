using OneAdvisor.Data.Entities.Directory;

namespace OneAdvisor.Service.Test.Models
{
    public class DefaultUser
    {
        public UserEntity User { get; set; }
        public OrganisationEntity Organisation { get; set; }
        public BranchEntity Branch { get; set; }
    }
}