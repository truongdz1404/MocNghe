using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.Entities;

namespace SpaceY.Application.Interfaces.Repositories
{
    public interface IProductVariantRepository : IBaseRepository<ProductVariant>
    {
        Task<IEnumerable<ProductVariant>> GetByProductIdAsync(long productId);
    }
}