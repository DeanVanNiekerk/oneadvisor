using System.Linq;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Audit;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Service.Storage.Validators;
using OneAdvisor.Model;
using OneAdvisor.Service.Storage.Entity;
using Microsoft.WindowsAzure.Storage;
using Microsoft.Extensions.Options;
using OneAdvisor.Model.Config.Options;
using Newtonsoft.Json;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;

namespace OneAdvisor.Service.Storage
{
    public class AuditService : IAuditService
    {
        private CloudStorageAccount _account;

        public AuditService(IOptions<ConnectionOptions> options)
        {
            _account = CloudStorageAccount.Parse(options.Value.AzureStorage);
        }

        public async Task<PagedItems<AuditLog>> GetAuditLogs(AuditLogQueryOptions queryOptions)
        {
            var client = _account.CreateCloudTableClient();
            var table = client.GetTableReference("AuditLogs");
            await table.CreateIfNotExistsAsync();

            TableContinuationToken token = null;

            var entities = new List<AuditLogEntity>();

            do
            {
                var query = new TableQuery<AuditLogEntity>();

                // string dateStart = TableQuery.GenerateFilterConditionForDate(
                //    "Timestamp", QueryComparisons.GreaterThanOrEqual,
                //    DateTimeOffsetVal);



                var queryResult = await table.ExecuteQuerySegmentedAsync(query, token);

                entities.AddRange(queryResult.Results);

                token = queryResult.ContinuationToken;

            } while (token != null);



            // var query = from user in ScopeQuery.GetUserEntityQuery(_context, queryOptions.Scope)
            //             join auditLog in _context.AuditLog
            //                 on user.Id equals auditLog.UserId
            //             select new AuditLog()
            //             {
            //                 Id = auditLog.Id,
            //                 Action = auditLog.Action,
            //                 Entity = auditLog.Entity,
            //                 Date = auditLog.Date,
            //                 Data = auditLog.Data,
            //                 UserId = auditLog.UserId,
            //             };

            // //Apply filters ----------------------------------------------------------------------------------------
            // if (queryOptions.Action.Any())
            //     query = query.Where(b => queryOptions.Action.Contains(b.Action));

            // if (queryOptions.UserId.Any())
            //     query = query.Where(b => queryOptions.UserId.Contains(b.UserId.Value));

            // if (!string.IsNullOrEmpty(queryOptions.Entity))
            //     query = query.Where(m => EF.Functions.Like(m.Entity, $"{queryOptions.Entity}"));
            // //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedItems<AuditLog>();

            // //Get total items
            pagedItems.TotalItems = entities.Count;

            //Paging
            pagedItems.Items = entities.Select(entity => new AuditLog()
            {
                Id = Guid.Parse(entity.RowKey),
                Action = entity.Action,
                Entity = entity.Entity,
                Date = entity.Timestamp.DateTime,
                Data = JsonConvert.DeserializeObject(entity.Data),
                UserId = string.IsNullOrWhiteSpace(entity.UserId) ? null : (Guid?)Guid.Parse(entity.UserId),
            });

            return pagedItems;
        }

        public async Task<Result> InsertAuditLog(ScopeOptions scope, string action, string entity, dynamic data)
        {
            Guid? organisationId = null;
            Guid? userId = null;
            if (scope != null)
            {
                organisationId = scope.OrganisationId;
                userId = scope.UserId;
            }

            return await InsertAuditLog(organisationId, userId, action, entity, data);
        }

        public async Task<Result> InsertAuditLog(Guid? organisationId, Guid? userId, string action, string entity, dynamic data)
        {
            var model = new AuditLog()
            {
                UserId = userId,
                Action = action,
                Entity = entity,
                Data = data,
            };

            var validator = new AuditLogValidator();
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var client = _account.CreateCloudTableClient();
            var table = client.GetTableReference("AuditLogs");
            await table.CreateIfNotExistsAsync();

            var logEntity = MapCompanyModelToNewEntity(organisationId, model);

            var insert = TableOperation.Insert(logEntity);

            await table.ExecuteAsync(insert);

            model.Id = Guid.Parse(logEntity.RowKey);
            model.Date = logEntity.Timestamp.DateTime;
            result.Tag = model;

            return result;
        }

        private AuditLogEntity MapCompanyModelToNewEntity(Guid? organisationId, AuditLog model)
        {
            var entity = new AuditLogEntity(organisationId);

            entity.UserId = model.UserId.HasValue ? model.UserId.ToString() : "";
            entity.Action = model.Action;
            entity.Entity = model.Entity;
            entity.Data = JsonConvert.SerializeObject(model.Data);

            return entity;
        }
    }
}