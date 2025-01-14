using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RentBridge.Domain.Entities
{
    public class Post : BaseEntity
    {
        public long UserId { get; set; }
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
        public string Images { get; set; } = "[]"; // JSON array of image URLs
        public string Status { get; set; } = "Pending"; // "Pending", "Active", or "Closed"

        // Navigation properties
        public User User { get; set; } = null!;
        public ICollection<Post> Posts { get; set; } = new List<Post>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public Contract? Contract { get; set; }
    }
}