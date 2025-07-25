using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Application.Interfaces.Repositories;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.DTOs.Category;
using SpaceY.Domain.DTOs.Color;
using SpaceY.Domain.DTOs.Product;
using SpaceY.Domain.DTOs.ProductVariant;
using SpaceY.Domain.Entities;

namespace SpaceY.Infrastructure.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;
        private readonly ICategoryRepository _categoryRepository;

        public ProductService(IProductRepository repository, ICategoryRepository categoryRepository)
        {
            _repository = repository;
            _categoryRepository = categoryRepository;
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

        public async Task<IEnumerable<ProductDto>> GetByMultipleCategoriesAsync(List<long> categoryIds, bool useAndLogic = false)
        {
            var products = await _repository.GetByMultipleCategoriesAsync(categoryIds, useAndLogic);
            return products.Select(MapToDto);
        }

        public async Task<PaginatedData<ProductDto>> GetPaginatedWithFilterAsync(int pageNumber, int pageSize, bool includeDeleted = false, long? categoryId = null)
        {
            PaginatedData<Product> paginatedData;
            if (categoryId.HasValue)
            {
                paginatedData = await _repository.GetPaginatedWithFilterAsync(pageNumber, pageSize, includeDeleted, categoryId);
            }
            else
            {
                paginatedData = await _repository.GetPaginatedWithFilterAsync(pageNumber, pageSize, includeDeleted);

            }
            var productDto = paginatedData.Data.Select(MapToDto).ToList();
            return new(productDto, paginatedData.TotalCount);
        }

        public async Task<ProductDto?> GetByIdAsync(long id, bool includeDetails = false)
        {
            var product = includeDetails
                ? await _repository.GetWithDetailsAsync(id)
                : await _repository.GetById(id);

            return product != null ? MapToDto(product) : null;
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

            // Validate categories exist
            if (dto.CategoryIds?.Any() == true)
            {
                var existingCategories = await _categoryRepository.GetByIdsAsync(dto.CategoryIds);
                if (existingCategories.Count() != dto.CategoryIds.Count)
                    throw new ArgumentException("Một số category không tồn tại");
            }

            var product = new Product
            {
                Title = dto.Title.Trim(),
                Description = dto.Description?.Trim() ?? string.Empty,
                Featured = dto.Featured,
                Visible = dto.Visible,
                Deleted = false,
                CreatedAt = DateTime.UtcNow
            };

            // Add categories
            if (dto.CategoryIds?.Any() == true)
            {
                var categories = await _categoryRepository.GetByIdsAsync(dto.CategoryIds);
                product.Categories = categories.ToList();
            }

            // Add images (EF sẽ tự động set ProductId khi save)
            var images = new List<Image>();
            foreach (var image in dto.Images)
            {
                images.Add(new Image
                {
                    Data = image.Url.Trim(),
                    CreatedAt = DateTime.UtcNow
                    // Không cần set ProductId ở đây, EF sẽ tự động handle
                });
            }
            product.Images = images;

            // Add variants (EF sẽ tự động set ProductId khi save)
            var variants = new List<ProductVariant>();
            foreach (var variantDto in dto.Variants)
            {
                variants.Add(new ProductVariant
                {
                    ColorId = variantDto.ColorId,
                    SizeId = variantDto.SizeId,
                    Price = variantDto.Price,
                    OriginalPrice = variantDto.OriginalPrice,
                    Stock = variantDto.Stock,
                    SKU = variantDto.SKU,
                    Visible = variantDto.Visible,
                    Deleted = false,
                    CreatedAt = DateTime.UtcNow
                    // Không cần set ProductId ở đây, EF sẽ tự động handle
                });
            }
            product.Variants = variants;

            // CHỈ GỌI Create MỘT LẦN và SaveChanges MỘT LẦN
            await _repository.Create(product);
            await _repository.SaveChangeAsync();

            return product.Id;
        }
        public async Task<bool> UpdateAsync(long id, UpdateProductDto dto)
        {
            var product = await _repository.GetById(id);
            if (product == null || product.Deleted) return false;

            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new ArgumentException("Tiêu đề sản phẩm không được để trống");

            if (await _repository.IsTitleExistsAsync(dto.Title.Trim(), id))
                throw new ArgumentException("Tiêu đề sản phẩm đã tồn tại");

            // Validate categories exist
            if (dto.CategoryIds?.Any() == true)
            {
                var existingCategories = await _categoryRepository.GetByIdsAsync(dto.CategoryIds);
                if (existingCategories.Count() != dto.CategoryIds.Count)
                    throw new ArgumentException("Một số category không tồn tại");
            }

            product.Title = dto.Title.Trim();
            product.Description = dto.Description.Trim();
            product.Featured = dto.Featured;
            product.Visible = dto.Visible;

            if (dto.CategoryIds?.Any() == true)
            {
                await _repository.UpdateProductCategoriesAsync(id, dto.CategoryIds.ToList());
            }
            else
            {
                await _repository.UpdateProductCategoriesAsync(id, new List<long>());
            }

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

            var variants = new List<ProductVariant>();
            foreach (var variantDto in dto.Variants)
            {
                variants.Add(new ProductVariant
                {
                    ColorId = variantDto.ColorId,
                    SizeId = variantDto.SizeId,
                    Price = variantDto.Price,
                    OriginalPrice = variantDto.OriginalPrice,
                    Stock = variantDto.Stock,
                    SKU = variantDto.SKU,
                    Visible = variantDto.Visible,
                    Deleted = false,
                    CreatedAt = DateTime.UtcNow,
                    Product = product,
                    ProductId = product.Id
                });
            }
            product.Variants.Clear();
            product.Variants = variants;

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

        public async Task<bool> AddCategoriesToProductAsync(long productId, List<long> categoryIds)
        {
            try
            {
                await _repository.AddCategoriesToProductAsync(productId, categoryIds);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> RemoveCategoriesFromProductAsync(long productId, List<long> categoryIds)
        {
            try
            {
                await _repository.RemoveCategoriesFromProductAsync(productId, categoryIds);
                return true;
            }
            catch
            {
                return false;
            }
        }

        private ProductDto MapToDto(Product product)
        {
            return new ProductDto
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,

                // Cập nhật để hiển thị nhiều categories
                // CategoryIds = product.Categories?.Select(c => c.Id).ToList() ?? new List<long>(),
                Categories = product.Categories?.Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Url = c.Url,
                    Visible = c.Visible,
                    Deleted = c.Deleted
                }).ToList() ?? new List<CategoryDto>(),

                Featured = product.Featured,
                Visible = product.Visible,
                Deleted = product.Deleted,
                CreatedAt = product.CreatedAt,
                ModifiedAt = product.ModifiedAt,
                Image2DUrl = product.Image2DUrl,

                Images = product.Images?.Where(i => !i.Deleted).Select(i => new ImageDto
                {
                    Id = i.Id,
                    Url = i.Data,
                    Alt = string.Empty,
                }).ToList() ?? new List<ImageDto>(),

                Variants = product.Variants?.Where(v => !v.Deleted && v.Visible).Select(v => new ProductVariantDto
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
                }).ToList() ?? new List<ProductVariantDto>(),

                ReviewCount = product.Reviews?.Where(r => !r.Deleted).Count() ?? 0,
                AverageRating = product.Reviews?.Where(r => !r.Deleted).Any() == true
                    ? product.Reviews.Where(r => !r.Deleted).Average(r => r.Rating)
                    : 0,

                MinPrice = product.MinPrice,
                MaxPrice = product.MaxPrice,
                InStock = product.InStock,
                TotalStock = product.TotalStock,

                AvailableColors = product.AvailableColors?.Select(c => new ColorDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    HexCode = c.HexCode,
                }).ToList() ?? new List<ColorDto>(),

                AvailableSizes = product.AvailableSizes?.Select(s => new SizeDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description ?? string.Empty,
                }).ToList() ?? new List<SizeDto>(),
            };
        }
    }
}