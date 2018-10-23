using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.Serialization.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using OneAdvisor.Model.Directory.Interface.Repository;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Repository.Okta.Repository.Dto;

namespace OneAdvisor.Repository.Okta.Repository
{
    public class UserRepository : IUserRepository
    {
        public UserRepository(IOptions<OktaSettings> options)
        {
            Settings = options.Value;
        }

        private OktaSettings Settings { get; }

        public async Task<IEnumerable<UserInfo>> GetUsers()
        {
            var httpClient = new HttpClient();

            httpClient.BaseAddress = new Uri(Settings.BaseApi);
            httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
            httpClient.DefaultRequestHeaders.Add("Authorization", $"SSWS {Settings.ApiKey}");

            var serializer = new DataContractJsonSerializer(typeof(List<UserInfoDto>));

            var streamTask = httpClient.GetStreamAsync("api/v1/users?limit=25");
            var userInfoDtos = serializer.ReadObject(await streamTask) as List<UserInfoDto>;

            return userInfoDtos.Select(u => new UserInfo() {
                Id = u.id,
                FirstName  = u.profile.firstName,
                LastName  = u.profile.lastName,
            });
        }
    }
}
