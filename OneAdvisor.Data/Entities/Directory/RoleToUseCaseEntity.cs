using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace OneAdvisor.Data.Entities.Directory
{
    public class RoleToUseCaseEntity
    {
        //Composite key: RoleId/UseCaseId -> setup in RoleToUseCaseMap
        [StringLength(32)]
        public Guid RoleId { get; set; }
        [StringLength(32)]
        public string UseCaseId { get; set; }

        public virtual RoleEntity Role { get; set; }
        public virtual UseCaseEntity UseCase { get; set; }
    }
}