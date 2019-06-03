using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OneAdvisor.Data.Entities.Directory
{
    public class BranchEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid OrganisationId { get; set; }
        [Required]
        public string Name { get; set; }

        public virtual OrganisationEntity Organisation { get; set; }
        public virtual ICollection<UserEntity> Users { get; set; }
    }
}