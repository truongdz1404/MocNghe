using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.Enums;
using Microsoft.AspNetCore.Identity;


namespace SpaceY.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {

        public string RefreshToken { get; set; } = string.Empty;
        public DateTime RefreshTokenExpiryTime { get; set; }
        public string? AvatarUrl { get; set; }
        public Address? Address { get; set; }

        public ICollection<Address> Addresses { get; set; } = new List<Address>(); 
        public ICollection<Reviews> Reviews { get; set; } = new List<Reviews>();
        public ICollection<Order> Orders { get; set; } = new List<Order>(); 
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>(); 

    }
}