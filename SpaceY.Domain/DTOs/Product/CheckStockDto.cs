using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.DTOs.Product
{
    public class CheckStockDto
    {
        [Required]
        public long ProductVariantId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int RequestedQuantity { get; set; }
    }
}