using System;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using System.Collections.Generic;

namespace OneAdvisor.Model.Directory.Model.User
{
    public class UserQueryOptions : QueryOptionsBase
    {
        public UserQueryOptions(ScopeOptions scope, int pageSize, int pageNumber)
         : base("LastName", "asc", pageSize, pageNumber)
        {
            Scope = scope;

            OrganisationId = new List<Guid>();
            BranchId = new List<Guid>();

            var result = GetFilterValue<string>("LastName");
            if (result.Success)
                LastName = result.Value;

            result = GetFilterValue<string>("FirstName");
            if (result.Success)
                FirstName = result.Value;

            result = GetFilterValue<string>("Email");
            if (result.Success)
                Email = result.Value;

            var resultBool = GetFilterValue<bool>("EmailConfirmed");
            if (resultBool.Success)
                EmailConfirmed = resultBool.Value;

            var resultGuids = GetFilterValues<Guid>("OrganisationId");
            if (resultGuids.Success)
                OrganisationId = resultGuids.Value;

            resultGuids = GetFilterValues<Guid>("BranchId");
            if (resultGuids.Success)
                BranchId = resultGuids.Value;
        }

        public ScopeOptions Scope { get; set; }

        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Email { get; set; }
        public bool? EmailConfirmed { get; set; }
        public List<Guid> OrganisationId { get; set; }
        public List<Guid> BranchId { get; set; }


    }
}