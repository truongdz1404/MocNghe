using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs.Category;
using SpaceY.Domain.DTOs.Color;
using SpaceY.Domain.DTOs.ProductVariant;
using SpaceY.Domain.Entities;

namespace SpaceY.Domain.DTOs.Product
{
    public class ProductDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<CategoryDto> Categories { get; set; } = new List<CategoryDto>();
        // public List<string> CategoryNames { get; set; } = new List<string>();
        public bool Featured { get; set; }
        public bool Visible { get; set; }
        public bool Deleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }

        public List<ImageDto> Images { get; set; } = new List<ImageDto>();
        public List<ProductVariantDto> Variants { get; set; } = new List<ProductVariantDto>();

        public int ReviewCount { get; set; }
        public double AverageRating { get; set; }

        public decimal MinPrice { get; set; }
        public decimal MaxPrice { get; set; }
        public bool InStock { get; set; }
        public int TotalStock { get; set; }

        public List<ColorDto> AvailableColors { get; set; } = new List<ColorDto>();
        public List<SizeDto> AvailableSizes { get; set; } = new List<SizeDto>();

        public string PriceRange => MinPrice == MaxPrice
            ? MinPrice.ToString("C")
            : $"{MinPrice:C} - {MaxPrice:C}";
    }
}