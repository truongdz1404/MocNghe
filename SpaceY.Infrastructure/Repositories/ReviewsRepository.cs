using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SpaceY.Application.Interfaces.Repositories;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.DTOs.Review;
using SpaceY.Domain.Entities;
using SpaceY.Infrastructure.Data;

namespace SpaceY.Infrastructure.Repositories
{
    public class ReviewsRepository : BaseRepository<Reviews>, IReviewsRepository
    {
        private readonly ApplicationDbContext _context;

        public ReviewsRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Reviews>> GetReviewsByProductId(long productId)
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Product)
                .Where(r => r.ProductId == productId && !r.Deleted)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reviews>> GetReviewsByUserId(string userId)
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Product)
                .Where(r => r.UserId == userId && !r.Deleted)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<PaginatedData<Reviews>> GetReviewsWithFilters(ReviewFilterDto filter, int pageNumber, int pageSize)
        {
            var query = _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Product)
                .AsQueryable();

            if (!filter.IncludeDeleted)
            {
                query = query.Where(r => !r.Deleted);
            }

            if (filter.ProductId.HasValue)
            {
                query = query.Where(r => r.ProductId == filter.ProductId.Value);
            }

            if (!string.IsNullOrEmpty(filter.UserId))
            {
                query = query.Where(r => r.UserId == filter.UserId);
            }

            if (filter.Rating.HasValue)
            {
                query = query.Where(r => r.Rating == filter.Rating.Value);
            }

            if (filter.FromDate.HasValue)
            {
                query = query.Where(r => r.CreatedAt >= filter.FromDate.Value);
            }

            if (filter.ToDate.HasValue)
            {
                query = query.Where(r => r.CreatedAt <= filter.ToDate.Value);
            }

            var totalCount = await query.CountAsync();
            var reviews = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedData<Reviews>(reviews, totalCount);
        }

        public async Task<Reviews?> GetReviewByUserAndProduct(string userId, long productId)
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Product)
                .FirstOrDefaultAsync(r => r.UserId == userId && r.ProductId == productId && !r.Deleted);
        }

        public async Task<double> GetAverageRatingByProduct(long productId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.ProductId == productId && !r.Deleted)
                .ToListAsync();

            return reviews.Any() ? reviews.Average(r => r.Rating) : 0;
        }

        public async Task<int> GetTotalReviewsCountByProduct(long productId)
        {
            return await _context.Reviews
                .Where(r => r.ProductId == productId && !r.Deleted)
                .CountAsync();
        }

        public async Task<ReviewStatsDto> GetReviewStatsByProduct(long productId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.ProductId == productId && !r.Deleted)
                .ToListAsync();

            var stats = new ReviewStatsDto
            {
                ProductId = productId,
                TotalReviews = reviews.Count,
                AverageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0
            };

            // Calculate rating distribution
            for (int i = 1; i <= 5; i++)
            {
                stats.RatingDistribution[i] = reviews.Count(r => r.Rating == i);
            }

            return stats;
        }

        public async Task<Dictionary<int, int>> GetRatingDistributionByProduct(long productId)
        {
            var distribution = new Dictionary<int, int>();
            var reviews = await _context.Reviews
                .Where(r => r.ProductId == productId && !r.Deleted)
                .ToListAsync();

            for (int i = 1; i <= 5; i++)
            {
                distribution[i] = reviews.Count(r => r.Rating == i);
            }

            return distribution;
        }

        public async Task<bool> HasUserReviewedProduct(string userId, long productId)
        {
            return await _context.Reviews
                .AnyAsync(r => r.UserId == userId && r.ProductId == productId && !r.Deleted);
        }

        public async Task SoftDelete(long id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review != null)
            {
                review.Deleted = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Reviews>> GetRecentReviews(int count)
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Product)
                .Where(r => !r.Deleted)
                .OrderByDescending(r => r.CreatedAt)
                .Take(count)
                .ToListAsync();
        }
    }
}