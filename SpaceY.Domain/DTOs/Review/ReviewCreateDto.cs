using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.DTOs.Review
{
    public class ReviewCreateDto
    {
        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public long ProductId { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }

        [Required]
        [MaxLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters")]
        public string Comment { get; set; } = string.Empty;
    }
}