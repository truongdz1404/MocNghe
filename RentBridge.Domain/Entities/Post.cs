using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using RentBridge.Domain.Enums;

namespace RentBridge.Domain.Entities
{
    [Table("tblPosts")]
    public class Post : BaseEntity
    {
        public string UserId { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public float Area { get; set; }
        public string Address { get; set; } = null!;
        public int ProvinceCode { get; set; }
        public int DistrictCode { get; set; }
        public int WardCode { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }
    
        public bool VerifiedStatus { get; set; } = false;
        public PostStatus Status { get; set; } = PostStatus.Pending; // "Pending", "Active", or "Closed"

        // Navigation properties
        public ApplicationUser User { get; set; } = null!;
        public ICollection<Post> Posts { get; set; } = new List<Post>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();

        public ICollection<Images> Images {get; set; } = new List<Images>();
        public Contract? Contract { get; set; }
    }
}