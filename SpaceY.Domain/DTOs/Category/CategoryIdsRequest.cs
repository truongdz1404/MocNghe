using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.DTOs.Category
{
    public class CategoryIdsRequest
    {
        public List<long> CategoryIds { get; set; } = new();

    }
}