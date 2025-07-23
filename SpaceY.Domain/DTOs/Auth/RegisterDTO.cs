    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using System.Threading.Tasks;
    using SpaceY.Domain.Enums;

    namespace SpaceY.Domain.DTOs.Auth
    {
        public class RegisterDTO
        {
            [Required(ErrorMessage = "Email address are required")]
            [EmailAddress(ErrorMessage = "Invalid email address")]
            public string Email { get; set; } = null!;
            public string UserName { get; set; } = string.Empty;
            [Required(ErrorMessage = "Password is required")]
            [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters")]
            public string Password { get; set; } = null!;
            public UserRole Role { get; set; } = UserRole.Customer;
            public string? AvatarUrl { get; set; }
            public string? Phone { get; set; }
        }
    }