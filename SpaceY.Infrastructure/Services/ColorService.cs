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
    public class ColorService : IColorService
    {
        private readonly IColorRepository _repository;

        public ColorService(IColorRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ColorDto>> GetAllActiveAsync()
        {
            var colors = await _repository.GetActiveColorsAsync();

            return colors.Select(c => new ColorDto
            {
                Id = c.Id,
                Name = c.Name,
                HexCode = c.HexCode
            });
        }

        public async Task<ColorDto?> GetByIdAsync(long id)
        {
            var color = await _repository.GetById(id);
            if (color == null) return null;

            return new ColorDto
            {
                Id = color.Id,
                Name = color.Name,
                HexCode = color.HexCode
            };
        }

        public async Task<long> CreateAsync(ColorDto dto)
        {
            var entity = new Color
            {
                Name = dto.Name,
                HexCode = dto.HexCode,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _repository.Create(entity);
            return created.Id;
        }

        public async Task<bool> UpdateAsync(long id, ColorDto dto)
        {
            var entity = await _repository.GetById(id);
            if (entity == null) return false;

            entity.Name = dto.Name;
            entity.HexCode = dto.HexCode;
            await _repository.Update(entity);
            return true;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var entity = await _repository.GetById(id);
            if (entity == null) return false;

            entity.IsActive = true;
            await _repository.Update(entity);
            return true;
        }
    }
}