

using api.Controllers.Directory.Users.Dto;
using AutoMapper;
using OneAdvisor.Model.Directory.Model.User;

namespace api.Controllers.Directory
{
    public class Mappings
    {
        public static void Configure(IMapperConfigurationExpression config)
        {
            config.CreateMap<UserInfo, UserInfoDto>();
            config.CreateMap<User, UserDto>();
        }
       
    }
}