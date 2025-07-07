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
    public class OrderDetailRepository : BaseRepository<OrderDetail>, IOrderDetailRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<OrderDetail>> GetOrderDetailsByOrderIdAsync(long orderId)
        {
            return await _context.OrderDetails
                .Where(od => od.OrderId == orderId)
                .Include(od => od.Product)
                .Include(od => od.ProductVariant)
                .ToListAsync();
        }

        public async Task<IEnumerable<OrderDetail>> GetOrderDetailsByProductIdAsync(long productId)
        {
            return await _context.OrderDetails
                .Where(od => od.ProductId == productId)
                .Include(od => od.Order)
                .Include(od => od.ProductVariant)
                .ToListAsync();
        }

        public async Task<OrderDetail?> GetOrderDetailWithRelationsAsync(long id)
        {
            return await _context.OrderDetails
                .Include(od => od.Order)
                .Include(od => od.Product)
                .Include(od => od.ProductVariant)
                .FirstOrDefaultAsync(od => od.Id == id);
        }
    }
}