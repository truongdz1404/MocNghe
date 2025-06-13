using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.DTOs.Review;

namespace SpaceY.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewsService _reviewsService;

        public ReviewsController(IReviewsService reviewsService)
        {
            _reviewsService = reviewsService;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ReviewResponseDto>> CreateReview([FromBody] ReviewCreateDto reviewDto)
        {
            try
            {
                var review = await _reviewsService.CreateReviewAsync(reviewDto);
                return CreatedAtAction(nameof(GetReviewById), new { id = review.Id }, review);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while creating the review");
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ReviewResponseDto>> UpdateReview(long id, [FromBody] ReviewUpdateDto reviewDto)
        {
            try
            {
                var review = await _reviewsService.UpdateReviewAsync(id, reviewDto);
                return Ok(review);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating the review");
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteReview(long id)
        {
            try
            {
                var result = await _reviewsService.DeleteReviewAsync(id);
                if (!result)
                {
                    return NotFound("Review not found");
                }
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while deleting the review");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewResponseDto>> GetReviewById(long id)
        {
            try
            {
                var review = await _reviewsService.GetReviewByIdAsync(id);
                if (review == null)
                {
                    return NotFound("Review not found");
                }
                return Ok(review);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while retrieving the review");
            }
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<IEnumerable<ReviewResponseDto>>> GetReviewsByProduct(long productId)
        {
            try
            {
                var reviews = await _reviewsService.GetReviewsByProductIdAsync(productId);
                return Ok(reviews);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while retrieving reviews");
            }
        }

        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ReviewResponseDto>>> GetReviewsByUser(string userId)
        {
            try
            {
                var reviews = await _reviewsService.GetReviewsByUserIdAsync(userId);
                return Ok(reviews);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while retrieving reviews");
            }
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedData<ReviewResponseDto>>> GetReviews(
            [FromQuery] ReviewFilterDto filter,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var reviews = await _reviewsService.GetReviewsWithFiltersAsync(filter, pageNumber, pageSize);
                return Ok(reviews);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while retrieving reviews");
            }
        }

        [HttpGet("product/{productId}/stats")]
        public async Task<ActionResult<ReviewStatsDto>> GetReviewStats(long productId)
        {
            try
            {
                var stats = await _reviewsService.GetReviewStatsByProductAsync(productId);
                return Ok(stats);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while retrieving review statistics");
            }
        }

        [HttpGet("recent")]
        public async Task<ActionResult<IEnumerable<ReviewResponseDto>>> GetRecentReviews([FromQuery] int count = 10)
        {
            try
            {
                var reviews = await _reviewsService.GetRecentReviewsAsync(count);
                return Ok(reviews);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while retrieving recent reviews");
            }
        }

        [HttpGet("user/{userId}/product/{productId}/can-review")]
        [Authorize]
        public async Task<ActionResult<bool>> CanUserReviewProduct(string userId, long productId)
        {
            try
            {
                var canReview = await _reviewsService.CanUserReviewProductAsync(userId, productId);
                return Ok(canReview);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while checking review eligibility");
            }
        }
    }
}