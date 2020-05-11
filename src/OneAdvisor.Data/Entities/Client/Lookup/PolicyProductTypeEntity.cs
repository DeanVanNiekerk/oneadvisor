using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using OneAdvisor.Model.Client.Model.Lookup;

namespace OneAdvisor.Data.Entities.Client.Lookup
{
    public class PolicyProductTypeEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid PolicyTypeId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Code { get; set; }
        [Required]
        public string _PolicyTypeCharacteristics { get; set; }
        [NotMapped]
        public IEnumerable<PolicyTypeCharacteristicDescription> PolicyTypeCharacteristics
        {
            get
            {
                return _PolicyTypeCharacteristics == null ? null : JsonSerializer.Deserialize<PolicyTypeCharacteristicDescription[]>(_PolicyTypeCharacteristics);
            }
            set
            {
                _PolicyTypeCharacteristics = JsonSerializer.Serialize(value);
            }
        }

        public virtual PolicyTypeEntity PolicyType { get; set; }

        public virtual ICollection<PolicyEntity> Policies { get; set; }
    }
}