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
        Task<IEnumerable<Category>> GetActiveAsync(); // Not deleted
        Task<bool> IsNameExistsAsync(string name, long? excludeId = null);
        Task<bool> IsUrlExistsAsync(string url, long? excludeId = null);
    }
}