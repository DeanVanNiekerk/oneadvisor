using api.Controllers.Member.Contacts.Dto;
using api.Controllers.Member.Import.Dto;
using api.Controllers.Member.Members.Dto;
using api.Controllers.Member.Policies.Dto;
using AutoMapper;
using OneAdvisor.Model.Member.Model.Contact;
using OneAdvisor.Model.Member.Model.ImportMember;
using OneAdvisor.Model.Member.Model.Member;
using OneAdvisor.Model.Member.Model.Policy;

namespace api.Controllers.Member
{
    public class Mappings
    {
        public static void Configure(IMapperConfigurationExpression config)
        {
            config.CreateMap<OneAdvisor.Model.Member.Model.Member.Member, MemberDto>();
            config.CreateMap<MemberEdit, MemberEditDto>();
            config.CreateMap<MemberPreview, MemberPreviewDto>();

            config.CreateMap<Policy, PolicyDto>();
            config.CreateMap<PolicyEdit, PolicyEditDto>();

            config.CreateMap<Contact, ContactDto>();

            config.CreateMap<ImportMember, ImportMemberDto>();
        }
    }
}