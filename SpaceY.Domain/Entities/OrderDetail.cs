using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpaceY.Domain.Entities

{
    public class OrderDetail : BaseEntity
    {
        public long OrderId { get; set; } 
        public Order Order { get; set; } = null!;

        public Product Product { get; set; } = null!;
        public long ProductId { get; set; }

        public ProductType ProductType { get; set; } = null!;
        public long ProductTypeId { get; set; }

        public ProductVariant ProductVariant { get; set; } = null!; 

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }
    }
}
