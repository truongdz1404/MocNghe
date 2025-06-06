using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.Entities;

namespace SpaceY.Application.Interfaces.Repositories
{
    public interface IProductRepository : IBaseRepository<Product>
    {
        Task<IEnumerable<Product>> GetVisibleAsync();
        Task<IEnumerable<Product>> GetActiveAsync(); // Not deleted
        Task<IEnumerable<Product>> GetFeaturedAsync();
        Task<IEnumerable<Product>> GetByCategoryAsync(long categoryId);
        Task<Product?> GetWithDetailsAsync(long id);
        Task<IEnumerable<Product>> GetWithDetailsAsync();
        Task<bool> IsTitleExistsAsync(string title, long? excludeId = null);
        public Task<IEnumerable<Product>> GetByMultipleCategoriesAsync(List<long> categoryIds, bool useAndLogic = false);
        public Task UpdateProductCategoriesAsync(long productId, List<long> categoryIds);
        public Task AddCategoriesToProductAsync(long productId, List<long> categoryIds);
        public Task RemoveCategoriesFromProductAsync(long productId, List<long> categoryIds);

        Task<PaginatedData<Product>> GetPaginatedWithFilterAsync(int pageNumber, int pageSize, bool includeDeleted = false, long? categoryId = null);
        Task<IEnumerable<Product>> SearchAsync(string searchTerm);
    }
}