using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.Entities;

namespace SpaceY.Application.Interfaces.Repositories
{
    public interface IBlogRepository
    {
        Task<IEnumerable<Blog>> GetAllAsync();
        Task<Blog> GetByIdAsync(long id);
        Task AddAsync(Blog blog);
        Task UpdateAsync(Blog blog);
        Task DeleteAsync(Blog blog);
    }
}