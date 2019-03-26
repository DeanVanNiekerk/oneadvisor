using System;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using System.Collections.Generic;

namespace OneAdvisor.Model.Client.Model.Policy
{
    public class PolicyQueryOptions : QueryOptionsBase
    {
        public PolicyQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;
            CompanyId = new List<Guid>();
            PolicyTypeId = new List<Guid>();
            UserId = new List<Guid>();

            var result = GetFilterValue<string>("Number");
            if (result.Success)
                Number = result.Value;

            result = GetFilterValue<string>("ClientLastName");
            if (result.Success)
                ClientLastName = result.Value;

            var resultGuid = GetFilterValue<Guid>("ClientId");
            if (resultGuid.Success)
                ClientId = resultGuid.Value;

            resultGuid = GetFilterValue<Guid>("Id");
            if (resultGuid.Success)
                Id = resultGuid.Value;

            var resultGuids = GetFilterValues<Guid>("CompanyId");
            if (resultGuids.Success)
                CompanyId = resultGuids.Value;

            resultGuids = GetFilterValues<Guid>("PolicyTypeId");
            if (resultGuids.Success)
                PolicyTypeId = resultGuids.Value;

            resultGuids = GetFilterValues<Guid>("UserId");
            if (resultGuids.Success)
                UserId = resultGuids.Value;
        }

        public ScopeOptions Scope { get; set; }

        public Guid? ClientId { get; set; }
        public List<Guid> CompanyId { get; set; }
        public List<Guid> PolicyTypeId { get; set; }
        public Guid? Id { get; set; }
        public string Number { get; set; }
        public List<Guid> UserId { get; set; }
        public string ClientLastName { get; set; }
    }
}