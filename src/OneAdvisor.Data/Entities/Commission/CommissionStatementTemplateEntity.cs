using System;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;

namespace OneAdvisor.Data.Entities.Commission
{
    public class CommissionStatementTemplateEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid CompanyId { get; set; }
        [Required]
        public string Name { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        [Required]
        public bool BrokerSpecific { get; set; }
        [Required]
        public Config Config { get; set; }
    }
}