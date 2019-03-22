using System;
using System.Collections.Generic;
using OneAdvisor.Model.Member.Model.Member;

namespace OneAdvisor.Model.Member.Model.Merge
{
    public class MergeMembers
    {
        public MergeMembers()
        {
            SourceMemberIds = new List<Guid>();
        }

        public MemberEdit TargetMember { get; set; }
        public List<Guid> SourceMemberIds { get; set; }
    }
}