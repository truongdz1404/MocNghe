using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceY.Domain.DTOs.Image
{
    public class CreateImageDto
    {
        public long Id { get; set; }
        public string Url { get; set; } = string.Empty;
    }
}