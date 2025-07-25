using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SpaceY.Application.Services;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.DTOs.Address;
using SpaceY.Domain.DTOs.User;
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

        public async Task<UserDTO> CreateUserAsync(UserDTO userDto, string password)
        {
            var user = new ApplicationUser
            {
                UserName = userDto.UserName,
                Email = userDto.Email,
                AvatarUrl = userDto.Avatar
            };

            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to create user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            if (!string.IsNullOrEmpty(userDto.Role))
            {
                await _userManager.AddToRoleAsync(user, userDto.Role);
            }

            return userDto;
        }

        public async Task<IEnumerable<object>> GetAllUsersAsync()
        {
            var users = _userManager.Users.Include(u => u.Addresses).ToList();
            var result = new List<object>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var addressDtos = user.Addresses?.Select(a => new AddressDto
                {
                    Id = a.Id,
                   State = a.State,
                   Street = a.Street,
                    City = a.City,
                }).ToList();

                result.Add(new
                {
                    id = user.Id,
                    username = user.UserName,
                    email = user.Email,
                    avatarUrl = user.AvatarUrl ?? string.Empty,
                    role = roles.FirstOrDefault() ?? string.Empty,
                    phoneNumber = user.PhoneNumber,
                    address = addressDtos
                });
            }
            return result;
        }

        public async Task<UserDTO?> GetUserByIdAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return null;

            var roles = await _userManager.GetRolesAsync(user);
            return new UserDTO
            {
                UserName = user.UserName,
                Email = user.Email,
                Avatar = user.AvatarUrl ?? string.Empty,
                Role = roles.FirstOrDefault() ?? string.Empty,
                LockoutEnd = user.LockoutEnd
            };
        }

        public async Task<UserDTO> UpdateUserAsync(string id, UserDTO userDto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            user.UserName = userDto.UserName;
            user.Email = userDto.Email;
            user.AvatarUrl = userDto.Avatar;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to update user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            // Update role if provided
            if (!string.IsNullOrEmpty(userDto.Role))
            {
                var currentRoles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
                await _userManager.AddToRoleAsync(user, userDto.Role);
            }

            return userDto;
        }

        public async Task<bool> DeleteUserAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return false;

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> ChangePasswordAsync(string id, string currentPassword, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return false;

            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            return result.Succeeded;
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
            new(ClaimTypes.NameIdentifier, user.Id ?? string.Empty),
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


        public async Task RemoveRefreshTokenAsync(string refreshToken)

        {
            var appUser = await _userRepository.FindUserByRefreshTokenAsync(refreshToken);
            if (appUser == null)
            {
                Console.WriteLine("User not found");
                return;
            }
            appUser.RefreshToken = "";
            await _userManager.UpdateAsync(appUser);
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

        public async Task<UserDTO> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.FindUserByEmailAsync(email);
            if (user == null)
                throw new Exception($"User with email '{email}' not found.");
            var roles = await _userManager.GetRolesAsync(user);

            return new UserDTO
            {
                Email = user.Email!,
                UserName = user.UserName!,
                Avatar = user.AvatarUrl ?? "",
                Role = roles.FirstOrDefault() ?? string.Empty,
                LockoutEnd = user.LockoutEnd
            };
        }
        public async Task<UserDTO> GetUserByNameAsync(string name)
        {
            var user = await _userRepository.FindUserByNameAsync(name);
            if (user == null)
                throw new Exception($"User with email '{name}' not found.");
            var roles = await _userManager.GetRolesAsync(user);
            return new UserDTO
            {
                Email = user.Email!,
                UserName = user.UserName!,
                Avatar = user.AvatarUrl ?? "",
                Role = roles.FirstOrDefault() ?? string.Empty,
                LockoutEnd = user.LockoutEnd
            };
        }
    }
}