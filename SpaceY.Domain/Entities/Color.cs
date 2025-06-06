using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.Entities
{
    public class Color : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty; // "Đỏ", "Xanh dương"
        public string HexCode { get; set; } = string.Empty; // "#FF0000", "#0000FF"
        public bool IsActive { get; set; } = true;
        public int DisplayOrder { get; set; } = 0;

        [NotMapped]
        public bool Editing { get; set; } = false;
        [NotMapped]
        public bool IsNew { get; set; } = false;
    }
}