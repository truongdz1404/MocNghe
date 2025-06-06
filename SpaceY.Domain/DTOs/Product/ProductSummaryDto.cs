using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.DTOs.Product
{
    public class ProductSummaryDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> CategoryNames { get; set; } = new List<string>();
        public bool Featured { get; set; }
        public decimal MinPrice { get; set; }
        public decimal MaxPrice { get; set; }
        public bool InStock { get; set; }
        public string? ThumbnailImage { get; set; }
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }
    }
}