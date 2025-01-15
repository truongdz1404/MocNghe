
using RentBridge.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace RentBridge.Infrastructure.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser>(options)
    {
        public DbSet<Post> Listings { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;
        public DbSet<Message> Messages { get; set; } = null!;
        public DbSet<Contract> Contracts { get; set; } = null!;
        public DbSet<AdministrativeDivision> AdministrativeDivisions { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ApplicationUser>().ToTable("tblUsers");
            modelBuilder.Entity<IdentityRole>().ToTable("tblRoles");
            modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable("tblRoleClaims");
            modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("tblUserClaims");
            modelBuilder.Entity<IdentityUserRole<string>>().ToTable("tblUserRoles");
            modelBuilder.Entity<IdentityUserToken<string>>().ToTable("tblUserTokens");
            modelBuilder.Entity<IdentityUserLogin<string>>().ToTable("tblUserLogins");

            // Message relationships
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

            // Post relationships
            modelBuilder.Entity<Post>(entity =>
            {
                entity.HasOne(p => p.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

                entity.Property(p => p.Price)
                .HasPrecision(18, 2);
            });

            // Post - Post (self-referencing)
            modelBuilder.Entity<Post>()
                .HasMany(p => p.Posts)
                .WithOne()
                .OnDelete(DeleteBehavior.Restrict);

            // Review relationships
            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Post)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            // Contract relationships
            modelBuilder.Entity<Contract>()
                .HasOne(c => c.Post)
                .WithOne(p => p.Contract)
                .HasForeignKey<Contract>(c => c.PostId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Contract>()
                .HasOne(c => c.Tenant)
                .WithMany() 
                .HasForeignKey(c => c.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Contract>()
                .Property(c => c.MonthlyPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Contract>()
                .HasOne(c => c.Owner)
                .WithMany()  
                .HasForeignKey(c => c.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<AdministrativeDivision>()
                .HasKey(a => a.Code);
        }
    }
}