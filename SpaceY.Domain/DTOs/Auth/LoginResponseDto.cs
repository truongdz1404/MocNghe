using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs.User;

namespace SpaceY.Application.DTOs
{
    public class LoginResponseDto
    {

        public UserDTO? User { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public int AccessTokenExpiresInMinutes { get; set; }
        public int RefreshTokenExpiresInDays { get; set; }
    }
}