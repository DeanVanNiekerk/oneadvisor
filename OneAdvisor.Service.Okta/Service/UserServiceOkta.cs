using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.Serialization.Json;
using System.Threading.Tasks;
using System.Web;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Okta.Dto;
using OneAdvisor.Service.Okta.Service.Validators;

namespace OneAdvisor.Service.Okta.Service
{
    public class UserServiceOkta : IUserServiceOkta
    {
        private readonly DataContext _context;

        public UserServiceOkta(DataContext context, IOptions<OktaSettings> options, IRoleService roleService)
        {
            _context = context;
            RoleService = roleService;
            HttpClient = Utils.GetHttpClient(options.Value);
        }

        public HttpClient HttpClient { get; private set; }
        public IRoleService RoleService { get; private set; }

        //THIS ENTIRE FUNCTION COULD DO WITH SOME PERFORMANCE IMPROVEMENTS
        public async Task<PagedItems<User>> GetUsers(UserQueryOptions queryOptions)
        {
            var serializer = new DataContractJsonSerializer(typeof(List<UserDto>));

            //TODO: FIX PAGING/SORTING
            var streamTask = HttpClient.GetStreamAsync("api/v1/users?limit=1000");
            var userDtos = serializer.ReadObject(await streamTask) as List<UserDto>;

            var query = userDtos.Select(dto => MapDtoToModel(dto)).AsQueryable();

            var usersScoped = await ScopeQuery.GetUserEntityQuery(_context, queryOptions.Scope).ToListAsync();
            var userIdsScoped = usersScoped.Select(u => u.Id);

            //Apply scope
            query = query.Where(u => userIdsScoped.Contains(u.Id));

            //Apply filters ----------------------------------------------------------------------------------------

            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedItems<User>();

            //Get total items
            pagedItems.TotalItems = query.Count();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToList();

            //Update properties
            var branches = await _context.Branch.ToListAsync();
            foreach (var item in pagedItems.Items)
            {
                var user = usersScoped.Find(u => u.Id == item.Id);
                if (user != null)
                    item.Aliases = UserAlias.Parse(user.Aliases);

                var branch = branches.Find(b => b.Id == item.BranchId);
                if (branch != null)
                    item.OrganisationId = branch.OrganisationId;
            }

            return pagedItems;
        }

        public async Task<UserEdit> GetUser(ScopeOptions scope, string id)
        {
            var userEntity = await ScopeQuery.GetUserEntityQuery(_context, scope).FirstOrDefaultAsync(u => u.Id == id);

            if (userEntity == null)
                return null;

            var serializer = new DataContractJsonSerializer(typeof(UserDto));

            var streamTask = HttpClient.GetStreamAsync($"api/v1/users/{id}");
            var userDto = serializer.ReadObject(await streamTask) as UserDto;

            var user = MapDtoToEditModel(userDto);

            var roleIds = await GetUserRoleIds(id);

            user.RoleIds = roleIds;
            user.Aliases = UserAlias.Parse(userEntity.Aliases);

            return user;
        }

        private async Task<IEnumerable<string>> GetUserRoleIds(string id)
        {
            var serializer = new DataContractJsonSerializer(typeof(List<GroupDto>));

            var streamTask = HttpClient.GetStreamAsync($"api/v1/users/{id}/groups");
            var groupDtos = serializer.ReadObject(await streamTask) as List<GroupDto>;

            return groupDtos.Where(g => g.type == GroupDto.TYPE_OKTA).Select(g => g.profile.name);
        }

        public async Task<Result> UpdateUser(ScopeOptions scope, UserEdit user)
        {
            var validator = new UserValidator(scope, false);
            var result = validator.Validate(user).GetResult();

            if (!result.Success)
                return result;

            result = await ScopeQuery.IsUserInScopeResult(_context, scope, user.Id);

            if (!result.Success)
                return result;

            var dto = MapModelToDto(user);

            var json = Utils.FormatObject(dto);

            //Update user
            var response = await HttpClient.PostAsync($"api/v1/users/{user.Id}", json);
            if (!response.IsSuccessStatusCode)
                return await GetOktaFailureResult(response);

            //Update roles
            await UpdateUserRoles(user);

            //Update local user
            await SyncLocalUser(user);

            return result;
        }

