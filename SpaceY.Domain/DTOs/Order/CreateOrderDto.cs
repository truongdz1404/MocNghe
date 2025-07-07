using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.DTOs.Order
{
    public class CreateOrderDto
    {
        public string UserId { get; set; } = string.Empty;
        public List<CreateOrderDetailDto> OrderItems { get; set; } = new List<CreateOrderDetailDto>();
    }
    
}