
using System;
using System.Linq;
using System.Collections.Generic;
using OneAdvisor.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using OneAdvisor.Model;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.UseCase;

namespace OneAdvisor.Service.Directory
{
    public class UseCaseService : IUseCaseService
    {
        private readonly DataContext _context;

        public UseCaseService(DataContext context)
        {
            _context = context;
        }

        public Task<List<UseCase>> GetUseCases()
        {
            var query = from useCase in GetUseCaseQuery()
                        select useCase;

            return query.ToListAsync();
        }

        public async Task<List<string>> GetUseCases(IEnumerable<string> roleIds)
        {
            var query = from useCase in GetUseCaseQuery()
                        join roleToUseCase in _context.RoleToUseCase
                            on useCase.Id equals roleToUseCase.UseCaseId
                        where roleIds.Contains(roleToUseCase.RoleId)
                        select useCase;

            //Group by not be properly translated to sql
            var useCases = await query.ToListAsync();

            return useCases
                    .GroupBy(useCase => useCase.Id)
                    .Select(group => group.Key)
                    .ToList();
        }

        public IQueryable<UseCase> GetUseCaseQuery()
        {
            var query = from useCase in _context.UseCase
                        select new UseCase()
                        {
                            Id = useCase.Id,
                            Name = useCase.Name,
                            ApplicationId = useCase.ApplicationId
                        };

            return query;
        }
    }
}
