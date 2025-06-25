using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs.Blog;

namespace SpaceY.Application.Interfaces.Services
{
    public interface IBlogService
    {
        Task<IEnumerable<BlogDto>> GetAllAsync();
        Task<BlogDto> GetByIdAsync(long id);
        Task<BlogDto> CreateAsync(CreateBlogDto dto);
        Task<bool> UpdateAsync(long id, UpdateBlogDto dto);
        Task<bool> DeleteAsync(long id);
    }
}