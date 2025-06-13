using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.DTOs.Review;
using SpaceY.Domain.Entities;

namespace SpaceY.Application.Interfaces.Repositories
{
    public interface IReviewsRepository : IBaseRepository<Reviews>
    {
        Task<IEnumerable<Reviews>> GetReviewsByProductId(long productId);
        Task<IEnumerable<Reviews>> GetReviewsByUserId(string userId);
        Task<PaginatedData<Reviews>> GetReviewsWithFilters(ReviewFilterDto filter, int pageNumber, int pageSize);
        Task<Reviews?> GetReviewByUserAndProduct(string userId, long productId);
        Task<double> GetAverageRatingByProduct(long productId);
        Task<int> GetTotalReviewsCountByProduct(long productId);
        Task<ReviewStatsDto> GetReviewStatsByProduct(long productId);
        Task<Dictionary<int, int>> GetRatingDistributionByProduct(long productId);
        Task<bool> HasUserReviewedProduct(string userId, long productId);
        Task SoftDelete(long id);
        Task<IEnumerable<Reviews>> GetRecentReviews(int count);
    }
}