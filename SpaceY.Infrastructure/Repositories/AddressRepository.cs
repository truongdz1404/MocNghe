using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SpaceY.Application.Interfaces.Repositories;
using SpaceY.Domain.Entities;
using SpaceY.Infrastructure.Data;

namespace SpaceY.Infrastructure.Repositories
{
    public class AddressRepository : BaseRepository<Address>, IAddressRepository
    {
        private readonly ApplicationDbContext _context;
        public AddressRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Address>> GetAddressesByUserIdAsync(string userId)
        {
            return await _context.Set<Address>()
                .Where(a => a.UserId == userId)
                .Include(a => a.User)
                .ToListAsync();
        }

        public async Task<Address?> GetAddressByIdAndUserIdAsync(int id, string userId)
        {
            return await _context.Set<Address>()
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
        }

        public async Task<bool> IsAddressOwnedByUserAsync(int addressId, string userId)
        {
            return await _context.Set<Address>()
                .AnyAsync(a => a.Id == addressId && a.UserId == userId);
        }
    }
}