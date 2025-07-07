using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs.User;
using SpaceY.Domain.Enums;

namespace SpaceY.Domain.DTOs.Order
{
    public class OrderDto
    {
        public long Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
        public List<OrderDetailDto> OrderItems { get; set; } = new List<OrderDetailDto>();
        public UserDTO? User { get; set; }
    }
}