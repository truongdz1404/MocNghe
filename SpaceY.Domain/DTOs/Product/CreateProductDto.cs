using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs.ProductVariant;

namespace SpaceY.Domain.DTOs.Product
{
    public class CreateProductDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<long> CategoryIds { get; set; } = new List<long>();
        public bool Featured { get; set; } = false;
        public bool Visible { get; set; } = true;
        public List<ImageDto> Images { get; set; } = new List<ImageDto>();
        public List<ProductVariantDto> Variants { get; set; } = new List<ProductVariantDto>();
    }
}