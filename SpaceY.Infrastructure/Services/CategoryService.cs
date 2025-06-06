using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Application.Interfaces.Repositories;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.DTOs.Category;
using SpaceY.Domain.Entities;

namespace SpaceY.Infrastructure.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;

        public CategoryService(ICategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllAsync(bool includeDeleted = false)
        {
            var categories = includeDeleted
                ? await _repository.GetAll()
                : await _repository.GetActiveAsync();

            return categories.Select(MapToDto);
        }

        public async Task<PaginatedData<CategoryDto>> GetPaginatedAsync(int pageNumber, int pageSize, bool includeDeleted = false)
        {
            var paginatedData = await _repository.GetPaginatedData(pageNumber, pageSize);


            var categoryDto = paginatedData.Data.Select(MapToDto).ToList();
            return new(categoryDto, paginatedData.TotalCount);
        }

        public async Task<CategoryDto?> GetByIdAsync(long id)
        {
            var category = await _repository.GetById(id);
            return category?.Deleted == true ? null : category != null ? MapToDto(category) : null;
        }

        public async Task<long> CreateAsync(CreateCategoryDto dto)
        {
            // Validation
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new ArgumentException("Tên danh mục không được để trống");

            var url = string.IsNullOrWhiteSpace(dto.Url) ? GenerateUrl(dto.Name) : dto.Url.Trim();

            // Check duplicates
            if (await _repository.IsNameExistsAsync(dto.Name.Trim()))
                throw new ArgumentException("Tên danh mục đã tồn tại");

            if (await _repository.IsUrlExistsAsync(url))
                throw new ArgumentException("URL đã tồn tại");

            var category = new Category
            {
                Name = dto.Name.Trim(),
                Url = url,
                Visible = dto.Visible,
                Deleted = false
            };

            var createdCategory = await _repository.Create(category);
            await _repository.SaveChangeAsync();

            return createdCategory.Id;
        }

        public async Task<bool> UpdateAsync(long id, UpdateCategoryDto dto)
        {
            var category = await _repository.GetById(id);
            if (category == null || category.Deleted) return false;

            // Validation
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new ArgumentException("Tên danh mục không được để trống");

            // Check duplicates (exclude current record)
            if (await _repository.IsNameExistsAsync(dto.Name.Trim(), id))
                throw new ArgumentException("Tên danh mục đã tồn tại");

            if (await _repository.IsUrlExistsAsync(dto.Url.Trim(), id))
                throw new ArgumentException("URL đã tồn tại");

            // Update
            category.Name = dto.Name.Trim();
            category.Url = dto.Url.Trim();
            category.Visible = dto.Visible;

            await _repository.Update(category);
            await _repository.SaveChangeAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var category = await _repository.GetById(id);
            if (category == null) return false;

            await _repository.Delete(category);
            await _repository.SaveChangeAsync();

            return true;
        }

        public async Task<bool> SoftDeleteAsync(long id)
        {
            var category = await _repository.GetById(id);
            if (category == null || category.Deleted) return false;

            category.Deleted = true;
            await _repository.Update(category);
            await _repository.SaveChangeAsync();

            return true;
        }

        public async Task<int> GetCountAsync()
        {
            return await _repository.CountAsync();
        }

        private CategoryDto MapToDto(Category category)
        {
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Url = category.Url,
                Visible = category.Visible,
                Deleted = category.Deleted
            };
        }

        private string GenerateUrl(string name)
        {
            return name.ToLower()
                      .Replace(" ", "-")
                      .Replace("&", "and")
                      .Replace("đ", "d")
                      .Replace("ă", "a")
                      .Replace("â", "a")
                      .Replace("ê", "e")
                      .Replace("ô", "o")
                      .Replace("ơ", "o")
                      .Replace("ư", "u")
                      .Trim();
        }

        public async Task<IEnumerable<CategoryDto>> GetCategoryRoomAsync()
        {
            var categories = await _repository.GetCategoryRoomAsync();
            return categories.Select(MapToDto);
        }
    }
}