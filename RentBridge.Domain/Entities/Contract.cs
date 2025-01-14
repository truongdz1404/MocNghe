using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RentBridge.Domain.Entities
{
    public class Contract:BaseEntity
    {
        public long PostId { get; set; }
        public long TenantId { get; set; }
        public long OwnerId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal MonthlyPrice { get; set; }
        public string Status { get; set; } = "Active"; // "Active" or "Terminated"

        // Navigation properties
        public Post Post { get; set; } = null!;
        public User Tenant { get; set; } = null!;
        public User Owner { get; set; } = null!;
    }

}