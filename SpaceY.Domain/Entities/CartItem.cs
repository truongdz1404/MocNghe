using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpaceY.Domain.Entities
{
    public class CartItem
    {
        public string UserId { get; set; } = string.Empty;
        public long ProductId { get; set; }
        public long ProductTypeId { get; set; }
        public ProductVariant ProductVariant { get; set; } = null!;
        public int Quantity { get; set; } = 1;
    }
}
