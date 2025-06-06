using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpaceY.Domain.Entities

{
    public class Product : BaseEntity
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<Image> Images { get; set; } = new List<Image>();
        public ICollection<Category> Categories { get; set; } = new List<Category>();
        public bool Featured { get; set; } = false;
        public List<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
        public bool Visible { get; set; } = true;
        public bool Deleted { get; set; } = false;
        [NotMapped]
        public bool Editing { get; set; } = false;
        [NotMapped]
        public bool IsNew { get; set; } = false;
        public ICollection<Reviews> Reviews { get; set; } = new List<Reviews>();
        [NotMapped]
        public decimal MinPrice => Variants.Where(v => !v.Deleted && v.Visible).Any()
                   ? Variants.Where(v => !v.Deleted && v.Visible).Min(v => v.Price)
                   : 0;

        [NotMapped]
        public decimal MaxPrice => Variants.Where(v => !v.Deleted && v.Visible).Any()
            ? Variants.Where(v => !v.Deleted && v.Visible).Max(v => v.Price)
            : 0;

        [NotMapped]
        public bool InStock => Variants.Any(v => !v.Deleted && v.Visible && v.Stock > 0);

        [NotMapped]
        public int TotalStock => Variants.Where(v => !v.Deleted && v.Visible).Sum(v => v.Stock);

        [NotMapped]
        public List<Color> AvailableColors => Variants
            .Where(v => !v.Deleted && v.Visible && v.Stock > 0 && v.Color != null)
            .Select(v => v.Color!)
            .Distinct()
            .OrderBy(c => c.DisplayOrder)
            .ToList();

        [NotMapped]
        public List<Size> AvailableSizes => Variants
            .Where(v => !v.Deleted && v.Visible && v.Stock > 0 && v.Size != null)
            .Select(v => v.Size!)
            .Distinct()
            .OrderBy(s => s.DisplayOrder)
            .ToList();

        [NotMapped]
        public List<string> CategoryNames => Categories?.Select(c => c.Name).ToList() ?? new List<string>();

    }
}
