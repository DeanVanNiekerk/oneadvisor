using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.Serialization.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Okta.Service.Dto;

namespace OneAdvisor.Service.Okta.Service
{
    public class UserService : IUserService
    {
        public UserService(IOptions<OktaSettings> options)
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
                FirstName = u.profile.firstName,
                LastName = u.profile.lastName,
                LastLogin = Utils.ParseDate(u.lastLogin),
                LastUpdated = Utils.ParseDate(u.lastUpdated),
                Status = u.status,
                Activated = Utils.ParseDate(u.activated),
                OrganisationId = Guid.Parse(u.profile.organization)
            });
        }
    }
}
