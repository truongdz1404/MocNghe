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
            modelBuilder.Entity<Color>().ToTable("tblColor");
            modelBuilder.Entity<Size>().ToTable("tblSize");
            modelBuilder.Entity<Reviews>().ToTable("tblReviews");

            // Configure CartItem
            modelBuilder.Entity<CartItem>()
      .HasKey(ci => new { ci.UserId, ci.ProductVariantId });

            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.ProductVariant)
                .WithMany()
                .HasForeignKey(ci => ci.ProductVariantId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<ProductVariant>()
         .HasKey(p => p.Id);

            modelBuilder.Entity<OrderDetail>()
                .HasKey(oi => oi.Id);

            modelBuilder.Entity<Product>()
                 .HasMany(p => p.Categories)
                 .WithMany(c => c.Products)
                 .UsingEntity<Dictionary<string, object>>(
                     "ProductCategory",
                     j => j
                         .HasOne<Category>()
                         .WithMany()
                         .HasForeignKey("CategoryId")
                         .HasConstraintName("FK_ProductCategory_Category_CategoryId")
                         .OnDelete(DeleteBehavior.Cascade),
                     j => j
                         .HasOne<Product>()
                         .WithMany()
                         .HasForeignKey("ProductId")
                         .HasConstraintName("FK_ProductCategory_Product_ProductId")
                         .OnDelete(DeleteBehavior.Cascade),
                     j =>
                     {
                         j.HasKey("ProductId", "CategoryId");
                         j.ToTable("ProductCategories");
                         j.HasIndex(new[] { "ProductId" });
                         j.HasIndex(new[] { "CategoryId" });
                     });
            modelBuilder.Entity<ProductVariant>()
                .HasOne(p => p.Product)
                .WithMany(c => c.Variants)
                .HasForeignKey(p => p.ProductId);


            modelBuilder.Entity<Color>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name)
                      .IsRequired()
                      .HasMaxLength(100);
                entity.Property(e => e.HexCode)
                      .HasMaxLength(7);
                entity.HasIndex(e => e.Name)
                      .IsUnique();
            });

            modelBuilder.Entity<Size>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name)
                      .IsRequired()
                      .HasMaxLength(50);
                entity.Property(e => e.Description)
                      .HasMaxLength(200);
                entity.HasIndex(e => e.Name)
                      .IsUnique();
            });

            modelBuilder.Entity<ProductVariant>()
                .HasOne(pv => pv.Color)
                .WithMany()
                .HasForeignKey(pv => pv.ColorId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ProductVariant>()
                .HasOne(pv => pv.Size)
                .WithMany()
                .HasForeignKey(pv => pv.SizeId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ProductVariant>(entity =>
            {
                entity.Property(e => e.Price)
                      .HasColumnType("decimal(18,2)")
                      .IsRequired();
                entity.Property(e => e.OriginalPrice)
                      .HasColumnType("decimal(18,2)")
                      .IsRequired();
                entity.Property(e => e.SKU)
                      .HasMaxLength(100);

                entity.HasIndex(e => new { e.ProductId, e.ColorId, e.SizeId })
                      .IsUnique()
                      .HasDatabaseName("IX_ProductVariant_Product_Color_Size");
            });
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
                .HasOne(od => od.Product)
                .WithMany()
                .HasForeignKey(od => od.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OrderDetail>()
                .HasOne(od => od.ProductVariant)
                .WithMany()
                .HasForeignKey(od => od.ProductVariantId)
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
        public DbSet<Color> Colors { get; set; }
        public DbSet<Size> Sizes { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Reviews> Reviews { get; set; }
    }
}