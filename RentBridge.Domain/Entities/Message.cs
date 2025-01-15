using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace RentBridge.Domain.Entities
{
    [Table("tblMessages")]
    public class Message : BaseEntity
    {
        public string SenderId { get; set; } = null!;
        public string ReceiverId { get; set; } = null!;
        public string Content { get; set; } = null!;

        // Navigation properties
        public ApplicationUser Sender { get; set; } = null!;
        public ApplicationUser Receiver { get; set; } = null!;
    }

}