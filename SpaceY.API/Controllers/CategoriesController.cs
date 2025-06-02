using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs.Category;

namespace SpaceY.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
            private readonly ICategoryService _categoryService;

            public CategoriesController(ICategoryService categoryService)
            {
                _categoryService = categoryService;
            }

            [HttpGet]
            public async Task<IActionResult> GetAll([FromQuery] bool includeDeleted = false)
            {
                var categories = await _categoryService.GetAllAsync(includeDeleted);
                return Ok(categories);
            }

            [HttpGet("paginated")]
            public async Task<IActionResult> GetPaginated([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] bool includeDeleted = false)
            {
                var paginatedData = await _categoryService.GetPaginatedAsync(pageNumber, pageSize, includeDeleted);
                return Ok(paginatedData);
            }

            [HttpGet("{id}")]
            public async Task<IActionResult> GetById(int id)
            {
                var category = await _categoryService.GetByIdAsync(id);
                return category == null ? NotFound($"Không tìm thấy danh mục với ID: {id}") : Ok(category);
            }

            [HttpGet("count")]
            public async Task<IActionResult> GetCount()
            {
                var count = await _categoryService.GetCountAsync();
                return Ok(new { Count = count });
            }

            [HttpPost]
            public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
            {
                try
                {
                    if (!ModelState.IsValid)
                        return BadRequest(ModelState);

                    var id = await _categoryService.CreateAsync(dto);
                    return CreatedAtAction(nameof(GetById), new { id }, new { Id = id, Message = "Tạo danh mục thành công" });
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
            public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDto dto)
            {
                try
                {
                    if (!ModelState.IsValid)
                        return BadRequest(ModelState);

                    var success = await _categoryService.UpdateAsync(id, dto);
                    return success
                        ? Ok(new { Message = "Cập nhật danh mục thành công" })
                        : NotFound(new { Message = $"Không tìm thấy danh mục với ID: {id}" });
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
            public async Task<IActionResult> Delete(int id)
            {
                try
                {
                    var success = await _categoryService.DeleteAsync(id);
                    return success
                        ? Ok(new { Message = "Xóa danh mục thành công" })
                        : NotFound(new { Message = $"Không tìm thấy danh mục với ID: {id}" });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { Message = "Lỗi server", Error = ex.Message });
                }
            }

            [HttpPatch("{id}/soft-delete")]
            public async Task<IActionResult> SoftDelete(int id)
            {
                try
                {
                    var success = await _categoryService.SoftDeleteAsync(id);
                    return success
                        ? Ok(new { Message = "Ẩn danh mục thành công" })
                        : NotFound(new { Message = $"Không tìm thấy danh mục với ID: {id}" });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { Message = "Lỗi server", Error = ex.Message });
                }
            }
        }
    }