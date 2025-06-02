using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.DTOs.ProductVariant
{
    public class ProductVariantDto
    {
        public long ProductId { get; set; }
        public long ProductTypeId { get; set; }
        public string Name { get; set; } = string.Empty; 
        public decimal Price { get; set; }
        public decimal OriginalPrice { get; set; }
        public bool Visible { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
    }
}