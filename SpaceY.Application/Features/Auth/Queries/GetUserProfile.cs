// using MediatR;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using SpaceY.Domain.Entities;
// using SpaceY.Domain.Enums;
// using SpaceY.Infrastructure.Data;

// namespace SpaceY.Application.Queries.Auth
// {
//     public class AccountResponse
//     {
//         public required string Username { get; set; }
//         public required string Email { get; set; }
//         public UserRole Role { get; set; } = UserRole.Customer;
//         public string? AvatarUrl { get; set; }
//     }
//     public class GetUserProfile : IRequest<AccountResponse>
//     {
//         public required string Email { get; set; }

//         public class GetUserProfileHandler : IRequestHandler<GetUserProfile, AccountResponse>
//         {
//             private readonly application _context;

//             public GetUserProfileHandler(ApplicationDbContext context)
//             {
//                 _context = context ?? throw new ArgumentNullException(nameof(context));
//             }

//             public async Task<AccountResponse> Handle(GetUserProfile request, CancellationToken cancellationToken)
//             {
//                 if (string.IsNullOrWhiteSpace(request.Email))
//                 {
//                     throw new ArgumentException("Email is required.", nameof(request.Email));
//                 }
//                 var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
//                 if (user == null)
//                 {
//                     throw new InvalidOperationException($"User {request.Email} was not found.");
//                 }
//                 return new AccountResponse
//                 {
//                     Username = user.UserName!,
//                     Email = user.Email!,
//                     // Role = user.Role,
//                     AvatarUrl = user?.AvatarUrl
//                 };
//             }

//         }
//     }
// }
