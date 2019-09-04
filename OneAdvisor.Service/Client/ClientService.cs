using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Model.Client.Model.Client;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Client.Validators;
using FluentValidation;
using OneAdvisor.Model.Client.Model.Merge;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Audit;

namespace OneAdvisor.Service.Client
{
    public class ClientService : IClientService
    {
        private readonly DataContext _context;
        private readonly IAuditService _auditService;

        public ClientService(DataContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        public async Task<PagedItems<Model.Client.Model.Client.Client>> GetClients(ClientQueryOptions queryOptions)
        {
            var query = from client in GetClientEntityQuery(queryOptions.Scope)
                        select new Model.Client.Model.Client.Client()
                        {
                            Id = client.Id,
                            ClientTypeId = client.ClientTypeId,
                            FirstName = client.FirstName,
                            LastName = client.LastName,
                            MaidenName = client.MaidenName,
                            IdNumber = client.IdNumber,
                            AlternateIdNumber = client.AlternateIdNumber,
                            Initials = client.Initials,
                            PreferredName = client.PreferredName,
                            DateOfBirth = client.DateOfBirth,
                            TaxNumber = client.TaxNumber,
                            MarritalStatusId = client.MarritalStatusId,
                            MarriageDate = client.MarriageDate,
                        };

            //Apply filters ----------------------------------------------------------------------------------------
            if (!string.IsNullOrWhiteSpace(queryOptions.FirstName))
                query = query.Where(m => EF.Functions.Like(m.FirstName, queryOptions.FirstName));

            if (!string.IsNullOrWhiteSpace(queryOptions.LastName))
                query = query.Where(m => EF.Functions.Like(m.LastName, queryOptions.LastName));

            if (!string.IsNullOrWhiteSpace(queryOptions.IdNumber))
                query = query.Where(m => EF.Functions.Like(m.IdNumber, queryOptions.IdNumber));

            if (queryOptions.ClientId.Any())
                query = query.Where(m => queryOptions.ClientId.Contains(m.Id));

            if (queryOptions.ClientTypeId.Any())
                query = query.Where(m => queryOptions.ClientTypeId.Contains(m.ClientTypeId));
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedItems<Model.Client.Model.Client.Client>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public Task<ClientPreview> GetClientPreview(ScopeOptions scope, Guid id)
        {
            var query = from client in GetClientEntityQuery(scope)
                        where client.Id == id
                        select new ClientPreview()
                        {
                            Id = client.Id,
                            ClientTypeId = client.ClientTypeId,
                            FirstName = client.FirstName,
                            LastName = client.LastName,
                            IdNumber = client.IdNumber,
                            AlternateIdNumber = client.AlternateIdNumber,
                            DateOfBirth = client.DateOfBirth,
                            PolicyCount = client.ClientPolicies.Count(),
                            ContactCount = client.ClientContacts.Count()
                        };

            return query.FirstOrDefaultAsync();
        }

        public Task<ClientEdit> GetClient(ScopeOptions scope, Guid id)
        {
            var query = from client in GetClientEntityQuery(scope)
                        where client.Id == id
                        select new ClientEdit()
                        {
                            Id = client.Id,
                            ClientTypeId = client.ClientTypeId,
                            FirstName = client.FirstName,
                            LastName = client.LastName,
                            MaidenName = client.MaidenName,
                            IdNumber = client.IdNumber,
                            AlternateIdNumber = client.AlternateIdNumber,
                            Initials = client.Initials,
                            PreferredName = client.PreferredName,
                            DateOfBirth = client.DateOfBirth,
                            TaxNumber = client.TaxNumber,
                            MarritalStatusId = client.MarritalStatusId,
                            MarriageDate = client.MarriageDate
                        };

            return query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertClient(ScopeOptions scope, ClientEdit client)
        {
            var validator = new ClientValidator(_context, scope, true);
            var result = validator.Validate(client, ruleSet: "default,Availability").GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(client);
            entity.OrganisationId = scope.OrganisationId;
            await _context.Client.AddAsync(entity);
            await _context.SaveChangesAsync();

            client.Id = entity.Id;
            result.Tag = client;

            await _auditService.InsertAuditLog(scope, AuditLog.ACTION_INSERT, "Client", client);

            return result;
        }

        public async Task<Result> UpdateClient(ScopeOptions scope, ClientEdit client)
        {
            var validator = new ClientValidator(_context, scope, false);
            var result = validator.Validate(client, ruleSet: "default,Availability").GetResult();

            if (!result.Success)
                return result;

            var entity = await GetClientEntityQuery(scope).FirstOrDefaultAsync(m => m.Id == client.Id);

            if (entity == null)
                return new Result();

            var clientEntity = MapModelToEntity(client, entity);

            await _context.SaveChangesAsync();

            await _auditService.InsertAuditLog(scope, AuditLog.ACTION_UPDATE, "Client", client);

            return result;
        }

        public async Task<Result> DeleteClient(ScopeOptions scope, Guid clientId)
        {
            var entity = await GetClientEntityQuery(scope).FirstOrDefaultAsync(m => m.Id == clientId);

            if (entity == null)
                return new Result();

            entity.IsDeleted = true;

            await _context.SaveChangesAsync();

            await _auditService.InsertAuditLog(scope, AuditLog.ACTION_DELETE, "Client", new { Id = clientId });

            return new Result(true);
        }

        public async Task<Result> MergeClients(ScopeOptions scope, MergeClients merge)
        {
            var clientValidator = new ClientValidator(_context, scope, true);
            var result = clientValidator.Validate(merge.TargetClient, ruleSet: "default").GetResult();

            if (!result.Success)
                return result;

            var mergeValidator = new MergeClientsValidator(_context, scope);
            result = mergeValidator.Validate(merge).GetResult();

            if (!result.Success)
                return result;

            //Insert the 'new' client
            var entity = MapModelToEntity(merge.TargetClient);
            entity.OrganisationId = scope.OrganisationId;
            await _context.Client.AddAsync(entity);
            await _context.SaveChangesAsync();

            merge.TargetClient.Id = entity.Id;

            //Move dependancies to the new client -----------------------------------------------------

            //1. Policies
            var policies = await _context.Policy.Where(p => merge.SourceClientIds.Contains(p.ClientId)).ToListAsync();
            foreach (var policy in policies)
                policy.ClientId = merge.TargetClient.Id.Value;

            //2. Contacts
            var contacts = await _context.Contact.Where(c => merge.SourceClientIds.Contains(c.ClientId)).ToListAsync();
            foreach (var contact in contacts)
                contact.ClientId = merge.TargetClient.Id.Value;

            //----------------------------------------------------------------------------------------

            //Delete 'old' clients
            var clientToDelete = await _context.Client.Where(m => merge.SourceClientIds.Contains(m.Id)).ToListAsync();
            foreach (var client in clientToDelete)
                client.IsDeleted = true;

            await _context.SaveChangesAsync();

            result.Tag = merge.TargetClient;

            await _auditService.InsertAuditLog(scope, "Merge", "Client", merge);

            return result;
        }

        private IQueryable<ClientEntity> GetClientEntityQuery(ScopeOptions scope)
        {
            return ScopeQuery.GetClientEntityQuery(_context, scope);
        }

        private ClientEntity MapModelToEntity(ClientEdit model, ClientEntity entity = null)
        {
            if (entity == null)
                entity = new ClientEntity();

            entity.ClientTypeId = model.ClientTypeId.Value;
            entity.FirstName = model.FirstName;
            entity.LastName = model.LastName;
            entity.MaidenName = model.MaidenName;
            entity.IdNumber = model.IdNumber;
            entity.AlternateIdNumber = model.AlternateIdNumber;
            entity.Initials = model.Initials;
            entity.PreferredName = model.PreferredName;
            entity.DateOfBirth = model.DateOfBirth;
            entity.TaxNumber = model.TaxNumber;
            entity.MarritalStatusId = model.MarritalStatusId;
            entity.MarriageDate = model.MarriageDate;

            if (entity.DateOfBirth == null)
            {
                var id = new IdNumber(model.IdNumber);
                if (id.IsValid)
                    entity.DateOfBirth = id.DateOfBirth;
            }

            return entity;
        }
    }
}