using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.DTOs.Order
{
    public class CreateOrderDetailDto
    {
        public long ProductId { get; set; }
        public long ProductVariantId { get; set; }
        public int Quantity { get; set; }
    }
}