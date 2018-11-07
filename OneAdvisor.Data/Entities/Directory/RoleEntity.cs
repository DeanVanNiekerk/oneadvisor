using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OneAdvisor.Data.Entities.Directory
{
    public class RoleEntity
    {
        [Key, StringLength(32)]
        public string Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public Guid ApplicationId { get; set; }

        public virtual ApplicationEntity Application { get; set; }
        public virtual ICollection<RoleToUseCaseEntity> RoleToUseCases { get; set; }

    }
}