using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs.Color;

namespace SpaceY.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ColorController : ControllerBase
    {
        private readonly IColorService _service;

        public ColorController(IColorService service)
        {
            _service = service;
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetAllActive()
        {
            var colors = await _service.GetAllActiveAsync();
            return Ok(colors);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var color = await _service.GetByIdAsync(id);
            return color != null ? Ok(color) : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ColorDto dto)
        {
            var id = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] ColorDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            return updated ? Ok() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? Ok() : NotFound();
        }
    }
}