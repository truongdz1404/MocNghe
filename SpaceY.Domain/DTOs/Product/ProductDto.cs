using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs.ProductVariant;

namespace SpaceY.Domain.DTOs.Product
{
    public class ProductDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public long CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public bool Featured { get; set; } = false;
        public bool Visible { get; set; } = true;
        public bool Deleted { get; set; } = false;
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
        public List<ImageDto> Images { get; set; } = new List<ImageDto>();
        public List<ProductVariantDto> Variants { get; set; } = new List<ProductVariantDto>();
        public int ReviewCount { get; set; }
        public double AverageRating { get; set; }
    }
}