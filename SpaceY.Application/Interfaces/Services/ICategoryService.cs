using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.DTOs.Category;

namespace SpaceY.Application.Interfaces.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAllAsync(bool includeDeleted = false);
        Task<PaginatedData<CategoryDto>> GetPaginatedAsync(int pageNumber, int pageSize, bool includeDeleted = false);
        Task<CategoryDto?> GetByIdAsync(long id);
        Task<long> CreateAsync(CreateCategoryDto dto);
        Task<IEnumerable<CategoryDto>> GetCategoryRoomAsync();

        Task<bool> UpdateAsync(long id, UpdateCategoryDto dto);
        Task<bool> DeleteAsync(long id);
        Task<bool> SoftDeleteAsync(long id);
        Task<int> GetCountAsync();
    }
}