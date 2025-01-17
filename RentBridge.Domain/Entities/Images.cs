using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace RentBridge.Domain.Entities
{
    [Table("tblImages")]
    public class Images
    {
        public string Id { get; set; } = string.Empty;
        public string PostId { get; set; } = string.Empty;

        public string ImageUrl { get; set; } = string.Empty;

        public Post Post { get; set; } = null!;
    }
}