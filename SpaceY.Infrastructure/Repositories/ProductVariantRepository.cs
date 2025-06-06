using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SpaceY.Application.Interfaces.Repositories;
using SpaceY.Domain.Entities;
using SpaceY.Infrastructure.Data;

namespace SpaceY.Infrastructure.Repositories
{
    public class ProductVariantRepository : BaseRepository<ProductVariant>, IProductVariantRepository
    {
        public ProductVariantRepository(ApplicationDbContext dbContext) : base(dbContext) { }

        public async Task<IEnumerable<ProductVariant>> GetByProductIdAsync(long productId)
        {
            return await _dbContext.ProductVariants
                .Include(x => x.Color)
                .Include(x => x.Size)
                .Where(x => x.ProductId == productId && !x.Deleted)
                .ToListAsync();
        }
    }
}