using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Application.Interfaces.Repositories;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs.Color;
using SpaceY.Domain.Entities;

namespace SpaceY.Infrastructure.Services
{
    public class SizeService : ISizeService
    {
        private readonly ISizeRepository _repository;

        public SizeService(ISizeRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<SizeDto>> GetAllAsync()
        {
            var sizes = await _repository.GetAll();
            return sizes.Select(s => new SizeDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description ?? ""
            });
        }

        public async Task<SizeDto?> GetByIdAsync(long id)
        {
            var size = await _repository.GetById(id);
            return size == null ? null : new SizeDto
            {
                Id = size.Id,
                Name = size.Name,
                Description = size.Description ?? ""
            };
        }

        public async Task<SizeDto> CreateAsync(SizeDto dto)
        {
            if (await _repository.IsNameExistsAsync(dto.Name))
                throw new ArgumentException("Tên size đã tồn tại");

            var entity = new Size
            {
                Name = dto.Name,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _repository.Create(entity);
            return new SizeDto
            {
                Id = result.Id,
                Name = result.Name,
                Description = result.Description ?? ""
            };
        }

        public async Task<bool> UpdateAsync(long id, SizeDto dto)
        {
            var size = await _repository.GetById(id);
            if (size == null) return false;

            if (await _repository.IsNameExistsAsync(dto.Name, id))
                throw new ArgumentException("Tên size đã tồn tại");

            size.Name = dto.Name;
            size.Description = dto.Description;
            await _repository.Update(size);
            return true;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var size = await _repository.GetById(id);
            if (size == null) return false;

            await _repository.Delete(size);
            return true;
        }
    }
}