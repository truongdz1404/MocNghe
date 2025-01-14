using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RentBridge.Domain.Entities
{
    public class Message : BaseEntity
    {
        public long SenderId { get; set; }
        public long ReceiverId { get; set; }
        public string Content { get; set; } = null!;

        // Navigation properties
        public User Sender { get; set; } = null!;
        public User Receiver { get; set; } = null!;
    }

}