using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Directory.Lookup;

namespace OneAdvisor.Data.Entities.Client
{
    public class ClientEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid OrganisationId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MaidenName { get; set; }
        public string Initials { get; set; }
        public string PreferredName { get; set; }
        public string IdNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string PassportNumber { get; set; }
        public string TaxNumber { get; set; }
        public Guid? MarritalStatusId { get; set; }
        public DateTime? MarriageDate { get; set; }

        [Required]
        public bool IsDeleted { get; set; }

        //NB!!!!: When adding new list relationships dont forget to update MergeClients() ----
        public virtual ICollection<PolicyEntity> ClientPolicies { get; set; }
        public virtual ICollection<ContactEntity> ClientContacts { get; set; }
        //-------------------------------------------------------------------------------------

        public virtual OrganisationEntity Organisation { get; set; }
        public virtual MarritalStatusEntity MarritalStatus { get; set; }
    }
}