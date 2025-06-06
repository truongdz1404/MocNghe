using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs.ProductVariant;

namespace SpaceY.Application.Interfaces.Services
{
    public interface IProductVariantService
    {
        Task<IEnumerable<ProductVariantDto>> GetByProductIdAsync(long productId);
        Task<long> CreateAsync(ProductVariantDto dto);
        Task<bool> DeleteAsync(long id);
        Task<bool> UpdateAsync(long id, ProductVariantDto dto);
    }
}