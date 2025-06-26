using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using SpaceY.Domain.DTOs.Auth;

namespace SpaceY.Application.Services
{
    public interface IIdentityService
    {
        Task<IdentityResult> CreateUserAsync(RegisterDTO registerDTO, List<string> roles, bool isConfirmed = false);
        Task<bool> SignInUserAsync(LoginDto loginDTO);
    }
}