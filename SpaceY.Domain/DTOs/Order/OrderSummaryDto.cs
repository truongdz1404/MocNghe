using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.Enums;

namespace SpaceY.Domain.DTOs.Order
{
    public class OrderSummaryDto
    {
        public long OrderId { get; set; }
        public decimal TotalAmount { get; set; }
        public int TotalItems { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime OrderDate { get; set; }
    }
}