using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.DTOs.User
{
    public class UserDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTimeOffset? LockoutEnd { get; set; } = null;
    }
}