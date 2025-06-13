using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.DTOs.Review;

namespace SpaceY.Application.Interfaces.Services
{
    public interface IReviewsService
    {
        Task<ReviewResponseDto> CreateReviewAsync(ReviewCreateDto reviewDto);
        Task<ReviewResponseDto> UpdateReviewAsync(long id, ReviewUpdateDto reviewDto);
        Task<bool> DeleteReviewAsync(long id);
        Task<ReviewResponseDto?> GetReviewByIdAsync(long id);
        Task<IEnumerable<ReviewResponseDto>> GetReviewsByProductIdAsync(long productId);
        Task<IEnumerable<ReviewResponseDto>> GetReviewsByUserIdAsync(string userId);
        Task<PaginatedData<ReviewResponseDto>> GetReviewsWithFiltersAsync(ReviewFilterDto filter, int pageNumber, int pageSize);
        Task<ReviewStatsDto> GetReviewStatsByProductAsync(long productId);
        Task<bool> HasUserReviewedProductAsync(string userId, long productId);
        Task<IEnumerable<ReviewResponseDto>> GetRecentReviewsAsync(int count);
        Task<bool> CanUserReviewProductAsync(string userId, long productId);
    }
}