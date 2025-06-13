using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.DTOs.Review
{
    public class ReviewFilterDto
    {
        public long? ProductId { get; set; }
        public string? UserId { get; set; }
        public int? Rating { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public bool IncludeDeleted { get; set; } = false;
    }
}