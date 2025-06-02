using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using SpaceY.Application.Auth.Queries;
using SpaceY.Application.Services;
using SpaceY.Domain.DTOs.Auth;
using SpaceY.Domain.Entities;
using SpaceY.Domain.Helper;

namespace SpaceY.Infrastructure.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        public IdentityService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<IdentityResult> CreateUserAsync(RegisterDTO registerDTO, List<string> roles, bool isConfirmed)
        {
            var user = new ApplicationUser
            {
                UserName = EmailHelper.GetUserName(registerDTO.Email),
                Email = registerDTO.Email,
                EmailConfirmed = isConfirmed,
            };

            var result = await _userManager.CreateAsync(user, registerDTO.Password);
            if (!result.Succeeded)
            {
                return result;
            }

            result = await _userManager.AddToRolesAsync(user, roles);
            if (!result.Succeeded)
            {
                return result;
            }

            return IdentityResult.Success;
        }


        public async Task<bool> SignInUserAsync(Login loginDTO)
        {
            try
            {
                var userName = EmailHelper.GetUserName(loginDTO.Email);
                if (string.IsNullOrEmpty(userName))
                {
                    throw new Exception("Invalid email format.");
                }

                var result = await _signInManager.PasswordSignInAsync(userName, loginDTO.Password, false, false);
                return result.Succeeded;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to sign in user.", ex);
            }
        }

    }
}