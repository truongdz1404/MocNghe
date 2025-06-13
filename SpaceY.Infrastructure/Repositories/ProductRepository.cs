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
    public class ProductRepository
       : BaseRepository<Product>, IProductRepository
    {
        public ProductRepository(ApplicationDbContext _dbContext) : base(_dbContext) { }
        public async Task<IEnumerable<Product>> GetVisibleAsync()
        {
            return await _dbContext.Set<Product>()
                .Where(p => p.Visible && !p.Deleted)
                .Include(p => p.Categories)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Color)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Size)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<PaginatedData<Product>> GetPaginatedWithFilterAsync(int pageNumber, int pageSize, bool includeDeleted = false, long? categoryId = null)
        {
            IQueryable<Product> queryable = _dbContext.Set<Product>()
                .Include(p => p.Categories)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Color)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Size)
                .Include(p => p.Reviews);

            if (!includeDeleted)
            {
                queryable = queryable.Where(p => !p.Deleted);
            }

            if (categoryId.HasValue)
            {
                queryable = queryable.Where(p => p.Categories.Any(c => c.Id == categoryId.Value));
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
            return await _dbContext.Set<Product>()
                .Where(p => !p.Deleted)
                .Include(p => p.Categories)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Color)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Size)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetFeaturedAsync()
        {
            return await _dbContext.Set<Product>()
                .Where(p => p.Featured && p.Visible && !p.Deleted)
               .Include(p => p.Categories)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Color)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Size)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetByCategoryAsync(long categoryId)
        {
            return await _dbContext.Set<Product>()
                .Where(p => p.Categories.Any(c => c.Id == categoryId) && p.Visible && !p.Deleted) // Thay đổi logic
                .Include(p => p.Categories)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Color)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Size)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetByMultipleCategoriesAsync(List<long> categoryIds, bool useAndLogic = false)
        {

            IQueryable<Product> query = _dbContext.Products
                 .Include(p => p.Categories)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Color)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Size)
                .Where(p => !p.Deleted);

            if (useAndLogic)
            {
                query = query.Where(p => categoryIds.All(id => p.Categories.Any(c => c.Id == id)));
            }
            else
            {
                query = query.Where(p => p.Categories.Any(c => categoryIds.Contains(c.Id)));
            }

            return await query
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<Product?> GetWithDetailsAsync(long id)
        {
            return await _dbContext.Set<Product>()
                .Where(p => p.Id == id && !p.Deleted)
               .Include(p => p.Categories)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Color)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Size)
                .Include(p => p.Reviews)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Product>> GetWithDetailsAsync()
        {
            return await _dbContext.Set<Product>()
               .Include(p => p.Categories)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Color)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Size)
                .Include(p => p.Reviews)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> IsTitleExistsAsync(string title, long? excludeId = null)
        {
            var query = _dbContext.Set<Product>()
                .Where(p => p.Title.ToLower() == title.ToLower() && !p.Deleted);

            if (excludeId.HasValue)
                query = query.Where(p => p.Id != excludeId.Value);

            return await query.AnyAsync();
        }

        public async Task<IEnumerable<Product>> SearchAsync(string searchTerm)
        {
            return await _dbContext.Set<Product>()
                .Where(p => (p.Title.Contains(searchTerm) || p.Description.Contains(searchTerm))
                           && p.Visible && !p.Deleted)
                .Include(p => p.Categories)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Color)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.Size)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task AddCategoriesToProductAsync(long productId, List<long> categoryIds)
        {
            var product = await _dbContext.Set<Product>()
                .Include(p => p.Categories)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null) return;

            var categories = await _dbContext.Set<Category>()
                .Where(c => categoryIds.Contains(c.Id))
                .ToListAsync();

            foreach (var category in categories)
            {
                if (!product.Categories.Contains(category))
                {
                    product.Categories.Add(category);
                }
            }

            await _dbContext.SaveChangesAsync();
        }

        public async Task RemoveCategoriesFromProductAsync(long productId, List<long> categoryIds)
        {
            var product = await _dbContext.Set<Product>()
                .Include(p => p.Categories)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null) return;

            var categoriesToRemove = product.Categories
                .Where(c => categoryIds.Contains(c.Id))
                .ToList();

            foreach (var category in categoriesToRemove)
            {
                product.Categories.Remove(category);
            }

            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateProductCategoriesAsync(long productId, List<long> categoryIds)
        {
            var product = await _dbContext.Set<Product>()
                .Include(p => p.Categories)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null) return;

            product.Categories.Clear();

            var categories = await _dbContext.Set<Category>()
                .Where(c => categoryIds.Contains(c.Id))
                .ToListAsync();

            foreach (var category in categories)
            {
                product.Categories.Add(category);
            }

            await _dbContext.SaveChangesAsync();
        }
    }
}