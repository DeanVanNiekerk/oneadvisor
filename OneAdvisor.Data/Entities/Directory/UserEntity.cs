using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Data.Entities.Directory
{
    public class UserEntity : IdentityUser<Guid>
    {
        [Required]
        public Guid BranchId { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public IEnumerable<string> Aliases { get; set; }
        [Required]
        public Scope Scope { get; set; }
        [Required]
        public Guid UserTypeId { get; set; }

        public virtual BranchEntity Branch { get; set; }
        public virtual UserTypeEntity UserType { get; set; }
        public virtual ICollection<CommissionSplitRuleEntity> CommissionSplitRules { get; set; }
        public virtual ICollection<CommissionEntity> Commissions { get; set; }
    }
}