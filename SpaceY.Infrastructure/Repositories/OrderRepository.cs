using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SpaceY.Application.Interfaces.Repositories;
using SpaceY.Domain.Entities;
using SpaceY.Domain.Enums;
using SpaceY.Infrastructure.Data;

namespace SpaceY.Infrastructure.Repositories
{
    public class OrderRepository : BaseRepository<Order>, IOrderRepository
    {
        private readonly ApplicationDbContext _context;
        public OrderRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductVariant)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetOrdersByStatusAsync(OrderStatus status)
        {
            return await _context.Orders
                .Where(o => o.Status == status)
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<Order?> GetOrderWithDetailsAsync(long orderId)
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductVariant)
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        public async Task<IEnumerable<Order>> GetOrdersWithDetailsAsync()
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductVariant)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<decimal> GetTotalRevenueAsync()
        {
            return await _context.Orders
                .Where(o => o.Status == OrderStatus.Completed)
                .SumAsync(o => o.TotalPrice);
        }

        public async Task<decimal> GetRevenueByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Orders
                .Where(o => o.Status == OrderStatus.Completed &&
                           o.CreatedAt >= startDate &&
                           o.CreatedAt <= endDate)
                .SumAsync(o => o.TotalPrice);
        }

        public async Task<IEnumerable<Order>> GetRecentOrdersAsync(int count = 10)
        {
            return await _context.Orders
                .Include(o => o.User)
                .OrderByDescending(o => o.CreatedAt)
                .Take(count)
                .ToListAsync();
        }
    }
}