        private async Task UpdateUserRoles(UserEdit user)
        {
            var currentRoleIds = await GetUserRoleIds(user.Id);
            var allGroups = await GetAllGroups();

            var roleIdsToAdd = user.RoleIds.Except(currentRoleIds);
            foreach (var roleId in roleIdsToAdd)
            {
                var groupId = GetGroupId(allGroups, roleId);

                //If the group doesnt exist in OKTA, then add it in
                if (groupId == null)
                {
                    var role = await RoleService.GetRole(roleId);

                    //Add group
                    await InsertGroup(new GroupDto()
                    {
                        profile = new GroupProfileDto()
                        {
                            name = role.Id,
                            description = role.Name
                        }
                    });

                    //Reload list of all groups
                    allGroups = await GetAllGroups();
                    groupId = GetGroupId(allGroups, roleId);
                }

                //Add user to role
                var response = await HttpClient.PutAsync($"api/v1/groups/{groupId}/users/{user.Id}", null);
                await HandleOktaResponse(response);
            }

            var rolesToRemove = currentRoleIds.Except(user.RoleIds);
            foreach (var roleId in rolesToRemove)
            {
                var groupId = GetGroupId(allGroups, roleId);
                var response = await HttpClient.DeleteAsync($"api/v1/groups/{groupId}/users/{user.Id}");
                await HandleOktaResponse(response);
            }
        }

        private async Task<ErrorDto> GetOktaError(HttpResponseMessage response)
        {
            var serializer = new DataContractJsonSerializer(typeof(ErrorDto));
            return serializer.ReadObject(await response.Content.ReadAsStreamAsync()) as ErrorDto;
        }

        private async Task<Result> GetOktaFailureResult(HttpResponseMessage response)
        {
            var result = new Result();
            var error = await GetOktaError(response);
            result.Success = false;
            result.ValidationFailures.Add(new ValidationFailure("", error.GetAllErrorCauses()));
            return result;
        }

        private async Task HandleOktaResponse(HttpResponseMessage response)
        {
            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var inner = new Exception(content);
                throw new Exception($"OKTA API ERROR: ResponseCode: {response.StatusCode}", inner);
            }
        }

        public async Task<Result> InsertUser(ScopeOptions scope, UserEdit user)
        {
            var validator = new UserValidator(scope, true);
            var result = validator.Validate(user).GetResult();

            if (!result.Success)
                return result;

            var dto = MapModelToDto(user);

            var json = Utils.FormatObject(dto);

            //Insert user
            var response = await HttpClient.PostAsync($"api/v1/users", json);
            if (!response.IsSuccessStatusCode)
                return await GetOktaFailureResult(response);

            var serializer = new DataContractJsonSerializer(typeof(UserDto));
            var userInserted = serializer.ReadObject(await response.Content.ReadAsStreamAsync()) as UserDto;

            //Update the id
            user.Id = userInserted.id;

            //Update roles
            await UpdateUserRoles(user);

            //Update local user
            await SyncLocalUser(user);

            return result;
        }

        public async Task SyncAllUsers()
        {
            var serializer = new DataContractJsonSerializer(typeof(List<UserDto>));

            var streamTask = HttpClient.GetStreamAsync("api/v1/users?limit=1000");
            var userDtos = serializer.ReadObject(await streamTask) as List<UserDto>;

            foreach (var user in userDtos)
            {
                var localUser = _context.User.Find(user.id);

                if (localUser != null)
                    continue;

                var entity = new UserEdit()
                {
                    Id = user.id,
                    FirstName = user.profile.firstName,
                    LastName = user.profile.lastName,
                    BranchId = Guid.Parse(user.profile.branchId),
                    Aliases = new List<string>()
                };

                await SyncLocalUser(entity);
            }

        }

        public async Task<PagedItems<UserSimple>> GetUsersSimple(ScopeOptions scope)
        {
            var query = from user in GetSimpleUserQuery(scope)
                        select user;

            var pagedItems = new PagedItems<UserSimple>();
            pagedItems.TotalItems = await query.CountAsync();

            pagedItems.Items = await query.ToListAsync();

            return pagedItems;
        }

