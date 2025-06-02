using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SpaceY.Application.Interfaces.Repositories;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.Entities;
using SpaceY.Infrastructure.Data;

namespace SpaceY.Infrastructure.Repositories
{
    public class ProductRepository(ApplicationDbContext dbContext)
       : BaseRepository<Product>(dbContext), IProductRepository
    {
        public async Task<IEnumerable<Product>> GetVisibleAsync()
        {
            return await dbContext.Set<Product>()
                .Where(p => p.Visible && !p.Deleted)
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }


        public async Task<PaginatedData<Product>> GetPaginatedWithFilterAsync(int pageNumber, int pageSize, bool includeDeleted = false)
        {
            IQueryable<Product> queryable = dbContext.Set<Product>()
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.ProductType)
                .Include(p => p.Reviews);

            // Filter BEFORE pagination
            if (!includeDeleted)
            {
                queryable = queryable.Where(p => !p.Deleted);
            }

            var totalCount = await queryable.CountAsync();

            var data = await queryable
                .OrderByDescending(p => p.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedData<Product>(data, totalCount);
        }



        public async Task<IEnumerable<Product>> GetActiveAsync()
        {
            return await dbContext.Set<Product>()
                .Where(p => !p.Deleted)
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetFeaturedAsync()
        {
            return await dbContext.Set<Product>()
                .Where(p => p.Featured && p.Visible && !p.Deleted)
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetByCategoryAsync(long categoryId)
        {
            return await dbContext.Set<Product>()
                .Where(p => p.CategoryId == categoryId && p.Visible && !p.Deleted)
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<Product?> GetWithDetailsAsync(long id)
        {
            return await dbContext.Set<Product>()
                .Where(p => p.Id == id && !p.Deleted)
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                .Include(p => p.Reviews)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Product>> GetWithDetailsAsync()
        {
            return await dbContext.Set<Product>()
                .Where(p => !p.Deleted)
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                .Include(p => p.Reviews)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> IsTitleExistsAsync(string title, long? excludeId = null)
        {
            var query = dbContext.Set<Product>()
                .Where(p => p.Title.ToLower() == title.ToLower() && !p.Deleted);

            if (excludeId.HasValue)
                query = query.Where(p => p.Id != excludeId.Value);

            return await query.AnyAsync();
        }

        public async Task<IEnumerable<Product>> SearchAsync(string searchTerm)
        {
            return await dbContext.Set<Product>()
                .Where(p => (p.Title.Contains(searchTerm) || p.Description.Contains(searchTerm))
                           && p.Visible && !p.Deleted)
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }
    }
}