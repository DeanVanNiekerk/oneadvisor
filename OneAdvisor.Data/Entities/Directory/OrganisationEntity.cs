using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Directory.Model.Organisation.Configuration;

namespace OneAdvisor.Data.Entities.Directory
{
    public class OrganisationEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public Config Config { get; set; }

        public virtual ICollection<BranchEntity> Branches { get; set; }
        public virtual ICollection<ClientEntity> Clients { get; set; }
    }
}