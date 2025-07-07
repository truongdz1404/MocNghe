using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs.Product;
using SpaceY.Domain.DTOs.ProductVariant;

namespace SpaceY.Domain.DTOs.Order
{
    public class OrderDetailDto
    {
        public long Id { get; set; }
        public long OrderId { get; set; }
        public long ProductId { get; set; }
        public long ProductVariantId { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
        public ProductDto? Product { get; set; }
        public ProductVariantDto? ProductVariant { get; set; }
    }
}