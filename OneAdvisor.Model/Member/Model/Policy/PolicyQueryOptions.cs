using System;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;

namespace OneAdvisor.Model.Member.Model.Policy
{
    public class PolicyQueryOptions : QueryOptionsBase
    {
        public PolicyQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;

            var result = GetFilterValue<string>("Number");
            if (result.Success)
                Number = result.Value;

            result = GetFilterValue<string>("UserId");
            if (result.Success)
                UserId = result.Value;

            var resultGuid = GetFilterValue<Guid>("MemberId");
            if (resultGuid.Success)
                MemberId = resultGuid.Value;

            resultGuid = GetFilterValue<Guid>("CompanyId");
            if (resultGuid.Success)
                CompanyId = resultGuid.Value;

            resultGuid = GetFilterValue<Guid>("Id");
            if (resultGuid.Success)
                Id = resultGuid.Value;
        }

        public ScopeOptions Scope { get; set; }

        public Guid? MemberId { get; set; }
        public Guid? CompanyId { get; set; }
        public Guid? Id { get; set; }
        public string Number { get; set; }
        public string UserId { get; set; }
    }
}