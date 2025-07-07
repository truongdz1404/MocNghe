using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.DTOs.Order;
using SpaceY.Domain.Enums;

namespace SpaceY.Application.Interfaces.Services
{
    public interface IOrderService
    {
        Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
        Task<PaginatedData<OrderSummaryDto>> GetPaginatedOrdersAsync(int pageNumber, int pageSize);
        Task<OrderDto?> GetOrderByIdAsync(long id);
        Task<IEnumerable<OrderDto>> GetOrdersByUserIdAsync(string userId);
        Task<IEnumerable<OrderDto>> GetOrdersByStatusAsync(OrderStatus status);
        Task<OrderDto> CreateOrderAsync(CreateOrderDto createOrderDto);
        Task<OrderDto?> UpdateOrderStatusAsync(long id, UpdateOrderDto updateOrderDto);
        Task<bool> DeleteOrderAsync(long id);
        Task<decimal> GetTotalRevenueAsync();
        Task<decimal> GetRevenueByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<OrderSummaryDto>> GetRecentOrdersAsync(int count = 10);
    }
}