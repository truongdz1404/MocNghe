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
    public class SizeRepository : BaseRepository<Size>, ISizeRepository
    {
        public SizeRepository(ApplicationDbContext dbContext) : base(dbContext) { }

        public async Task<bool> IsNameExistsAsync(string name, long? excludeId = null)
        {
            return await _dbContext.Sizes
                .AnyAsync(s => s.Name == name && (!excludeId.HasValue || s.Id != excludeId));
        }
    }
}