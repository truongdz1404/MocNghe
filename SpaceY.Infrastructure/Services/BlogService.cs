using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Application.Interfaces.Repositories;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs.Blog;
using SpaceY.Domain.Entities;

namespace SpaceY.Infrastructure.Services
{
    public class BlogService : IBlogService
    {
        private readonly IBlogRepository _repository;

        public BlogService(IBlogRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<BlogDto>> GetAllAsync()
        {
            var blogs = await _repository.GetAllAsync();
            return blogs.Select(b => new BlogDto
            {
                Id = b.Id,
                Title = b.Title,
                Content = b.Content,
                CreatedAt = b.CreatedAt,
                Banner = b.Banner
            });
        }

        public async Task<BlogDto> GetByIdAsync(long id)
        {
            var blog = await _repository.GetByIdAsync(id);
            if (blog == null) return null;

            return new BlogDto
            {
                Id = blog.Id,
                Title = blog.Title,
                Content = blog.Content,
                CreatedAt = blog.CreatedAt,
                Banner = blog.Banner
            };
        }

        public async Task<BlogDto> CreateAsync(CreateBlogDto dto)
        {
            var blog = new Blog
            {
                Title = dto.Title,
                Content = dto.Content,
                CreatedAt = DateTime.UtcNow,
                Banner = dto.Banner
            };

            await _repository.AddAsync(blog);

            return new BlogDto
            {
                Id = blog.Id,
                Title = blog.Title,
                Content = blog.Content,
                CreatedAt = blog.CreatedAt,
                Banner = blog.Banner
            };
        }

        public async Task<bool> UpdateAsync(long id, UpdateBlogDto dto)
        {
            var blog = await _repository.GetByIdAsync(id);
            if (blog == null) return false;

            blog.Title = dto.Title;
            blog.Content = dto.Content;

            await _repository.UpdateAsync(blog);
            return true;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var blog = await _repository.GetByIdAsync(id);
            if (blog == null) return false;

            await _repository.DeleteAsync(blog);
            return true;
        }
    }
}