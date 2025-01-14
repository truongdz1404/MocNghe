using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RentBridge.Domain.Entities
{
    public class Review : BaseEntity
    {
        public long PostId { get; set; }
        public long UserId { get; set; }
        public int Rating { get; set; } // 1-5 stars
        public string? Comment { get; set; }
        // Navigation properties
        public Post Post { get; set; } = null!;
        public User User { get; set; } = null!;
    }

}