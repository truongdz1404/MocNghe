using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.DTOs.Category
{
    public class GetByMultipleCategoriesRequest
    {
        public List<long> CategoryIds { get; set; } = new();
        public bool UseAndLogic { get; set; } = false;
    }
}