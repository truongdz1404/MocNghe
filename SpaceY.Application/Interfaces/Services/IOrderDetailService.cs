using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs.Order;

namespace SpaceY.Application.Interfaces.Services
{
    public interface IOrderDetailService
    {
        Task<IEnumerable<OrderDetailDto>> GetOrderDetailsByOrderIdAsync(long orderId);
        Task<OrderDetailDto?> GetOrderDetailByIdAsync(long id);
        Task<OrderDetailDto?> UpdateOrderDetailAsync(long id, UpdateOrderDetailDto updateOrderDetailDto);
        Task<bool> DeleteOrderDetailAsync(long id);
    }
}