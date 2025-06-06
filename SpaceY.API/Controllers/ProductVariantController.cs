using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs.ProductVariant;

namespace SpaceY.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductVariantController : ControllerBase
    {
        private readonly IProductVariantService _service;

        public ProductVariantController(IProductVariantService service)
        {
            _service = service;
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetByProductId(long productId)
        {
            var data = await _service.GetByProductIdAsync(productId);
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductVariantDto dto)
        {
            var id = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetByProductId), new { productId = dto.ProductId }, id);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] ProductVariantDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return result ? Ok() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var result = await _service.DeleteAsync(id);
            return result ? Ok() : NotFound();
        }
    }
}