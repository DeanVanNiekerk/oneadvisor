using System;
using System.Linq;
using System.Collections.Generic;
using OneAdvisor.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Role;
using OneAdvisor.Model.Common;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Service.Directory.Validators;
using OneAdvisor.Model;

namespace OneAdvisor.Service.Directory
{
    public class RoleService : IRoleService
    {
        private readonly DataContext _context;

        public RoleService(DataContext context)
        {
            _context = context;
        }

        public Task<List<Role>> GetRoles()
        {
            var query = from role in _context.Roles
                        where role.ApplicationId != null
                        select new Role()
                        {
                            Id = role.Id,
                            Name = role.Name,
                            Description = role.Description,
                            ApplicationId = role.ApplicationId.Value
                        };

            return query.ToListAsync();
        }

        public async Task<bool> HasUseCase(IEnumerable<string> roles, IEnumerable<string> useCases)
        {
            var query = from roleToUseCase in _context.RoleToUseCase
                        join role in _context.Roles
                            on roleToUseCase.RoleId equals role.Id
                        where useCases.Contains(roleToUseCase.UseCaseId)
                        && roles.Contains(role.Name)
                        select roleToUseCase;

            return await query.AnyAsync();
        }

        public Task<RoleEdit> GetRole(Guid id)
        {
            var query = from role in _context.Roles
                        where role.Id == id
                        select new RoleEdit()
                        {
                            Id = role.Id,
                            Name = role.Name,
                            Description = role.Description,
                            ApplicationId = role.ApplicationId,
                            UseCaseIds = role.RoleToUseCases.Select(u => u.UseCaseId)
                        };

            return query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertRole(RoleEdit role)
        {
            var validator = new RoleValidator(true);
            var result = validator.Validate(role).GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(role);
            await _context.Roles.AddAsync(entity);
            await _context.SaveChangesAsync();

            role.Id = entity.Id;

            await UpdateUseCases(role);

            result.Tag = role;

            return result;
        }

        public async Task<Result> UpdateRole(RoleEdit role)
        {
            var validator = new RoleValidator(false);
            var result = validator.Validate(role).GetResult();

            if (!result.Success)
                return result;

            var entity = await _context.Roles.FindAsync(role.Id);

            if (entity == null)
                return new Result();

            entity = MapModelToEntity(role, entity);
            await _context.SaveChangesAsync();
            await UpdateUseCases(role);

            return result;
        }

        private async Task UpdateUseCases(RoleEdit role)
        {
            var roleToUseCases = await _context.RoleToUseCase.Where(r => r.RoleId == role.Id).ToListAsync();

            foreach (var roleToUseCase in roleToUseCases)
                _context.RoleToUseCase.Remove(roleToUseCase);

            foreach (var useCaseId in role.UseCaseIds)
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = role.Id.Value, UseCaseId = useCaseId });

            await _context.SaveChangesAsync();
        }

        private RoleEntity MapModelToEntity(RoleEdit model, RoleEntity entity = null)
        {
            if (entity == null)
                entity = new RoleEntity();

            entity.Name = model.Name;
            entity.Description = model.Description;
            entity.ApplicationId = model.ApplicationId.Value;

            return entity;
        }
    }
}
