using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace RentBridge.Domain.Entities
{
    [Table("tblReviews")]
    public class Review : BaseEntity
    {
        public long PostId { get; set; }
        public string UserId { get; set; } = null!;
        public int Rating { get; set; } // 1-5 stars
        public string? Comment { get; set; }
        // Navigation properties
        public Post Post { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
    }

}