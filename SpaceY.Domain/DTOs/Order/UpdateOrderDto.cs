using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.Enums;

namespace SpaceY.Domain.DTOs.Order
{
    public class UpdateOrderDto
    {
        public OrderStatus Status { get; set; }
    }
}