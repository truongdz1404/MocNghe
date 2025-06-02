using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpaceY.Domain.Entities

{
    public class Image : BaseEntity
    {
        public string Data { get; set; } = string.Empty;
        public bool Deleted { get; set; } = false;
        public long ProductId { get; set; } 
        public Product Product { get; set; } = null!;
    }
}
