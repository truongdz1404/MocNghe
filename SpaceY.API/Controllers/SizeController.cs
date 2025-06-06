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
    public class SizeController : ControllerBase
    {
        private readonly ISizeService _service;

        public SizeController(ISizeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var size = await _service.GetByIdAsync(id);
            return size == null ? NotFound() : Ok(size);
        }

        [HttpPost]
        public async Task<IActionResult> Create(SizeDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, SizeDto dto)
        {
            return await _service.UpdateAsync(id, dto)
                ? NoContent()
                : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            return await _service.DeleteAsync(id)
                ? NoContent()
                : NotFound();
        }
    }
}