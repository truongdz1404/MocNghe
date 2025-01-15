using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RentBridge.Application.DTOs;
using RentBridge.Domain.Entities;
using RentBridge.Domain.Enums;

namespace RentBridge.Application.Commands.Users
{
    public class CreateUserCommand : IRequest<IActionResult>
    {
        [Required(ErrorMessage = "Email address are required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; } = null!;
        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters")]
        public string Password { get; set; } = null!;
        [Required(ErrorMessage = "FullName is required")]
        [MaxLength(50, ErrorMessage = "FullName can't exceed 50 characters")]
        [MinLength(3, ErrorMessage = "FullName must be at least 3 characters")]
        public string FullName { get; set; } = null!;
        public UserRole Role { get; set; } = UserRole.Tenant;
        public string? AvatarUrl { get; set; }
        public string? Phone { get; set; }
    }

    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, IActionResult>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public CreateUserCommandHandler(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
        }
        public async Task<IActionResult> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var existingUser = await _userManager.FindByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    return new BadRequestObjectResult(new Response
                    {
                        Message = $"Email {request.Email} already exists",
                        Status = ResponseStatus.ERROR
                    });
                }
                var user = new ApplicationUser
                {
                    Email = request.Email,
                    FullName = request.FullName,
                    UserName = request.Email,
                    Role = request.Role,
                    AvatarUrl = request.AvatarUrl,
                    PhoneNumber = request.Phone,
                };
                var result = await _userManager.CreateAsync(user, request.Password);
                if (result.Succeeded)
                {
                    return new OkObjectResult(new Response
                    {
                        Message = "User created successfully",
                        Status = ResponseStatus.SUCCESS
                    });
                }
                var errorMessage = result.Errors.Select(x => x.Description).ToList();
                return new BadRequestObjectResult(new Response
                {
                    Message = "Failed to create user",
                    Status = ResponseStatus.ERROR,
                    Data = errorMessage
                });

            }
            catch (Exception ex)
            {

                return new BadRequestObjectResult(new Response
                {
                    Message = "An error occurred while creating user",
                    Status = ResponseStatus.ERROR,
                    Data = ex.Message
                });
            }
        }
    }
}