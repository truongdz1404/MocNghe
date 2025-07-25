using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.DTOs.User;

namespace SpaceY.Application.Services
{
    public interface IUserService
    {
        Task<TokenDTO> CreateAuthTokenAsync(string userName, int expDays = -1);
        Task<TokenDTO> RefeshAuthTokenAsync(string refeshToken);
        Task<string?> GetRefreshTokenAsync(string userName);
        Task<UserDTO> GetUserByEmailAsync(string email);
        Task<UserDTO> GetUserByNameAsync(string name);
        Task RemoveRefreshTokenAsync(string refreshToken);

        // CRUD operations
        Task<UserDTO> CreateUserAsync(UserDTO userDto, string password);
        Task<IEnumerable<object>> GetAllUsersAsync();
        Task<UserDTO?> GetUserByIdAsync(string id);
        Task<UserDTO> UpdateUserAsync(string id, UserDTO userDto);
        Task<bool> DeleteUserAsync(string id);
        Task<bool> ChangePasswordAsync(string id, string currentPassword, string newPassword);
    }
}