using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs.Color;

namespace SpaceY.Application.Interfaces.Services
{
    public interface IColorService
    {
        Task<IEnumerable<ColorDto>> GetAllActiveAsync();
        Task<ColorDto?> GetByIdAsync(long id);
        Task<long> CreateAsync(ColorDto dto);
        Task<bool> UpdateAsync(long id, ColorDto dto);
        Task<bool> DeleteAsync(long id);
    }
}