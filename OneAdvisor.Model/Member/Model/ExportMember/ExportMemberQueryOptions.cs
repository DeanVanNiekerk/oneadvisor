using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;

namespace OneAdvisor.Model.Member.Model.ExportMember
{
    public class ExportMemberQueryOptions : QueryOptionsBase
    {
        public ExportMemberQueryOptions(ScopeOptions scope, List<string> columns)
         : base("", "asc", 0, 0)
        {
            Scope = scope;
            Columns = columns;
        }

        public ScopeOptions Scope { get; set; }

        public List<string> Columns { get; set; }
    }
}
