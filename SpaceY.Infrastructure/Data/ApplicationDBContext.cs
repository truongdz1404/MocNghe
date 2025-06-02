using SpaceY.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace SpaceY.Infrastructure.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : IdentityDbContext<ApplicationUser>(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure table names
            modelBuilder.Entity<ApplicationUser>().ToTable("tblUsers");
            modelBuilder.Entity<IdentityRole>().ToTable("tblRoles");
            modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable("tblRoleClaims");
            modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("tblUserClaims");
            modelBuilder.Entity<IdentityUserRole<string>>().ToTable("tblUserRoles");
            modelBuilder.Entity<IdentityUserToken<string>>().ToTable("tblUserTokens");
            modelBuilder.Entity<IdentityUserLogin<string>>().ToTable("tblUserLogins");
            modelBuilder.Entity<Address>().ToTable("tblAddress");
            modelBuilder.Entity<Category>().ToTable("tblCategory");
            modelBuilder.Entity<Image>().ToTable("tblImage");
            modelBuilder.Entity<Product>().ToTable("tblProduct");
            modelBuilder.Entity<Order>().ToTable("tblOrder");
            modelBuilder.Entity<OrderDetail>().ToTable("tblOrderDetail");
            modelBuilder.Entity<ProductVariant>().ToTable("tblProductVariant");
            modelBuilder.Entity<ProductType>().ToTable("tblProductType"); 
            modelBuilder.Entity<Reviews>().ToTable("tblReviews");

            // Configure CartItem
            modelBuilder.Entity<CartItem>()
                .HasKey(ci => new { ci.UserId, ci.ProductId, ci.ProductTypeId });

            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.ProductVariant)
                .WithMany()
                .HasForeignKey(ci => new { ci.ProductId, ci.ProductTypeId });

            // Configure ProductVariant
            modelBuilder.Entity<ProductVariant>()
                .HasKey(p => new { p.ProductId, p.ProductTypeId });

            // Configure OrderDetail
            modelBuilder.Entity<OrderDetail>()
                .HasKey(oi => oi.Id); 

            // Configure relationships
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<ProductVariant>()
                .HasOne(p => p.Product)
                .WithMany(c => c.Variants)
                .HasForeignKey(p => p.ProductId);

            modelBuilder.Entity<ProductVariant>()
                .HasOne(p => p.ProductType)
                .WithMany()
                .HasForeignKey(p => p.ProductTypeId); 

            modelBuilder.Entity<Reviews>()
                .HasOne(r => r.Product)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Reviews>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Address>()
                .HasOne(a => a.User)
                .WithMany(u => u.Addresses)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderDetail>()
                .HasOne(od => od.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(od => od.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderDetail>()
                .HasOne(od => od.Product)
                .WithMany()
                .HasForeignKey(od => od.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OrderDetail>()
                .HasOne(od => od.ProductType)
                .WithMany()
                .HasForeignKey(od => od.ProductTypeId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<OrderDetail>()
                .HasOne(od => od.ProductVariant)
                .WithMany()
                .HasForeignKey(od => new { od.ProductId, od.ProductTypeId })
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<Image>()
                .HasOne(i => i.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<CartItem>()
                .HasOne<ApplicationUser>()
                .WithMany(u => u.CartItems)
                .HasForeignKey(ci => ci.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.SeedDatabase();
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ProductType> ProductTypes { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Reviews> Reviews { get; set; }
    }
}