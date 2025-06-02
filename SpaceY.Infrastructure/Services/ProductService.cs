using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Application.Interfaces.Repositories;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.DTOs.Product;
using SpaceY.Domain.DTOs.ProductVariant;
using SpaceY.Domain.Entities;

namespace SpaceY.Infrastructure.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;

        public ProductService(IProductRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ProductDto>> GetAllAsync(bool includeDeleted = false)
        {
            var products = includeDeleted
                ? await _repository.GetAll()
                : await _repository.GetActiveAsync();

            return products.Select(MapToDto);
        }

        public async Task<IEnumerable<ProductDto>> GetVisibleAsync()
        {
            var products = await _repository.GetVisibleAsync();
            return products.Select(MapToDto);
        }

        public async Task<IEnumerable<ProductDto>> GetFeaturedAsync()
        {
            var products = await _repository.GetFeaturedAsync();
            return products.Select(MapToDto);
        }

        public async Task<IEnumerable<ProductDto>> GetByCategoryAsync(long categoryId)
        {
            var products = await _repository.GetByCategoryAsync(categoryId);
            return products.Select(MapToDto);
        }

        public async Task<PaginatedData<ProductDto>> GetPaginatedAsync(int pageNumber, int pageSize, bool includeDeleted = false)
        {
            var paginatedData = await _repository.GetPaginatedWithFilterAsync(pageNumber, pageSize, includeDeleted);
            var productDto = paginatedData.Data.Select(MapToDto).ToList();
            return new(productDto, paginatedData.TotalCount);
        }


        public async Task<ProductDto?> GetByIdAsync(long id, bool includeDetails = false)
        {
            var product = includeDetails
                ? await _repository.GetWithDetailsAsync(id)
                : await _repository.GetById(id);

            return product?.Deleted == true ? null : product != null ? MapToDto(product) : null;
        }

        public async Task<IEnumerable<ProductDto>> SearchAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return Enumerable.Empty<ProductDto>();

            var products = await _repository.SearchAsync(searchTerm.Trim());
            return products.Select(MapToDto);
        }

        public async Task<long> CreateAsync(CreateProductDto dto)
        {
            // Validation
            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new ArgumentException("Tiêu đề sản phẩm không được để trống");

            // Check duplicates
            if (await _repository.IsTitleExistsAsync(dto.Title.Trim()))
                throw new ArgumentException("Tiêu đề sản phẩm đã tồn tại");

            var product = new Product
            {
                Title = dto.Title.Trim(),
                Description = dto.Description.Trim(),
                CategoryId = dto.CategoryId,
                Featured = dto.Featured,
                Visible = dto.Visible,
                Deleted = false,
                CreatedAt = DateTime.UtcNow
            };
            var images = new List<Image>();
            foreach (var image in dto.Images)
            {
                images.Add(new Image
                {
                    Data = image.Url.Trim(),
                    CreatedAt = DateTime.UtcNow,
                    Id = image.Id,
                    Product = product,
                    ProductId = product.Id
                });
            }

            product.Images = images;

            var createdProduct = await _repository.Create(product);
            await _repository.SaveChangeAsync();

            return createdProduct.Id;
        }

        public async Task<bool> UpdateAsync(long id, UpdateProductDto dto)
        {
            var product = await _repository.GetById(id);
            if (product == null || product.Deleted) return false;

            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new ArgumentException("Tiêu đề sản phẩm không được để trống");

            if (await _repository.IsTitleExistsAsync(dto.Title.Trim(), id))
                throw new ArgumentException("Tiêu đề sản phẩm đã tồn tại");

            product.Title = dto.Title.Trim();
            product.Description = dto.Description.Trim();

            product.CategoryId = dto.CategoryId;
            product.Featured = dto.Featured;
            product.Visible = dto.Visible;
            var images = new List<Image>();
            foreach (var image in dto.Images)
            {
                images.Add(new Image
                {
                    Data = image.Url.Trim(),
                    CreatedAt = DateTime.UtcNow,
                    Id = image.Id,
                    Product = product,
                    ProductId = product.Id
                });
            }
            product.Images.Clear();
            product.Images = images;
            await _repository.Update(product);
            await _repository.SaveChangeAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var product = await _repository.GetById(id);
            if (product == null) return false;

            await _repository.Delete(product);
            await _repository.SaveChangeAsync();

            return true;
        }
        public async Task<bool> SoftDeleteAsync(long id)
        {
            var product = await _repository.GetById(id);
            if (product == null || product.Deleted) return false;

            product.Deleted = true;
            await _repository.Update(product);
            await _repository.SaveChangeAsync();

            return true;
        }

        public async Task<int> GetCountAsync()
        {
            return await _repository.CountAsync();
        }

        // Updated MapToDto method in ProductService
        private ProductDto MapToDto(Product product)
        {
            return new ProductDto
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.Name ?? string.Empty,
                Featured = product.Featured,
                Visible = product.Visible,
                Deleted = product.Deleted,
                CreatedAt = product.CreatedAt,
                ModifiedAt = product.ModifiedAt,
                Images = product.Images?.Where(i => !i.Deleted).Select(i => new ImageDto
                {
                    Id = i.Id,
                    Url = i.Data,
                    Alt = string.Empty,
                }).ToList() ?? new List<ImageDto>(),
                Variants = product.Variants?.Where(v => !v.Deleted && v.Visible).Select(v => new ProductVariantDto
                {
                    ProductId = v.ProductId,
                    ProductTypeId = v.ProductTypeId,
                    Name = v.ProductType?.Name ?? string.Empty,
                    Price = v.Price,
                    OriginalPrice = v.OriginalPrice,
                    Visible = v.Visible,
                }).ToList() ?? new List<ProductVariantDto>(),
                ReviewCount = product.Reviews?.Where(r => !r.Deleted).Count() ?? 0,
                AverageRating = product.Reviews?.Where(r => !r.Deleted).Any() == true
                    ? product.Reviews.Where(r => !r.Deleted).Average(r => r.Rating)
                    : 0
            };
        }

    }
}