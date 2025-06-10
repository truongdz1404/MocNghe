using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpaceY.Application.Interfaces.Repositories;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.DTOs.Cart;
using SpaceY.Domain.Entities;

namespace SpaceY.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICartRepository _cartRepository;
        private readonly IProductVariantRepository _productVariantRepository;

        public CartController(ICartRepository cartRepository, IProductVariantRepository productVariantRepository)
        {
            _cartRepository = cartRepository;
            _productVariantRepository = productVariantRepository;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<CartSummaryDto>>> GetCart()
        {
            try
            {
                var userId = GetUserId();
                var cartItems = await _cartRepository.GetCartItemsByUserIdAsync(userId);

                var cartSummary = new CartSummaryDto
                {
                    Items = cartItems.Select(ci => new CartItemDto
                    {
                        ProductVariantId = ci.ProductVariantId,
                        ProductTitle = ci.ProductVariant.Product?.Title ?? "",
                        ProductImage = ci.ProductVariant.Product?.Images?.FirstOrDefault()?.Data ?? "",
                        VariantName = ci.ProductVariant.DisplayName,
                        ColorName = ci.ProductVariant.Color?.Name ?? "",
                        SizeName = ci.ProductVariant.Size?.Name ?? "",
                        Price = ci.ProductVariant.Price,
                        OriginalPrice = ci.ProductVariant.OriginalPrice,
                        Quantity = ci.Quantity,
                        SubTotal = ci.Quantity * ci.ProductVariant.Price,
                        AvailableStock = ci.ProductVariant.Stock,
                        InStock = ci.ProductVariant.Stock >= ci.Quantity
                    }).ToList()
                };

                cartSummary.TotalItems = cartSummary.Items.Sum(i => i.Quantity);
                cartSummary.SubTotal = cartSummary.Items.Sum(i => i.SubTotal);
                cartSummary.TotalAmount = cartSummary.SubTotal;
                cartSummary.HasOutOfStockItems = cartSummary.Items.Any(i => !i.InStock);

                return Ok(ApiResponse<CartSummaryDto>.SuccessResponse(cartSummary));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<CartSummaryDto>.ErrorResponse("Failed to get cart", new List<string> { ex.Message }));
            }
        }

        private string GetUserId()
        {
           Console.WriteLine("UserId: " + User.FindFirstValue(ClaimTypes.NameIdentifier));
            return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";
        }

        [HttpPost("add")]
        public async Task<ActionResult<ApiResponse<string>>> AddToCart([FromBody] AddToCartDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList();
                    return BadRequest(ApiResponse<string>.ErrorResponse("Invalid data", errors));
                }

                var userId = GetUserId();
                var productVariant = await _productVariantRepository.GetById(dto.ProductVariantId);

                if (productVariant == null)
                {
                    return NotFound(ApiResponse<string>.ErrorResponse("Product variant not found"));
                }

                if (productVariant.Stock < dto.Quantity)
                {
                    return BadRequest(ApiResponse<string>.ErrorResponse($"Not enough stock. Available: {productVariant.Stock}"));
                }

                var cartItem = new CartItem
                {
                    UserId = userId,
                    ProductVariantId = dto.ProductVariantId,
                    Quantity = dto.Quantity
                };

                await _cartRepository.AddToCartAsync(cartItem);

                return Ok(ApiResponse<string>.SuccessResponse("", "Product added to cart successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse("Failed to add product to cart", new List<string> { ex.Message }));
            }
        }

        [HttpPut("update")]
        public async Task<ActionResult<ApiResponse<string>>> UpdateCartItem([FromBody] UpdateCartItemDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList();
                    return BadRequest(ApiResponse<string>.ErrorResponse("Invalid data", errors));
                }

                var userId = GetUserId();
                var productVariant = await _productVariantRepository.GetById(dto.ProductVariantId);

                if (productVariant == null)
                {
                    return NotFound(ApiResponse<string>.ErrorResponse("Product variant not found"));
                }

                if (productVariant.Stock < dto.Quantity)
                {
                    return BadRequest(ApiResponse<string>.ErrorResponse($"Not enough stock. Available: {productVariant.Stock}"));
                }

                var cartItem = new CartItem
                {
                    UserId = userId,
                    ProductVariantId = dto.ProductVariantId,
                    Quantity = dto.Quantity
                };

                await _cartRepository.UpdateCartItemAsync(cartItem);

                return Ok(ApiResponse<string>.SuccessResponse("", "Cart item updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse("Failed to update cart item", new List<string> { ex.Message }));
            }
        }

        [HttpDelete("remove/{productVariantId}")]
        public async Task<ActionResult<ApiResponse<string>>> RemoveFromCart(long productVariantId)
        {
            try
            {
                var userId = GetUserId();
                await _cartRepository.RemoveFromCartAsync(userId, productVariantId);

                return Ok(ApiResponse<string>.SuccessResponse("", "Product removed from cart successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse("Failed to remove product from cart", new List<string> { ex.Message }));
            }
        }

        [HttpDelete("clear")]
        public async Task<ActionResult<ApiResponse<string>>> ClearCart()
        {
            try
            {
                var userId = GetUserId();
                await _cartRepository.ClearCartAsync(userId);

                return Ok(ApiResponse<string>.SuccessResponse("", "Cart cleared successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse("Failed to clear cart", new List<string> { ex.Message }));
            }
        }

        [HttpGet("count")]
        public async Task<ActionResult<ApiResponse<int>>> GetCartItemCount()
        {
            try
            {
                var userId = GetUserId();
                var count = await _cartRepository.GetCartItemCountAsync(userId);

                return Ok(ApiResponse<int>.SuccessResponse(count));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<int>.ErrorResponse("Failed to get cart count", new List<string> { ex.Message }));
            }
        }
    }
}