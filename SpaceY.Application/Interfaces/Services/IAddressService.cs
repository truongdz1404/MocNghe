using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceY.Domain.DTOs.Address;

namespace SpaceY.Application.Interfaces.Services
{
    public interface IAddressService
    {
        Task<IEnumerable<AddressDto>> GetAllAddressesByUserIdAsync(string userId);
        Task<AddressDto?> GetAddressByIdAsync(int id, string userId);
        Task<AddressDto> CreateAddressAsync(CreateAddressDto createAddressDto, string userId);
        Task<AddressDto?> UpdateAddressAsync(int id, UpdateAddressDto updateAddressDto, string userId);
        Task<bool> DeleteAddressAsync(int id, string userId);
        Task<bool> AddressExistsAsync(int id, string userId);
    }
}