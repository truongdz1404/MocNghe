using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Application.DTOs
{
    public class LoginResponseDto
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public string Role { get; set; } = default!;
        public int AccessTokenExpiresInMinutes { get; set; }
        public int RefreshTokenExpiresInDays { get; set; }
    }
}