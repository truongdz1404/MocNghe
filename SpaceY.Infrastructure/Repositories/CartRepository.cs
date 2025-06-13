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
    public class CartRepository : ICartRepository
    {
        private readonly ApplicationDbContext _context;

        public CartRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CartItem>> GetCartItemsByUserIdAsync(string userId)
        {
            return await _context.CartItems
                .Where(ci => ci.UserId == userId)
                .Include(ci => ci.ProductVariant)
                    .ThenInclude(pv => pv.Product)
                        .ThenInclude(p => p.Images!)
                .Include(ci => ci.ProductVariant)
                    .ThenInclude(pv => pv.Color)
                .Include(ci => ci.ProductVariant)
                    .ThenInclude(pv => pv.Size)
                .ToListAsync();
        }

        public async Task<CartItem?> GetCartItemAsync(string userId, long productVariantId)
        {
            return await _context.CartItems
                .Include(ci => ci.ProductVariant)
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductVariantId == productVariantId);
        }

        public async Task AddToCartAsync(CartItem cartItem)
        {
            var existingItem = await GetCartItemAsync(cartItem.UserId, cartItem.ProductVariantId);

            if (existingItem != null)
            {
                existingItem.Quantity += cartItem.Quantity;
                _context.CartItems.Update(existingItem);
            }
            else
            {
                await _context.CartItems.AddAsync(cartItem);
            }

            await _context.SaveChangesAsync();
        }

        public async Task UpdateCartItemAsync(CartItem cartItem)
        {
            var existingItem = await GetCartItemAsync(cartItem.UserId, cartItem.ProductVariantId);
            if (existingItem != null)
            {
                existingItem.Quantity = cartItem.Quantity;
                _context.CartItems.Update(existingItem);
                await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveFromCartAsync(string userId, long productVariantId)
        {
            var cartItem = await GetCartItemAsync(userId, productVariantId);
            if (cartItem != null)
            {
                _context.CartItems.Remove(cartItem);
                await _context.SaveChangesAsync();
            }
        }

        public async Task ClearCartAsync(string userId)
        {
            var cartItems = await _context.CartItems
                .Where(ci => ci.UserId == userId)
                .ToListAsync();

            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();
        }

        public async Task<int> GetCartItemCountAsync(string userId)
        {
            return await _context.CartItems
                .Where(ci => ci.UserId == userId)
                .SumAsync(ci => ci.Quantity);
        }

        public async Task<decimal> GetCartTotalAsync(string userId)
        {
            return await _context.CartItems
                .Where(ci => ci.UserId == userId)
                .Include(ci => ci.ProductVariant)
                .SumAsync(ci => ci.Quantity * ci.ProductVariant.Price);
        }
    }
}