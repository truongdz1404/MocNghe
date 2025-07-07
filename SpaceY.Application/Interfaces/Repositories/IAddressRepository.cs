using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.Entities;

namespace SpaceY.Application.Interfaces.Repositories
{
    public interface IAddressRepository : IBaseRepository<Address>
    {
        Task<IEnumerable<Address>> GetAddressesByUserIdAsync(string userId);
        Task<Address?> GetAddressByIdAndUserIdAsync(int id, string userId);
        Task<bool> IsAddressOwnedByUserAsync(int addressId, string userId);
    }
}