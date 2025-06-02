using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SpaceY.Domain.Enums;

namespace SpaceY.Domain.Entities

{
    public class Order : BaseEntity
    {
        public string UserId { get; set; } = string.Empty; 
        public ApplicationUser User { get; set; } = null!;
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public List<OrderDetail> OrderItems { get; set; } = new List<OrderDetail>();
    }
}
