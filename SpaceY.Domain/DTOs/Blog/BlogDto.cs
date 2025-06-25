using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.DTOs.Blog
{
    public class BlogDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Banner { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}