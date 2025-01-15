using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using RentBridge.Domain.Enums;

namespace RentBridge.Domain.Entities
{
    [Table("tblContracts")]
    public class Contract : BaseEntity
    {
        public long PostId { get; set; }
        public string TenantId { get; set; } = null!;
        public string OwnerId { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal MonthlyPrice { get; set; }
        public ContractStatus Status { get; set; } = ContractStatus.Active; // "Active" or "Terminated"

        // Navigation properties
        public Post Post { get; set; } = null!;
        public ApplicationUser Tenant { get; set; } = null!;
        public ApplicationUser Owner { get; set; } = null!;
    }

}