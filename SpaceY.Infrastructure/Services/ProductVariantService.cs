using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Application.Interfaces.Repositories;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs.ProductVariant;
using SpaceY.Domain.Entities;

namespace SpaceY.Infrastructure.Services
{
    public class ProductVariantService : IProductVariantService
    {
        private readonly IProductVariantRepository _repository;

        public ProductVariantService(IProductVariantRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ProductVariantDto>> GetByProductIdAsync(long productId)
        {
            var variants = await _repository.GetByProductIdAsync(productId);

            return variants.Select(v => new ProductVariantDto
            {
                Id = v.Id,
                ProductId = v.ProductId,
                ColorId = v.ColorId,
                SizeId = v.SizeId,
                Price = v.Price,
                OriginalPrice = v.OriginalPrice,
                Stock = v.Stock,
                SKU = v.SKU ?? string.Empty,
                Visible = v.Visible,
                DisplayName = $"{v.Color?.Name ?? "Default"} - {v.Size?.Name ?? "OneSize"}"
            });
        }

        public async Task<long> CreateAsync(ProductVariantDto dto)
        {
            var variant = new ProductVariant
            {
                ProductId = dto.ProductId,
                ColorId = dto.ColorId,
                SizeId = dto.SizeId,
                Price = dto.Price,
                OriginalPrice = dto.OriginalPrice,
                Stock = dto.Stock,
                SKU = dto.SKU,
                Visible = dto.Visible,
                Deleted = false,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _repository.Create(variant);
            return created.Id;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var variant = await _repository.GetById(id);
            if (variant == null) return false;

            variant.Deleted = true;
            await _repository.Update(variant);
            return true;
        }

        public async Task<bool> UpdateAsync(long id, ProductVariantDto dto)
        {
            var variant = await _repository.GetById(id);
            if (variant == null) return false;

            variant.ColorId = dto.ColorId;
            variant.SizeId = dto.SizeId;
            variant.Price = dto.Price;
            variant.OriginalPrice = dto.OriginalPrice;
            variant.Stock = dto.Stock;
            variant.SKU = dto.SKU;
            variant.Visible = dto.Visible;
            // variant.ModifiedAt = DateTime.UtcNow;
            await _repository.Update(variant);
            return true;
        }
    }
}