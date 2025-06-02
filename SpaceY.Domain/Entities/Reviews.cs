using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.Entities
{
    public class Reviews : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser? User { get; set; }

        public long ProductId { get; set; }
        public Product? Product { get; set; }
        public bool Deleted { get; set; } = false;

        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
    }

}