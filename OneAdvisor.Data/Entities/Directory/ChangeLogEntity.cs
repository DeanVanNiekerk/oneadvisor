using System;
using System.ComponentModel.DataAnnotations;

namespace OneAdvisor.Data.Entities.Directory
{
    public class ChangeLogEntity
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string VersionNumber { get; set; }
        [Required]
        public DateTime ReleaseDate { get; set; }
        [Required]
        public string Log { get; set; }
    }
}