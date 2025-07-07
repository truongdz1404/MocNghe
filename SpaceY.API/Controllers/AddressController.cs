using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs.Address;

namespace SpaceY.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AddressController : ControllerBase
    {
        private readonly IAddressService _addressService;

        public AddressController(IAddressService addressService)
        {
            _addressService = addressService;
        }

        private string GetCurrentUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }

        /// <summary>
        /// Get all addresses for the current user
        /// </summary>
        /// <returns>List of addresses</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AddressDto>>> GetAddresses()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                var addresses = await _addressService.GetAllAddressesByUserIdAsync(userId);
                return Ok(addresses);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while retrieving addresses");
            }
        }

        /// <summary>
        /// Get a specific address by ID
        /// </summary>
        /// <param name="id">Address ID</param>
        /// <returns>Address details</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<AddressDto>> GetAddress(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                var address = await _addressService.GetAddressByIdAsync(id, userId);
                if (address == null)
                {
                    return NotFound($"Address with ID {id} not found");
                }

                return Ok(address);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while retrieving the address");
            }
        }

        /// <summary>
        /// Create a new address
        /// </summary>
        /// <param name="createAddressDto">Address creation data</param>
        /// <returns>Created address</returns>
        [HttpPost]
        public async Task<ActionResult<AddressDto>> CreateAddress([FromBody] CreateAddressDto createAddressDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                var createdAddress = await _addressService.CreateAddressAsync(createAddressDto, userId);
                return CreatedAtAction(nameof(GetAddress), new { id = createdAddress.Id }, createdAddress);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while creating the address");
            }
        }

        /// <summary>
        /// Update an existing address
        /// </summary>
        /// <param name="id">Address ID</param>
        /// <param name="updateAddressDto">Address update data</param>
        /// <returns>Updated address</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<AddressDto>> UpdateAddress(int id, [FromBody] UpdateAddressDto updateAddressDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                var updatedAddress = await _addressService.UpdateAddressAsync(id, updateAddressDto, userId);
                if (updatedAddress == null)
                {
                    return NotFound($"Address with ID {id} not found");
                }

                return Ok(updatedAddress);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating the address");
            }
        }

        /// <summary>
        /// Delete an address
        /// </summary>
        /// <param name="id">Address ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAddress(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                var result = await _addressService.DeleteAddressAsync(id, userId);
                if (!result)
                {
                    return NotFound($"Address with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while deleting the address");
            }
        }

        /// <summary>
        /// Check if an address exists
        /// </summary>
        /// <param name="id">Address ID</param>
        /// <returns>Exists status</returns>
        [HttpHead("{id}")]
        public async Task<ActionResult> AddressExists(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var exists = await _addressService.AddressExistsAsync(id, userId);
                return exists ? Ok() : NotFound();
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }
    }
}