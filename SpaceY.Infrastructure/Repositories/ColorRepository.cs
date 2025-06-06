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
    public class ColorRepository : BaseRepository<Color>, IColorRepository
    {
        public ColorRepository(ApplicationDbContext dbContext) : base(dbContext) { }

        public async Task<IEnumerable<Color>> GetActiveColorsAsync()
        {
            return await _dbContext.Colors
                .Where(c => c.IsActive)
                .OrderBy(c => c.DisplayOrder)
                .ToListAsync();
        }
    }
}