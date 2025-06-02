using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs.Product;

namespace SpaceY.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] bool includeDeleted = false)
        {
            var products = await _productService.GetAllAsync(includeDeleted);
            return Ok(products);
        }

        [HttpGet("visible")]
        public async Task<IActionResult> GetVisible()
        {
            var products = await _productService.GetVisibleAsync();
            return Ok(products);
        }

        [HttpGet("featured")]
        public async Task<IActionResult> GetFeatured()
        {
            var products = await _productService.GetFeaturedAsync();
            return Ok(products);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(long categoryId)
        {
            var products = await _productService.GetByCategoryAsync(categoryId);
            return Ok(products);
        }

        [HttpGet("paginated")]
        public async Task<IActionResult> GetPaginated([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] bool includeDeleted = false)
        {
            var paginatedData = await _productService.GetPaginatedAsync(pageNumber, pageSize, includeDeleted);
            return Ok(paginatedData);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return BadRequest(new { Message = "Từ khóa tìm kiếm không được để trống" });

            var products = await _productService.SearchAsync(searchTerm);
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id, [FromQuery] bool includeDetails = false)
        {
            var product = await _productService.GetByIdAsync(id, includeDetails);
            return product == null ? NotFound($"Không tìm thấy sản phẩm với ID: {id}") : Ok(product);
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetCount()
        {
            var count = await _productService.GetCountAsync();
            return Ok(new { Count = count });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var id = await _productService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id }, new { Id = id, Message = "Tạo sản phẩm thành công" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Lỗi server", Error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] UpdateProductDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var success = await _productService.UpdateAsync(id, dto);
                return success
                    ? Ok(new { Message = "Cập nhật sản phẩm thành công" })
                    : NotFound(new { Message = $"Không tìm thấy sản phẩm với ID: {id}" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Lỗi server", Error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            try
            {
                var success = await _productService.DeleteAsync(id);
                return success
                    ? Ok(new { Message = "Xóa sản phẩm thành công" })
                    : NotFound(new { Message = $"Không tìm thấy sản phẩm với ID: {id}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Lỗi server", Error = ex.Message });
            }
        }

        [HttpPatch("{id}/soft-delete")]
        public async Task<IActionResult> SoftDelete(long id)
        {
            try
            {
                var success = await _productService.SoftDeleteAsync(id);
                return success
                    ? Ok(new { Message = "Ẩn sản phẩm thành công" })
                    : NotFound(new { Message = $"Không tìm thấy sản phẩm với ID: {id}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Lỗi server", Error = ex.Message });
            }
        }
    }
}