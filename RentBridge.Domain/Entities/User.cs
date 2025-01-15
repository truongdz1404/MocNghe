using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RentBridge.Domain.Enums;
using Microsoft.AspNetCore.Identity;


namespace RentBridge.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = null!;
        public UserRole Role { get; set; } = UserRole.Tenant;
        public string? AvatarUrl { get; set; }

        public ICollection<Post> Posts { get; set; } = new List<Post>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<Message> SentMessages { get; set; } = new List<Message>();
        public ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();

    }
}