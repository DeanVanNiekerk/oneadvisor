﻿using System;
using System.Linq;
using System.Collections.Generic;
using OneAdvisor.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using OneAdvisor.Model.Directory.Interface;

namespace OneAdvisor.Service.Directory
{
    public class RoleService : IRoleService
    {
        private readonly DataContext _context;

        public RoleService(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> HasUseCase(IEnumerable<string> roleIds, string useCase)
        {
            var query = from roleToUseCase in _context.RoleToUseCase
                        where roleToUseCase.UseCaseId == useCase
                        && roleIds.Contains(roleToUseCase.RoleId)
                        select roleToUseCase;

            return await query.AnyAsync();
        }
    }
}