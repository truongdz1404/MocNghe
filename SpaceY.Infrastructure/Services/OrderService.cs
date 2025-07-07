using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using SpaceY.Application.Interfaces.Repositories;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.DTOs.Order;
using SpaceY.Domain.Entities;
using SpaceY.Domain.Enums;

namespace SpaceY.Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderDetailRepository _orderDetailRepository;
        private readonly IProductRepository _productRepository;
        private readonly IProductVariantRepository _productVariantRepository;
        private readonly IMapper _mapper;

        public OrderService(
            IOrderRepository orderRepository,
            IOrderDetailRepository orderDetailRepository,
            IProductRepository productRepository,
            IProductVariantRepository productVariantRepository,
            IMapper mapper)
        {
            _orderRepository = orderRepository;
            _orderDetailRepository = orderDetailRepository;
            _productRepository = productRepository;
            _productVariantRepository = productVariantRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            var orders = await _orderRepository.GetOrdersWithDetailsAsync();
            return _mapper.Map<IEnumerable<OrderDto>>(orders);
        }

        public async Task<PaginatedData<OrderSummaryDto>> GetPaginatedOrdersAsync(int pageNumber, int pageSize)
        {
            var paginatedOrders = await _orderRepository.GetPaginatedData(pageNumber, pageSize);
            var orderSummaries = _mapper.Map<IEnumerable<OrderSummaryDto>>(paginatedOrders.Data);

            return new PaginatedData<OrderSummaryDto>(orderSummaries, paginatedOrders.TotalCount);
        }

        public async Task<OrderDto?> GetOrderByIdAsync(long id)
        {
            var order = await _orderRepository.GetOrderWithDetailsAsync(id);
            return order == null ? null : _mapper.Map<OrderDto>(order);
        }

        public async Task<IEnumerable<OrderDto>> GetOrdersByUserIdAsync(string userId)
        {
            var orders = await _orderRepository.GetOrdersByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<OrderDto>>(orders);
        }

        public async Task<IEnumerable<OrderDto>> GetOrdersByStatusAsync(OrderStatus status)
        {
            var orders = await _orderRepository.GetOrdersByStatusAsync(status);
            return _mapper.Map<IEnumerable<OrderDto>>(orders);
        }

        public async Task<OrderDto> CreateOrderAsync(CreateOrderDto createOrderDto)
        {
            var order = new Order
            {
                UserId = createOrderDto.UserId,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow,
            };

            decimal totalPrice = 0;
            var orderDetails = new List<OrderDetail>();

            foreach (var item in createOrderDto.OrderItems)
            {
                var product = await _productRepository.GetById(item.ProductId);
                var productVariant = await _productVariantRepository.GetById(item.ProductVariantId);

                if (product == null || productVariant == null)
                    throw new ArgumentException($"Product or ProductVariant not found");

                var itemTotalPrice = productVariant.Price * item.Quantity;
                totalPrice += itemTotalPrice;

                var orderDetail = new OrderDetail
                {
                    ProductId = item.ProductId,
                    ProductVariantId = item.ProductVariantId,
                    Quantity = item.Quantity,
                    TotalPrice = itemTotalPrice,
                    CreatedAt = DateTime.UtcNow,
                };

                orderDetails.Add(orderDetail);
            }

            order.TotalPrice = totalPrice;
            order.OrderItems = orderDetails;

            var createdOrder = await _orderRepository.Create(order);
            await _orderRepository.SaveChangeAsync();

            return _mapper.Map<OrderDto>(createdOrder);
        }

        public async Task<OrderDto?> UpdateOrderStatusAsync(long id, UpdateOrderDto updateOrderDto)
        {
            var order = await _orderRepository.GetById(id);
            if (order == null) return null;

            order.Status = updateOrderDto.Status;

            await _orderRepository.Update(order);
            await _orderRepository.SaveChangeAsync();

            return _mapper.Map<OrderDto>(order);
        }

        public async Task<bool> DeleteOrderAsync(long id)
        {
            var order = await _orderRepository.GetById(id);
            if (order == null) return false;

            await _orderRepository.Delete(order);
            await _orderRepository.SaveChangeAsync();
            return true;
        }

        public async Task<decimal> GetTotalRevenueAsync()
        {
            return await _orderRepository.GetTotalRevenueAsync();
        }

        public async Task<decimal> GetRevenueByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _orderRepository.GetRevenueByDateRangeAsync(startDate, endDate);
        }

        public async Task<IEnumerable<OrderSummaryDto>> GetRecentOrdersAsync(int count = 10)
        {
            var orders = await _orderRepository.GetRecentOrdersAsync(count);
            return _mapper.Map<IEnumerable<OrderSummaryDto>>(orders);
        }
    }
}