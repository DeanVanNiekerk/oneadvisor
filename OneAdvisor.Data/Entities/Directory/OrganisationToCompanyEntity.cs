using System;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Directory.Lookup;

namespace OneAdvisor.Data.Entities.Directory
{
    public class OrganisationToCompanyEntity
    {
        [Required]
        public Guid OrganisationId { get; set; }
        [Required]
        public Guid CompanyId { get; set; }

        public virtual OrganisationEntity Organisation { get; set; }
        public virtual CompanyEntity Company { get; set; }
    }
}