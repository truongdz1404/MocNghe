using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.DTOs.Product;
using SpaceY.Domain.Entities;

namespace SpaceY.Application.Interfaces.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllAsync(bool includeDeleted = false);
        Task<IEnumerable<ProductDto>> GetVisibleAsync();

        Task<IEnumerable<ProductDto>> GetFeaturedAsync();
        Task<IEnumerable<ProductDto>> GetByCategoryAsync(long categoryId);
        Task<PaginatedData<ProductDto>> GetPaginatedWithFilterAsync(int pageNumber, int pageSize, bool includeDeleted = false, long? categoryId = null);
        Task<ProductDto?> GetByIdAsync(long id, bool includeDetails = false);
        Task<IEnumerable<ProductDto>> SearchAsync(string searchTerm);
        Task<long> CreateAsync(CreateProductDto dto);
        public Task<bool> AddCategoriesToProductAsync(long productId, List<long> categoryIds);
        public Task<bool> RemoveCategoriesFromProductAsync(long productId, List<long> categoryIds);
        public Task<IEnumerable<ProductDto>> GetByMultipleCategoriesAsync(List<long> categoryIds, bool useAndLogic = false);

        Task<bool> UpdateAsync(long id, UpdateProductDto dto);
        Task<bool> DeleteAsync(long id);
        Task<bool> SoftDeleteAsync(long id);
        Task<int> GetCountAsync();
    }
}