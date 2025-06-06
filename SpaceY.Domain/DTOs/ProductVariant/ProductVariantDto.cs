    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    namespace SpaceY.Domain.DTOs.ProductVariant
    {
        public class ProductVariantDto
        {
            public long Id { get; set; } 
            public long ProductId { get; set; }

            public long? ColorId { get; set; }

            public long? SizeId { get; set; }

            public decimal Price { get; set; }
            public decimal OriginalPrice { get; set; }
            public int Stock { get; set; }
            public string SKU { get; set; } = string.Empty;
            public bool Visible { get; set; }
            public string DisplayName { get; set; } = string.Empty;

            public bool HasDiscount => OriginalPrice > Price;
            public decimal DiscountPercent => OriginalPrice > 0
                ? Math.Round((OriginalPrice - Price) / OriginalPrice * 100, 2)
                : 0;
        }
    }