using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Data;
using OneAdvisor.Model.Common;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Model;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Model.Client.Model.Lookup;
using OneAdvisor.Data.Entities.Client.Lookup;
using System.Text.RegularExpressions;

namespace OneAdvisor.Service.Directory
{
    public class ClientLookupService : IClientLookupService
    {
        private readonly DataContext _context;

        public ClientLookupService(DataContext context)
        {
            _context = context;
        }

        #region Contact Type

        public async Task<List<ContactType>> GetContactTypes()
        {
            var query = from contactType in _context.ContactType
                        orderby contactType.Name
                        select new ContactType()
                        {
                            Id = contactType.Id,
                            Name = contactType.Name
                        };

            return await query.ToListAsync();
        }

        #endregion

        #region Policy Type

        public async Task<List<PolicyType>> GetPolicyTypes()
        {
            var query = from policyType in _context.PolicyType
                        orderby policyType.Name
                        select new PolicyType()
                        {
                            Id = policyType.Id,
                            Name = policyType.Name,
                            Code = policyType.Code
                        };

            return await query.ToListAsync();
        }

        #endregion

        #region Client Type

        public async Task<List<ClientType>> GetClientTypes()
        {
            var query = from clientType in _context.ClientType
                        orderby clientType.DisplayOrder ascending
                        select new ClientType()
                        {
                            Id = clientType.Id,
                            Name = clientType.Name,
                            Code = clientType.Code
                        };

            return await query.ToListAsync();
        }

        #endregion

        #region Marrial Status

        public async Task<List<MarritalStatus>> GetMarritalStatus()
        {
            var query = from marrialStatus in _context.MarritalStatus
                        orderby marrialStatus.Name
                        select new MarritalStatus()
                        {
                            Id = marrialStatus.Id,
                            Name = marrialStatus.Name
                        };

            return await query.ToListAsync();
        }

        #endregion
    }
}