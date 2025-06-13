using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.DTOs.Review
{
    public class ReviewStatsDto
    {
        public long ProductId { get; set; }
        public int TotalReviews { get; set; }
        public double AverageRating { get; set; }
        public Dictionary<int, int> RatingDistribution { get; set; } = new();
    }
}