using System;
using System.ComponentModel.DataAnnotations;

namespace OneAdvisor.Data.Entities.Directory
{
    public class UserAliasEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string UserId { get; set; }
        [Required]
        public string Name { get; set; }

        public virtual UserEntity User { get; set; }
    }
}