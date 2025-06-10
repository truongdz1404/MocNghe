using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.DTOs.Product
{
    public class StockCheckResultDto
    {
        public long ProductVariantId { get; set; }
        public bool InStock { get; set; }
        public int AvailableStock { get; set; }
        public int RequestedQuantity { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}