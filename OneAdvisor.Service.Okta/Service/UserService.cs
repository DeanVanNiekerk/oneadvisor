using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.Serialization.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Okta.Service.Dto;

namespace OneAdvisor.Service.Okta.Service
{
    public class UserService : IUserService
    {
        public UserService(IOptions<OktaSettings> options)
        {
            HttpClient = Utils.GetHttpClient(options.Value);
        }

        public HttpClient HttpClient { get; set; }

        public async Task<IEnumerable<UserInfo>> GetUsers()
        {
            var serializer = new DataContractJsonSerializer(typeof(List<UserInfoDto>));

            var streamTask = HttpClient.GetStreamAsync("api/v1/users?limit=25");
            var userInfoDtos = serializer.ReadObject(await streamTask) as List<UserInfoDto>;

            return userInfoDtos.Select(dto => new UserInfo() {
                Id = dto.id,
                FirstName = dto.profile.firstName,
                LastName = dto.profile.lastName,
                LastLogin = Utils.ParseDate(dto.lastLogin),
                LastUpdated = Utils.ParseDate(dto.lastUpdated),
                Status = dto.status,
                Activated = Utils.ParseDate(dto.activated),
                OrganisationId = Guid.Parse(dto.profile.organization)
            });
        }

        public async Task<User> GetUser(string id)
        {
            var serializer = new DataContractJsonSerializer(typeof(UserInfoDto));

            var streamTask = HttpClient.GetStreamAsync($"api/v1/users/{id}");
            var userInfoDto = serializer.ReadObject(await streamTask) as UserInfoDto;

            return new User() {
                Id = userInfoDto.id,
                FirstName = userInfoDto.profile.firstName,
                LastName = userInfoDto.profile.lastName,
            };
        }

        public async Task<Result> UpdateUser(User user)
        {
            var result = new Result();

            //TODO: validation

            var dto = MapModelToDto(user);

            var json = Utils.FormatObject(dto);

            var response = await HttpClient.PostAsync($"api/v1/users/{user.Id}", json);
            
            return result;
        }

        private ProfileInfoDto MapModelToDto(User model)
        {
            return new ProfileInfoDto() {
                firstName = model.FirstName,
                lastName = model.LastName,
            };
        }
    }
}
