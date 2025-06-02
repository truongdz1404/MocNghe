using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SpaceY.Application.DTOs;
using SpaceY.Application.Services;
using SpaceY.Domain.Entities;

namespace SpaceY.Application.Auth.Queries
{

    public class Login : IRequest<LoginResponseDto>
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    public class LoginHandler : IRequestHandler<Login, LoginResponseDto>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly ITokenService _tokenService;

        public LoginHandler(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration,
            ITokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _tokenService = tokenService;
        }

        public async Task<LoginResponseDto> Handle(Login request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null || !user.EmailConfirmed)
                throw new UnauthorizedAccessException("Email or password incorrect!");

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if (!result.Succeeded)
                throw new UnauthorizedAccessException("Email or password incorrect!");

            var jwtSettings = _configuration.GetSection("JWT");

            var accessToken = GenerateJWTToken(user, jwtSettings);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(int.Parse(jwtSettings["RefreshTokenValidityInDays"]!));
            await _userManager.UpdateAsync(user);

            var roles = await _userManager.GetRolesAsync(user);

            return new LoginResponseDto
            {
                Username = user.UserName!,
                Email = user.Email!,
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Role = roles.FirstOrDefault() ?? "User",
                AccessTokenExpiresInMinutes = int.Parse(jwtSettings["TokenValidityInMinutes"]!),
                RefreshTokenExpiresInDays = int.Parse(jwtSettings["RefreshTokenValidityInDays"]!)
            };
        }

        private string GenerateJWTToken(ApplicationUser user, IConfigurationSection jwtSettings)
        {
            var roles = _userManager.GetRolesAsync(user).Result;

            var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Email!),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email!)
        };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SigningKey"]!));
            var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["TokenValidityInMinutes"]!)),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

}