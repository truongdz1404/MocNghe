using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.Entities;
using SpaceY.Domain.Enums;

namespace SpaceY.Application.Interfaces.Repositories
{
    public interface IOrderRepository : IBaseRepository<Order>
    {
        Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId);
        Task<IEnumerable<Order>> GetOrdersByStatusAsync(OrderStatus status);
        Task<Order?> GetOrderWithDetailsAsync(long orderId);
        Task<IEnumerable<Order>> GetOrdersWithDetailsAsync();
        Task<decimal> GetTotalRevenueAsync();
        Task<decimal> GetRevenueByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<Order>> GetRecentOrdersAsync(int count = 10);
    }
}