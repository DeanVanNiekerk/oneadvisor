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
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Service.Storage
{
    public class AuditService : IAuditService
    {
        private CloudStorageAccount _account;
        private ITelemetryService _telemetryService;

        public AuditService(IOptions<ConnectionOptions> options, ITelemetryService telemetryService)
        {
            _account = CloudStorageAccount.Parse(options.Value.AzureStorage);
            _telemetryService = telemetryService;
        }

        public async Task<AuditLogItems> GetAuditLogs(AuditLogQueryOptions queryOptions)
        {
            //The max amount of entities to return in the query (maybe put it appSettings?)
            var limit = 1000;

            var client = _account.CreateCloudTableClient();
            var table = client.GetTableReference("AuditLogs");
            await table.CreateIfNotExistsAsync();

            TableContinuationToken token = null;

            var entities = new List<AuditLogEntity>();

            do
            {
                var query = new TableQuery<AuditLogEntity>();

                string partitionFilter = TableQuery.GenerateFilterCondition(
                    "PartitionKey",
                    QueryComparisons.Equal,
                    queryOptions.Scope.OrganisationId.ToString());

                //Minimal filter (organisation)
                string finalFilter = partitionFilter;

                //Dynamic filters
                //------------------------------------------------------------------------

                //Branch
                if (queryOptions.Scope.Scope == Scope.Branch)
                {
                    string branchFilter = TableQuery.GenerateFilterCondition(
                        "BranchId",
                        QueryComparisons.Equal,
                        queryOptions.Scope.BranchId.ToString());

                    finalFilter = finalFilter.AndWhere(branchFilter);
                }

                //User
                if (queryOptions.Scope.Scope == Scope.User)
                {
                    string userFilter = TableQuery.GenerateFilterCondition(
                        "UserId",
                        QueryComparisons.Equal,
                        queryOptions.Scope.UserId.ToString());

                    finalFilter = finalFilter.AndWhere(userFilter);
                }

                //Start Date
                if (queryOptions.StartDate.HasValue)
                {
                    string dateStartFilter = TableQuery.GenerateFilterConditionForDate(
                        "Timestamp",
                        QueryComparisons.GreaterThanOrEqual,
                        queryOptions.StartDate.Value.Date); //Start of day

                    finalFilter = finalFilter.AndWhere(dateStartFilter);
                }

                //End Date
                if (queryOptions.EndDate.HasValue)
                {
                    string dateEndFilter = TableQuery.GenerateFilterConditionForDate(
                         "Timestamp",
                         QueryComparisons.LessThan,
                         queryOptions.EndDate.Value.AddDays(1).Date); //End of day

                    finalFilter = finalFilter.AndWhere(dateEndFilter);
                }

                //Action
                string actionsFilter = "";
                foreach (var action in queryOptions.Action)
                {
                    string actionFilter = TableQuery.GenerateFilterCondition(
                       "Action",
                       QueryComparisons.Equal,
                       action);
                    actionsFilter = actionsFilter.OrWhere(actionFilter);
                }
                if (!string.IsNullOrWhiteSpace(actionsFilter))
                    finalFilter = finalFilter.AndWhere(actionsFilter);

                //Users
                string usersFilter = "";
                foreach (var userId in queryOptions.UserId)
                {
                    string userFilter = TableQuery.GenerateFilterCondition(
                       "UserId",
                       QueryComparisons.Equal,
                       userId.ToString());
                    usersFilter = usersFilter.OrWhere(userFilter);
                }
                if (!string.IsNullOrWhiteSpace(usersFilter))
                    finalFilter = finalFilter.AndWhere(usersFilter);

                //Entity
                string entitesFilter = "";
                foreach (var entity in queryOptions.Entity)
                {
                    string entityFilter = TableQuery.GenerateFilterCondition(
                       "Entity",
                       QueryComparisons.Equal,
                       entity);
                    entitesFilter = entitesFilter.OrWhere(entityFilter);
                }
                if (!string.IsNullOrWhiteSpace(entitesFilter))
                    finalFilter = finalFilter.AndWhere(entitesFilter);

                //EntityId
                string entityIdsFilter = "";
                foreach (var entityId in queryOptions.EntityId)
                {
                    string entityIdFilter = TableQuery.GenerateFilterCondition(
                       "EntityId",
                       QueryComparisons.Equal,
                       entityId);
                    entityIdsFilter = entityIdsFilter.OrWhere(entityIdFilter);
                }
                if (!string.IsNullOrWhiteSpace(entityIdsFilter))
                    finalFilter = finalFilter.AndWhere(entityIdsFilter);
                //------------------------------------------------------------------------

                query.FilterString = finalFilter;
                query.TakeCount = limit;

                var queryResult = await table.ExecuteQuerySegmentedAsync(query, token);

                entities.AddRange(queryResult.Results);

                token = queryResult.ContinuationToken;

                if (entities.Count >= limit)
                    token = null;

            } while (token != null);


            var items = new AuditLogItems();

            items.Limit = limit;

            items.Items = entities.Select(entity => new AuditLog()
            {
                Id = Guid.Parse(entity.RowKey),
                Action = entity.Action,
                Entity = entity.Entity,
                EntityId = entity.EntityId,
                Date = entity.Timestamp.DateTime,
                Data = JsonConvert.DeserializeObject(entity.Data),
                UserId = string.IsNullOrWhiteSpace(entity.UserId) ? null : (Guid?)Guid.Parse(entity.UserId),
            }).OrderByDescending(e => e.Date).ToList();

            return items;
        }

        public Task<Result> InsertAuditLogStringId(ScopeOptions scope, string action, string entity, string entityId, dynamic data)
        {
            Guid? organisationId = null;
            Guid? branchId = null;
            Guid? userId = null;
            if (scope != null)
            {
                organisationId = scope.OrganisationId;
                branchId = scope.BranchId;
                userId = scope.UserId;
            }

            return InsertAuditLog(organisationId, branchId, userId, action, entity, entityId, data);
        }

        public Task<Result> InsertAuditLog(ScopeOptions scope, string action, string entity, Guid? entityId, dynamic data)
        {
            var entityIdString = entityId.HasValue ? entityId.Value.ToString() : null;
            return InsertAuditLogStringId(scope, action, entity, entityIdString, data);
        }

        public async Task<Result> InsertAuditLog(Guid? organisationId, Guid? branchId, Guid? userId, string action, string entity, string entityId, dynamic data)
        {
            var model = new AuditLog()
            {
                UserId = userId,
                BranchId = branchId,
                Action = action,
                Entity = entity,
                EntityId = entityId,
                Data = data,
            };

            var validator = new AuditLogValidator();
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            try
            {
                var client = _account.CreateCloudTableClient();
                var table = client.GetTableReference("AuditLogs");
                await table.CreateIfNotExistsAsync();

                var logEntity = MapCompanyModelToNewEntity(organisationId, model);

                var insert = TableOperation.Insert(logEntity);

                await table.ExecuteAsync(insert);

                model.Id = Guid.Parse(logEntity.RowKey);
                model.Date = logEntity.Timestamp.DateTime;
                result.Tag = model;
            }
            catch (Exception exception)
            {
                var properties = new Dictionary<string, string>();
                properties.Add("Description", "Error inserting audit log");
                properties.Add("AuditLog", JsonConvert.SerializeObject(model));

                _telemetryService.TrackException(exception, properties);

                return new Result(exception.Message);
            }

            return result;
        }

        private AuditLogEntity MapCompanyModelToNewEntity(Guid? organisationId, AuditLog model)
        {
            var entity = new AuditLogEntity(organisationId);

            entity.UserId = model.UserId.HasValue ? model.UserId.ToString() : "";
            entity.BranchId = model.BranchId.HasValue ? model.BranchId.ToString() : "";
            entity.Action = model.Action;
            entity.Entity = model.Entity;
            entity.EntityId = model.EntityId;
            entity.Data = JsonConvert.SerializeObject(model.Data);

            return entity;
        }
    }
}