
using RentBridge.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace RentBridge.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Post> Listings { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;
        public DbSet<Message> Messages { get; set; } = null!;
        public DbSet<Contract> Contracts { get; set; } = null!;
        public DbSet<AdministrativeDivision> AdministrativeDivisions { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Relationships
            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(u => u.SentMessages)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Receiver)
                .WithMany(u => u.ReceivedMessages)
                .HasForeignKey(m => m.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Post>()
                .HasOne(l => l.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(l => l.UserId);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Post)
                .WithMany(l => l.Reviews)
                .HasForeignKey(r => r.PostId);

            modelBuilder.Entity<Contract>()
                .HasOne(c => c.Post)
                .WithOne(l => l.Contract)
                .HasForeignKey<Contract>(c => c.PostId);

            modelBuilder.Entity<Contract>()
                .HasOne(c => c.Tenant)
                .WithMany()
                .HasForeignKey(c => c.TenantId);

            modelBuilder.Entity<Contract>()
                .HasOne(c => c.Owner)
                .WithMany()
                .HasForeignKey(c => c.OwnerId);
        }
    }
}