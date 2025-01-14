using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RentBridge.Domain.Entities
{
    public class User : BaseEntity
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public string Role { get; set; } = "Tenant"; // "Tenant", "Owner", or "Admin"
        public string? AvatarUrl { get; set; }

        // Navigation properties
        public ICollection<Post> Posts { get; set; } = new List<Post>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<Message> SentMessages { get; set; } = new List<Message>();
        public ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();

    }
}