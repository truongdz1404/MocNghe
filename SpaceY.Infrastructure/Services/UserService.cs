using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using SpaceY.Application.Services;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.Entities;
using SpaceY.Domain.Interfaces.IRepositories;

namespace SpaceY.Infrastructure.Service
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IUserRepository _userRepository;

        public UserService(
            UserManager<ApplicationUser> userManager,
            ITokenService tokenService,
            IUserRepository userRepository)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _userRepository = userRepository;
        }
        private async Task<TokenDTO> CreateAuthTokenAsync(ApplicationUser user, int expDays = -1)
        {
            try
            {
                user.RefreshToken = _tokenService.GenerateRefreshToken();
                if (expDays > 0)
                    user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(expDays);

                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                    throw new Exception("Failed to update user refresh token.");

                var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.UserName ?? string.Empty),
            new(ClaimTypes.Email, user.Email ?? string.Empty)
        };

                var roles = await _userManager.GetRolesAsync(user);
                foreach (var role in roles)
                    claims.Add(new Claim(ClaimTypes.Role, role));

                return new TokenDTO()
                {
                    AccessToken = _tokenService.GenerateAccessToken(claims),
                    RefreshToken = user.RefreshToken
                };
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to create auth token.", ex);
            }
        }


        public async Task<TokenDTO> CreateAuthTokenAsync(string userName, int expDays = -1)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(userName);
                if (user == null)
                    throw new Exception($"User with username '{userName}' not found.");

                return await CreateAuthTokenAsync(user, expDays);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to create auth token for user '{userName}'.", ex);
            }
        }

        public async Task<TokenDTO> RefeshAuthTokenAsync(string refeshToken)
        {
            var user = await _userRepository.FindUserByRefreshTokenAsync(refeshToken)
                ?? throw new Exception("User not found");
            if (user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                throw new Exception("Invalid refresh token");
            return await CreateAuthTokenAsync(user);
        }

        public Task<string?> GetRefreshTokenAsync(string userName)
        {
            throw new NotImplementedException();
        }
    }
}