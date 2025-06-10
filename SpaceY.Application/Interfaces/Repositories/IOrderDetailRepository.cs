using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.Entities;

namespace SpaceY.Application.Interfaces.Repositories
{
    public interface IOrderDetailRepository : IBaseRepository<OrderDetail>
    {
        Task<IEnumerable<OrderDetail>> GetOrderDetailsByOrderIdAsync(long orderId);
        Task<IEnumerable<OrderDetail>> GetOrderDetailsByProductIdAsync(long productId);
        Task<decimal> GetTotalSalesByProductAsync(long productId);
    }
}