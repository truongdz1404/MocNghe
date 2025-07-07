using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using SpaceY.Application.Interfaces.Repositories;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs.Order;

namespace SpaceY.Infrastructure.Services
{
    public class OrderDetailService : IOrderDetailService
    {
        private readonly IOrderDetailRepository _orderDetailRepository;
        private readonly IProductVariantRepository _productVariantRepository;
        private readonly IMapper _mapper;

        public OrderDetailService(
            IOrderDetailRepository orderDetailRepository,
            IProductVariantRepository productVariantRepository,
            IMapper mapper)
        {
            _orderDetailRepository = orderDetailRepository;
            _productVariantRepository = productVariantRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<OrderDetailDto>> GetOrderDetailsByOrderIdAsync(long orderId)
        {
            var orderDetails = await _orderDetailRepository.GetOrderDetailsByOrderIdAsync(orderId);
            return _mapper.Map<IEnumerable<OrderDetailDto>>(orderDetails);
        }

        public async Task<OrderDetailDto?> GetOrderDetailByIdAsync(long id)
        {
            var orderDetail = await _orderDetailRepository.GetOrderDetailWithRelationsAsync(id);
            return orderDetail == null ? null : _mapper.Map<OrderDetailDto>(orderDetail);
        }

        public async Task<OrderDetailDto?> UpdateOrderDetailAsync(long id, UpdateOrderDetailDto updateOrderDetailDto)
        {
            var orderDetail = await _orderDetailRepository.GetById(id);
            if (orderDetail == null) return null;

            var productVariant = await _productVariantRepository.GetById(orderDetail.ProductVariantId);
            if (productVariant == null) return null;

            orderDetail.Quantity = updateOrderDetailDto.Quantity;
            orderDetail.TotalPrice = productVariant.Price * updateOrderDetailDto.Quantity;
            await _orderDetailRepository.Update(orderDetail);
            await _orderDetailRepository.SaveChangeAsync();

            return _mapper.Map<OrderDetailDto>(orderDetail);
        }

        public async Task<bool> DeleteOrderDetailAsync(long id)
        {
            var orderDetail = await _orderDetailRepository.GetById(id);
            if (orderDetail == null) return false;

            await _orderDetailRepository.Delete(orderDetail);
            await _orderDetailRepository.SaveChangeAsync();
            return true;
        }
    }
}