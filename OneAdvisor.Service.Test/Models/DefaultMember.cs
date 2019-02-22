using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model.Directory.Model.Authentication;

namespace OneAdvisor.Service.Test.Models
{
    public class DefaultMember
    {
        public OrganisationEntity Organisation { get; set; }
        public MemberEntity Member { get; set; }
    }
}