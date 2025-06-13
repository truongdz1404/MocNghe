using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using SpaceY.Application.Interfaces.Repositories;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.DTOs.Review;
using SpaceY.Domain.Entities;

namespace SpaceY.Infrastructure.Services
{
    public class ReviewsService : IReviewsService
    {
        private readonly IReviewsRepository _reviewsRepository;
        private readonly IMapper _mapper;

        public ReviewsService(IReviewsRepository reviewsRepository, IMapper mapper)
        {
            _reviewsRepository = reviewsRepository;
            _mapper = mapper;
        }

        public async Task<ReviewResponseDto> CreateReviewAsync(ReviewCreateDto reviewDto)
        {
            // Check if user has already reviewed this product
            var existingReview = await _reviewsRepository.GetReviewByUserAndProduct(reviewDto.UserId, reviewDto.ProductId);
            if (existingReview != null)
            {
                throw new InvalidOperationException("User has already reviewed this product");
            }

            var review = new Reviews
            {
                UserId = reviewDto.UserId,
                ProductId = reviewDto.ProductId,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                CreatedAt = DateTime.UtcNow,
                // ModifiedAt = DateTime.UtcNow
            };

            var createdReview = await _reviewsRepository.Create(review);
            await _reviewsRepository.SaveChangeAsync();

            // Get the created review with navigation properties
            var reviewWithNav = await _reviewsRepository.GetById(createdReview.Id);
            return MapToResponseDto(reviewWithNav);
        }

        public async Task<ReviewResponseDto> UpdateReviewAsync(long id, ReviewUpdateDto reviewDto)
        {
            var review = await _reviewsRepository.GetById(id);
            if (review == null || review.Deleted)
            {
                throw new ArgumentException("Review not found");
            }

            review.Rating = reviewDto.Rating;
            review.Comment = reviewDto.Comment;
            // review.ModifiedAt = DateTime.UtcNow;

            await _reviewsRepository.Update(review);
            await _reviewsRepository.SaveChangeAsync();

            var updatedReview = await _reviewsRepository.GetById(id);
            return MapToResponseDto(updatedReview);
        }

        public async Task<bool> DeleteReviewAsync(long id)
        {
            var review = await _reviewsRepository.GetById(id);
            if (review == null || review.Deleted)
            {
                return false;
            }

            await _reviewsRepository.SoftDelete(id);
            return true;
        }

        public async Task<ReviewResponseDto?> GetReviewByIdAsync(long id)
        {
            var review = await _reviewsRepository.GetById(id);
            if (review == null || review.Deleted)
            {
                return null;
            }

            return MapToResponseDto(review);
        }

        public async Task<IEnumerable<ReviewResponseDto>> GetReviewsByProductIdAsync(long productId)
        {
            var reviews = await _reviewsRepository.GetReviewsByProductId(productId);
            return reviews.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<ReviewResponseDto>> GetReviewsByUserIdAsync(string userId)
        {
            var reviews = await _reviewsRepository.GetReviewsByUserId(userId);
            return reviews.Select(MapToResponseDto);
        }

        public async Task<PaginatedData<ReviewResponseDto>> GetReviewsWithFiltersAsync(ReviewFilterDto filter, int pageNumber, int pageSize)
        {
            var paginatedReviews = await _reviewsRepository.GetReviewsWithFilters(filter, pageNumber, pageSize);
            var reviewDtos = paginatedReviews.Data.Select(MapToResponseDto);

            return new PaginatedData<ReviewResponseDto>(reviewDtos, paginatedReviews.TotalCount);
        }

        public async Task<ReviewStatsDto> GetReviewStatsByProductAsync(long productId)
        {
            return await _reviewsRepository.GetReviewStatsByProduct(productId);
        }

        public async Task<bool> HasUserReviewedProductAsync(string userId, long productId)
        {
            return await _reviewsRepository.HasUserReviewedProduct(userId, productId);
        }

        public async Task<IEnumerable<ReviewResponseDto>> GetRecentReviewsAsync(int count)
        {
            var reviews = await _reviewsRepository.GetRecentReviews(count);
            return reviews.Select(MapToResponseDto);
        }

        public async Task<bool> CanUserReviewProductAsync(string userId, long productId)
        {
            // Add business logic here (e.g., check if user has purchased the product)
            // For now, just check if they haven't reviewed it yet
            return !await _reviewsRepository.HasUserReviewedProduct(userId, productId);
        }

        private ReviewResponseDto MapToResponseDto(Reviews review)
        {
            return new ReviewResponseDto
            {
                Id = review.Id,
                UserId = review.UserId,
                UserName = review.User?.UserName ?? string.Empty,
                ProductId = review.ProductId,
                ProductName = review.Product?.Title ?? string.Empty,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt,
                ModifiedAt = review.ModifiedAt
            };
        }
    }
}