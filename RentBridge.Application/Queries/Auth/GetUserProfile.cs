using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentBridge.Domain.Entities;
using RentBridge.Domain.Enums;
using RentBridge.Infrastructure.Data;

namespace RentBridge.Application.Queries.Auth
{
    public class AccountResponse
    {
        public required string username { get; set; }
        public required string email { get; set; }
        public UserRole Role { get; set; } = UserRole.Tenant;
        public string? image { get; set; }
    }
    public class GetUserProfile : IRequest<AccountResponse>
    {
        public required string Email { get; set; }

        public class GetUserProfileHandler : IRequestHandler<GetUserProfile, AccountResponse>
        {
            private readonly ApplicationDbContext _context;

            public GetUserProfileHandler(ApplicationDbContext context)
            {
                _context = context ?? throw new ArgumentNullException(nameof(context));
            }

            public async Task<AccountResponse> Handle(GetUserProfile request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    throw new ArgumentException("Email is required.", nameof(request.Email));
                }
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
                if (user == null)
                {
                    throw new InvalidOperationException($"User {request.Email} was not found.");
                }
                return new AccountResponse
                {
                    username = user.UserName!,
                    email = user.Email!,
                    Role = user.Role,
                    image = user?.AvatarUrl
                };
            }

        }
    }
}
