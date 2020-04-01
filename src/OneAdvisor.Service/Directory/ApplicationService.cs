using System;
using System.Linq;
using System.Collections.Generic;
using OneAdvisor.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Application;

namespace OneAdvisor.Service.Directory
{
    public class ApplicationService : IApplicationService
    {
        private readonly DataContext _context;

        public ApplicationService(DataContext context)
        {
            _context = context;
        }

        public Task<List<Application>> GetApplications()
        {
            var query = from application in _context.Application
                        orderby application.Name
                        select new Application()
                        {
                            Id = application.Id,
                            Name = application.Name,
                            ColourHex = application.ColourHex,
                        };

            return query.ToListAsync();
        }

    }
}
