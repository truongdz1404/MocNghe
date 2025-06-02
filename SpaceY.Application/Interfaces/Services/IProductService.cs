using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.DTOs.Product;

namespace SpaceY.Application.Interfaces.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllAsync(bool includeDeleted = false);
        Task<IEnumerable<ProductDto>> GetVisibleAsync();
        Task<IEnumerable<ProductDto>> GetFeaturedAsync();
        Task<IEnumerable<ProductDto>> GetByCategoryAsync(long categoryId);
        Task<PaginatedData<ProductDto>> GetPaginatedAsync(int pageNumber, int pageSize, bool includeDeleted = false);
        Task<ProductDto?> GetByIdAsync(long id, bool includeDetails = false);
        Task<IEnumerable<ProductDto>> SearchAsync(string searchTerm);
        Task<long> CreateAsync(CreateProductDto dto);
        Task<bool> UpdateAsync(long id, UpdateProductDto dto);
        Task<bool> DeleteAsync(long id);
        Task<bool> SoftDeleteAsync(long id);
        Task<int> GetCountAsync();
    }
}