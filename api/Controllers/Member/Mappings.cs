using api.Controllers.Directory.Members.Dto;
using AutoMapper;
using OneAdvisor.Model.Member.Model.Member;

namespace api.Controllers.Member
{
    public class Mappings
    {
        public static void Configure(IMapperConfigurationExpression config)
        {
            config.CreateMap<OneAdvisor.Model.Member.Model.Member.Member, MemberDto>();
            config.CreateMap<MemberEdit, MemberEditDto>();
        }
    }
}