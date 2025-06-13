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
    public class CategoryRepository
     : BaseRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(ApplicationDbContext _dbContext) : base(_dbContext) { }
        public async Task<IEnumerable<Category>> GetVisibleAsync()
        {
            return await _dbContext.Set<Category>()
                .Where(c => c.Visible && !c.Deleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<Category>> GetActiveAsync()
        {
            return await _dbContext.Set<Category>()
                .Where(c => !c.Deleted)
                .ToListAsync();
        }

        public async Task<bool> IsNameExistsAsync(string name, long? excludeId = null)
        {
            var query = _dbContext.Set<Category>()
                .Where(c => c.Name.ToLower() == name.ToLower() && !c.Deleted);

            if (excludeId.HasValue)
                query = query.Where(c => c.Id != excludeId.Value);

            return await query.AnyAsync();
        }

        public async Task<bool> IsUrlExistsAsync(string url, long? excludeId = null)
        {
            var query = _dbContext.Set<Category>()
                .Where(c => c.Url.ToLower() == url.ToLower() && !c.Deleted);

            if (excludeId.HasValue)
                query = query.Where(c => c.Id != excludeId.Value);

            return await query.AnyAsync();
        }

        public async Task<IEnumerable<Category>> GetByIdsAsync(IEnumerable<long> ids)
        {
            var list = await _dbContext.Set<Category>()
                .Where(c => ids.Contains(c.Id) && !c.Deleted)
                .ToListAsync();
            return list;
        }

        public async Task<IEnumerable<Category>> GetCategoryRoomAsync()
        {
            return await _dbContext.Set<Category>()
      .Where(c => EF.Functions.Like(c.Name, "%Phòng%") && !c.Deleted)
      .ToListAsync();

        }
    }

}