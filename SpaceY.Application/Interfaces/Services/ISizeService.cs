using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs.Color;

namespace SpaceY.Application.Interfaces.Services
{
    public interface ISizeService
    {
        Task<IEnumerable<SizeDto>> GetAllAsync();
        Task<SizeDto?> GetByIdAsync(long id);
        Task<SizeDto> CreateAsync(SizeDto dto);
        Task<bool> UpdateAsync(long id, SizeDto dto);
        Task<bool> DeleteAsync(long id);
    }
}