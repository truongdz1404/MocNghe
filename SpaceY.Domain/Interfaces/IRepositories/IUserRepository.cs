using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.Entities;

namespace SpaceY.Domain.Interfaces.IRepositories
{
    public interface IUserRepository
    {
        public Task<ApplicationUser?> FindUserByRefreshTokenAsync(string refreshToken);
        public Task<ApplicationUser?> FindUserByEmailAsync(string email);
    }
}