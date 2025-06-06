using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.DTOs.Product
{
    public class ProductFilterDto
    {
        public List<long>? CategoryIds { get; set; }
        public bool UseCategoryAndLogic { get; set; } = false; // true: AND logic, false: OR logic
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public bool? InStock { get; set; }
        public bool? Featured { get; set; }
        public string? SearchTerm { get; set; }
        public List<long>? ColorIds { get; set; }
        public List<long>? SizeIds { get; set; }
    }
}