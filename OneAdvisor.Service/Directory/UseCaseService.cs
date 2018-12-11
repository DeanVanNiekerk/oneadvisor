
using System;
using System.Linq;
using System.Collections.Generic;
using OneAdvisor.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
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
            var query = from role in _context.UseCase
                        select new UseCase()
                        {
                            Id = role.Id,
                            Name = role.Name,
                            ApplicationId = role.ApplicationId
                        };

            return query.ToListAsync();
        }
    }
}
