using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs.Order;
using SpaceY.Domain.Enums;

namespace SpaceY.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }
        private string GetCurrentUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(new { success = true, data = orders });
        }

        [HttpGet("paginated")]
        public async Task<IActionResult> GetPaginatedOrders([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var paginatedOrders = await _orderService.GetPaginatedOrdersAsync(pageNumber, pageSize);
            return Ok(new { success = true, data = paginatedOrders });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(long id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
                return NotFound(new { success = false, message = "Order not found" });

            return Ok(new { success = true, data = order });
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetOrdersByUserId()
        {
            var userId = GetCurrentUserId();
            var orders = await _orderService.GetOrdersByUserIdAsync(userId);
            return Ok(new { success = true, data = orders });
        }

        [HttpGet("status/{status}")]    
        public async Task<IActionResult> GetOrdersByStatus(OrderStatus status)
        {
            var orders = await _orderService.GetOrdersByStatusAsync(status);
            return Ok(new { success = true, data = orders });
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto createOrderDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Invalid model state", errors = ModelState });
            try
            {
                var userId =  GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { success = false, message = "User not authenticated" });
                createOrderDto.UserId = userId;
                var order = await _orderService.CreateOrderAsync(createOrderDto);
                return CreatedAtAction(nameof(GetOrderById), new { id = order.Id },
                    new { success = true, data = order });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(long id, [FromBody] UpdateOrderDto updateOrderDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Invalid model state", errors = ModelState });

            var updatedOrder = await _orderService.UpdateOrderStatusAsync(id, updateOrderDto);
            if (updatedOrder == null)
                return NotFound(new { success = false, message = "Order not found" });

            return Ok(new { success = true, data = updatedOrder });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(long id)
        {
            var result = await _orderService.DeleteOrderAsync(id);
            if (!result)
                return NotFound(new { success = false, message = "Order not found" });

            return Ok(new { success = true, message = "Order deleted successfully" });
        }

        [HttpGet("revenue/total")]
        public async Task<IActionResult> GetTotalRevenue()
        {
            var revenue = await _orderService.GetTotalRevenueAsync();
            return Ok(new { success = true, data = new { totalRevenue = revenue } });
        }

        [HttpGet("revenue/range")]
        public async Task<IActionResult> GetRevenueByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var revenue = await _orderService.GetRevenueByDateRangeAsync(startDate, endDate);
            return Ok(new { success = true, data = new { revenue, startDate, endDate } });
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentOrders([FromQuery] int count = 10)
        {
            var orders = await _orderService.GetRecentOrdersAsync(count);
            return Ok(new { success = true, data = orders });
        }
    }
}