using System;
using System.ComponentModel.DataAnnotations;

namespace OneAdvisor.Data.Entities.Directory
{
    public class UserEntity
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public Guid BranchId { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }

        public virtual BranchEntity Branch { get; set; }
    }
}