using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SpaceY.Domain.Entities

{
    public class ProductVariant : BaseEntity
    {
        [JsonIgnore]
        public Product? Product { get; set; }
        public long ProductId { get; set; }

        public Color? Color { get; set; }
        public long? ColorId { get; set; }

        public Size? Size { get; set; }
        public long? SizeId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal OriginalPrice { get; set; }

        public int Stock { get; set; } = 0;
        public string? SKU { get; set; } = string.Empty;

        public bool Visible { get; set; } = true;
        public bool Deleted { get; set; } = false;

        [NotMapped]
        public bool Editing { get; set; } = false;
        [NotMapped]
        public bool IsNew { get; set; } = false;

        [NotMapped]
        public string DisplayName => $"{Color?.Name ?? "Default"} - {Size?.Name ?? "OneSize"}";
    }
}
