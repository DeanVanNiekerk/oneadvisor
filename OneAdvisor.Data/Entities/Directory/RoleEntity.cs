using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Data.Entities.Directory
{
    public class RoleEntity : IdentityRole<Guid>
    {
        public Guid? ApplicationId { get; set; }
        [Required]
        public string Description { get; set; }

        public virtual ApplicationEntity Application { get; set; }
        public virtual ICollection<RoleToUseCaseEntity> RoleToUseCases { get; set; }
    }
}