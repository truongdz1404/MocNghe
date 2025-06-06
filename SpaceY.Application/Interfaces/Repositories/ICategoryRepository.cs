using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.Entities;

namespace SpaceY.Application.Interfaces.Repositories
{
    public interface ICategoryRepository : IBaseRepository<Category>    
    {
        Task<IEnumerable<Category>> GetVisibleAsync();
        Task<IEnumerable<Category>> GetActiveAsync();
        Task<IEnumerable<Category>> GetCategoryRoomAsync();
        Task<IEnumerable<Category>> GetByIdsAsync(IEnumerable<long> ids);
        Task<bool> IsNameExistsAsync(string name, long? excludeId = null);
        Task<bool> IsUrlExistsAsync(string url, long? excludeId = null);
    }
}