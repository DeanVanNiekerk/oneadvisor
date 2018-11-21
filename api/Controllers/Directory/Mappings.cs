

using api.Controllers.Directory.Organisations.Dto;
using api.Controllers.Directory.Users.Dto;
using AutoMapper;
using OneAdvisor.Model.Directory.Model.Organisation;
using OneAdvisor.Model.Directory.Model.User;

namespace api.Controllers.Directory
{
    public class Mappings
    {
        public static void Configure(IMapperConfigurationExpression config)
        {
            config.CreateMap<Organisation, OrganisationDto>();

            config.CreateMap<User, UserDto>();
        }
       
    }
}