        public Task<UserSimple> GetUserSimple(ScopeOptions scope, string id)
        {
            var query = from user in GetSimpleUserQuery(scope)
                        where user.Id == id
                        select user;

            return query.FirstOrDefaultAsync();
        }

        private IQueryable<UserSimple> GetSimpleUserQuery(ScopeOptions scope)
        {
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, scope);

            var query = from user in userQuery
                        select new UserSimple()
                        {
                            Id = user.Id,
                            FirstName = user.FirstName,
                            LastName = user.LastName
                        };
            return query;
        }

        private async Task SyncLocalUser(UserEdit user)
        {
            //Make sure this user exists in our db
            var localUser = _context.User.Find(user.Id);

            if (localUser != null)
            {
                await UpdateLocalUser(user);
                return;
            }

            await InsertLocalUser(user);
        }

        private async Task InsertLocalUser(UserEdit user)
        {
            var entity = MapEditUserToEntity(user);

            _context.User.Add(entity);
            await _context.SaveChangesAsync();
        }
        private async Task UpdateLocalUser(UserEdit user)
        {
            var entity = _context.User.Find(user.Id);

            entity = MapEditUserToEntity(user, entity);

            await _context.SaveChangesAsync();
        }

        private UserEntity MapEditUserToEntity(UserEdit user, UserEntity entity = null)
        {
            if (entity == null)
                entity = new UserEntity();

            entity.Id = user.Id;
            entity.FirstName = user.FirstName;
            entity.LastName = user.LastName;
            entity.BranchId = user.BranchId.Value;
            entity.Aliases = UserAlias.Format(user.Aliases);

            return entity;
        }

        private async Task<List<GroupDto>> GetAllGroups()
        {
            var serializer = new DataContractJsonSerializer(typeof(List<GroupDto>));

            var streamTask = HttpClient.GetStreamAsync($"api/v1/groups");
            var groupDtos = serializer.ReadObject(await streamTask) as List<GroupDto>;

            return groupDtos;
        }

        private async Task InsertGroup(GroupDto group)
        {
            var json = Utils.FormatObject(group);

            var response = await HttpClient.PostAsync($"api/v1/groups", json);
            await HandleOktaResponse(response);
        }

        private string GetGroupId(List<GroupDto> groups, string roleId)
        {
            return groups.FirstOrDefault(g => g.profile.name == roleId)?.id;
        }

        private User MapDtoToModel(UserDto dto)
        {
            return new User()
            {
                Id = dto.id,
                FirstName = dto.profile.firstName,
                LastName = dto.profile.lastName,
                Login = dto.profile.login,
                Email = dto.profile.email,
                LastLogin = Utils.ParseDate(dto.lastLogin),
                LastUpdated = Utils.ParseDate(dto.lastUpdated),
                Status = dto.status,
                Activated = Utils.ParseDate(dto.activated),
                BranchId = Guid.Parse(dto.profile.branchId),
                AssistantToUserId = dto.profile.assistantToUserId,
                Scope = ScopeParser.Parse(dto.profile.scope)
            };
        }

        private UserEdit MapDtoToEditModel(UserDto dto)
        {
            return new UserEdit()
            {
                Id = dto.id,
                FirstName = dto.profile.firstName,
                LastName = dto.profile.lastName,
                Login = dto.profile.login,
                Email = dto.profile.email,
                BranchId = Guid.Parse(dto.profile.branchId),
                AssistantToUserId = dto.profile.assistantToUserId,
                Scope = ScopeParser.Parse(dto.profile.scope)
            };
        }

        private UserEditDto MapModelToDto(UserEdit model)
        {
            return new UserEditDto()
            {
                profile = new UserEditProfileDto()
                {
                    firstName = model.FirstName,
                    lastName = model.LastName,
                    login = model.Login,
                    email = model.Email,
                    branchId = model.BranchId.Value,
                    assistantToUserId = model.AssistantToUserId,
                    scope = ScopeParser.Format(model.Scope)
                }
            };
        }


    }
}
