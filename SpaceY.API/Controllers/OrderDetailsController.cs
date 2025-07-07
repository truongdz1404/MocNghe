using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs.Order;

namespace SpaceY.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize]
    public class OrderDetailsController : ControllerBase
    {
        private readonly IOrderDetailService _orderDetailService;

        public OrderDetailsController(IOrderDetailService orderDetailService)
        {
            _orderDetailService = orderDetailService;
        }

        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetOrderDetailsByOrderId(long orderId)
        {
            var orderDetails = await _orderDetailService.GetOrderDetailsByOrderIdAsync(orderId);
            return Ok(new { success = true, data = orderDetails });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetailById(long id)
        {
            var orderDetail = await _orderDetailService.GetOrderDetailByIdAsync(id);
            if (orderDetail == null)
                return NotFound(new { success = false, message = "Order detail not found" });

            return Ok(new { success = true, data = orderDetail });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrderDetail(long id, [FromBody] UpdateOrderDetailDto updateOrderDetailDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Invalid model state", errors = ModelState });

            var updatedOrderDetail = await _orderDetailService.UpdateOrderDetailAsync(id, updateOrderDetailDto);
            if (updatedOrderDetail == null)
                return NotFound(new { success = false, message = "Order detail not found" });

            return Ok(new { success = true, data = updatedOrderDetail });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderDetail(long id)
        {
            var result = await _orderDetailService.DeleteOrderDetailAsync(id);
            if (!result)
                return NotFound(new { success = false, message = "Order detail not found" });

            return Ok(new { success = true, message = "Order detail deleted successfully" });
        }
    }
}