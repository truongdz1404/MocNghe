using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.Entities
{
    public class Size : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty; 
        public string? Description { get; set; } 
        public bool IsActive { get; set; } = true;
        public int DisplayOrder { get; set; } = 0;

        [NotMapped]
        public bool Editing { get; set; } = false;
        [NotMapped]
        public bool IsNew { get; set; } = false;
    }
}