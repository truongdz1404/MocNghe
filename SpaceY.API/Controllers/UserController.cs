using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SpaceY.Application.Services;
using SpaceY.Domain.DTOs.User;

namespace SpaceY.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public async Task<ActionResult<UserDTO>> CreateUser([FromBody] CreateUserRequest request)
        {
            try
            {
                var userDto = new UserDTO
                {
                    UserName = request.UserName,
                    Email = request.Email,
                    Avatar = request.Avatar,
                    Role = request.Role
                };

                var result = await _userService.CreateUserAsync(userDto, request.Password);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        // [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<UserDTO>> GetUser(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound();

            // Only allow users to access their own data unless they're an admin
            if (!User.IsInRole("Admin") && User.FindFirst(ClaimTypes.NameIdentifier)?.Value != id)
                return Forbid();

            return Ok(user);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<UserDTO>> UpdateUser(string id, [FromBody] UpdateUserRequest request)
        {
            try
            {
                // Only allow users to update their own data unless they're an admin
                if (!User.IsInRole("Admin") && User.FindFirst(ClaimTypes.NameIdentifier)?.Value != id)
                    return Forbid();

                var userDto = new UserDTO
                {
                    UserName = request.UserName,
                    Email = request.Email,
                    Avatar = request.Avatar,
                    Role = request.Role
                };

                var result = await _userService.UpdateUserAsync(id, userDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            var result = await _userService.DeleteUserAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpPost("{id}/change-password")]
        [Authorize]
        public async Task<ActionResult> ChangePassword(string id, [FromBody] ChangePasswordRequest request)
        {
            // Only allow users to change their own password unless they're an admin
            if (!User.IsInRole("Admin") && User.FindFirst(ClaimTypes.NameIdentifier)?.Value != id)
                return Forbid();

            var result = await _userService.ChangePasswordAsync(id, request.CurrentPassword, request.NewPassword);
            if (!result)
                return BadRequest("Failed to change password");

            return NoContent();
        }
    }
}