using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Logging;
using SpaceY.Application.Interfaces.Repositories;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Domain.DTOs.Address;
using SpaceY.Domain.Entities;

namespace SpaceY.Infrastructure.Services
{
    public class AddressService : IAddressService
    {
        private readonly IAddressRepository _addressRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<AddressService> _logger;

        public AddressService(
            IAddressRepository addressRepository,
            IMapper mapper,
            ILogger<AddressService> logger)
        {
            _addressRepository = addressRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<AddressDto>> GetAllAddressesByUserIdAsync(string userId)
        {
            try
            {
                var addresses = await _addressRepository.GetAddressesByUserIdAsync(userId);
                return _mapper.Map<IEnumerable<AddressDto>>(addresses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting addresses for user {UserId}", userId);
                throw;
            }
        }

        public async Task<AddressDto?> GetAddressByIdAsync(int id, string userId)
        {
            try
            {
                var address = await _addressRepository.GetAddressByIdAndUserIdAsync(id, userId);
                return address != null ? _mapper.Map<AddressDto>(address) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting address {Id} for user {UserId}", id, userId);
                throw;
            }
        }

        public async Task<AddressDto> CreateAddressAsync(CreateAddressDto createAddressDto, string userId)
        {
            try
            {
                var address = _mapper.Map<Address>(createAddressDto);
                address.UserId = userId;

                var createdAddress = await _addressRepository.Create(address);
                await _addressRepository.SaveChangeAsync();

                return _mapper.Map<AddressDto>(createdAddress);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating address for user {UserId}", userId);
                throw;
            }
        }

        public async Task<AddressDto?> UpdateAddressAsync(int id, UpdateAddressDto updateAddressDto, string userId)
        {
            try
            {
                var existingAddress = await _addressRepository.GetAddressByIdAndUserIdAsync(id, userId);
                if (existingAddress == null)
                {
                    return null;
                }

                _mapper.Map(updateAddressDto, existingAddress);
                await _addressRepository.Update(existingAddress);
                await _addressRepository.SaveChangeAsync();

                return _mapper.Map<AddressDto>(existingAddress);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating address {Id} for user {UserId}", id, userId);
                throw;
            }
        }

        public async Task<bool> DeleteAddressAsync(int id, string userId)
        {
            try
            {
                var address = await _addressRepository.GetAddressByIdAndUserIdAsync(id, userId);
                if (address == null)
                {
                    return false;
                }

                await _addressRepository.Delete(address);
                await _addressRepository.SaveChangeAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting address {Id} for user {UserId}", id, userId);
                throw;
            }
        }

        public async Task<bool> AddressExistsAsync(int id, string userId)
        {
            try
            {
                return await _addressRepository.IsAddressOwnedByUserAsync(id, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if address {Id} exists for user {UserId}", id, userId);
                throw;
            }
        }
    }
}