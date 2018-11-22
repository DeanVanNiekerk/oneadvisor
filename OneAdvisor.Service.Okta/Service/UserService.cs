using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.Serialization.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Okta.Dto;

namespace OneAdvisor.Service.Okta.Service
{
    public class UserService : IUserService
    {
        public UserService(IOptions<OktaSettings> options)
        {
            HttpClient = Utils.GetHttpClient(options.Value);
        }

        public HttpClient HttpClient { get; set; }

        public async Task<PagedItems<User>> GetUsers(UserQueryOptions queryOptions)
        {
            var serializer = new DataContractJsonSerializer(typeof(List<UserDto>));

            //TODO: FIX PAGING/SORTING
            var streamTask = HttpClient.GetStreamAsync("api/v1/users?limit=1000");
            var userDtos = serializer.ReadObject(await streamTask) as List<UserDto>;

            var query = userDtos.Select(dto => MapDtoToModel(dto)).AsQueryable();

            //Get total before applying filters
            var pagedItems = new PagedItems<User>();
            pagedItems.TotalItems = query.Count();

            //Apply filters ----------------------------------------------------------------------------------------
           
            //------------------------------------------------------------------------------------------------------

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToList();

            return pagedItems;
        }

        public async Task<User> GetUser(string id)
        {
            var serializer = new DataContractJsonSerializer(typeof(UserDto));

            var streamTask = HttpClient.GetStreamAsync($"api/v1/users/{id}");
            var userDto = serializer.ReadObject(await streamTask) as UserDto;

            return MapDtoToModel(userDto);
        }

        public async Task<Result> UpdateUser(User user)
        {
            var validator = new UserValidator(false);
            var result = validator.Validate(user).GetResult();

            if(!result.Success)
                return result;

            var dto = MapModelToDto(user);

            var json = Utils.FormatObject(dto);

            var response = await HttpClient.PostAsync($"api/v1/users/{user.Id}", json);

            if(!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var inner = new Exception(content);
                throw new Exception($"OKTA API ERROR: ResponseCode: {response.StatusCode}", inner);
            }

            return result;
        }

        public async Task<Result> InsertUser(User user)
        {
            var validator = new UserValidator(true);
            var result = validator.Validate(user).GetResult();

            if(!result.Success)
                return result;

            var dto = MapModelToDto(user);

            var json = Utils.FormatObject(dto);

            var response = await HttpClient.PostAsync($"api/v1/users", json);

            if(!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var inner = new Exception(content);
                throw new Exception($"OKTA API ERROR: ResponseCode: {response.StatusCode}", inner);
            }

            return result;
        }

        private User MapDtoToModel(UserDto dto)
        {
            return new User() {
                Id = dto.id,
                FirstName = dto.profile.firstName,
                LastName = dto.profile.lastName,
                Login = dto.profile.login,
                Email = dto.profile.email,
                LastLogin = Utils.ParseDate(dto.lastLogin),
                LastUpdated = Utils.ParseDate(dto.lastUpdated),
                Status = dto.status,
                Activated = Utils.ParseDate(dto.activated),
                OrganisationId = Guid.Parse(dto.profile.organization)
            };
        }

        private UserUpdateDto MapModelToDto(User model)
        {
            return new UserUpdateDto() {
                profile = new ProfileUpdateDto() {
                    firstName = model.FirstName,
                    lastName = model.LastName,
                    login = model.Login,
                    email = model.Email,
                    organization = model.OrganisationId
                }
            };
        }
    }
}
