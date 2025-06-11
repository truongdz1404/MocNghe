using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SpaceY.Application.Auth.Queries;
using SpaceY.Application.Services;
using SpaceY.Domain.Configs;
using SpaceY.Domain.DTOs;
using SpaceY.Domain.DTOs.Auth;
using SpaceY.Domain.Enums;
using SpaceY.Domain.Helper;
using SpaceY.Domain.Interfaces;

namespace SpaceY.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly JwtConfig _jwtConfig;
        private readonly IUserService _userService;
        private readonly IIdentityService _identityService;
        private readonly IMediator _mediator;


        public AuthController(IOptions<JwtConfig> jwtConfig,
         IUserService userService,
          IIdentityService identityService,
           IMediator mediator)
        {
            _jwtConfig = jwtConfig.Value;
            _userService = userService;
            _identityService = identityService;
            _mediator = mediator;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Authenticate([FromBody] Login loginDTO)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var isValid = await _identityService.SignInUserAsync(loginDTO);
                if (!isValid) throw new Exception("Sai tên đăng nhập hoặc mật khẩu");
                var tokenDTO = await _userService
                    .CreateAuthTokenAsync(EmailHelper.GetUserName(loginDTO.Email), _jwtConfig.RefreshTokenValidityInDays);
                SetTokensInsideCookie(tokenDTO, HttpContext);

                return Ok(new Response
                {
                    Status = ResponseStatus.SUCCESS,
                    Data = tokenDTO,
                    Message = "Login successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }


        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var userName = (HttpContext.User?.Identity?.Name) ?? throw new Exception("User is not authenticated!");
                var refreshToken = await _userService.GetRefreshTokenAsync(userName) ?? throw new Exception("Not found refresh token!");
                await _userService.RemoveRefreshTokenAsync(refreshToken);
                RemoveTokensInsideCookie(HttpContext);
                await HttpContext.SignOutAsync();
                return Ok(new Response
                {
                    Status = ResponseStatus.SUCCESS,
                    Message = "Logout successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = $"Logout failed! Error: {ex.Message}"
                });
            }
        }

        [HttpGet("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            try
            {
                var refeshToken = GetTokenInsideCookie(_jwtConfig.RefreshTokenKey, HttpContext);
                var tokenDTO = await _userService.RefeshAuthTokenAsync(refeshToken);
                SetTokensInsideCookie(tokenDTO, HttpContext);
                return Ok(
                    new Response
                    {
                        Status = ResponseStatus.SUCCESS,
                        Message = "Refresh Token Successfully!",
                    }
                );
            }
            catch (Exception ex)
            {
                return BadRequest(
                    new Response { Status = ResponseStatus.ERROR, Message = ex.Message }
                );
            }
        }

        private static string GetTokenInsideCookie(string tokenKey, HttpContext context)
        {
            context.Request.Cookies.TryGetValue(tokenKey, out var refreshToken);
            if (refreshToken is null)
                throw new Exception("Not found refresh token!");
            return refreshToken;
        }

        private void SetTokensInsideCookie(TokenDTO tokenDTO, HttpContext context)
        {
            context.Response.Cookies.Append(
                _jwtConfig.AccessTokenKey,
                tokenDTO.AccessToken,
                new CookieOptions
                {
                    Expires = DateTimeOffset.UtcNow.AddMinutes(_jwtConfig.TokenValidityInMinutes),
                    HttpOnly = true,
                    IsEssential = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                }
            );
            const string refreshTokenPath = "/api/auth/refresh-token";
            context.Response.Cookies.Append(
                _jwtConfig.RefreshTokenKey,
                tokenDTO.RefreshToken,
                new CookieOptions
                {
                    Expires = DateTimeOffset.UtcNow.AddDays(_jwtConfig.RefreshTokenValidityInDays),
                    HttpOnly = true,
                    IsEssential = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Path = refreshTokenPath,
                }
            );
        }

        private void RemoveTokensInsideCookie(HttpContext context)
        {
            context.Response.Cookies.Append(
                _jwtConfig.AccessTokenKey,
                "",
                new CookieOptions { HttpOnly = false, Expires = DateTimeOffset.UtcNow.AddDays(-1) }
            );
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = "Thông tin đăng kí không hợp lệ",
                    Data = ModelState
                });
            }

            try
            {
                var result = await _identityService.CreateUserAsync(registerDTO, new List<string> { UserRole.Customer.ToString() }, isConfirmed: true);
                if (!result.Succeeded)
                {
                    return BadRequest(new Response
                    {
                        Status = ResponseStatus.ERROR,
                        Message = "User creation failed",
                        Data = result.Errors.Select(e => e.Description)
                    });
                }
                var token = await _userService.CreateAuthTokenAsync(EmailHelper.GetUserName(registerDTO.Email), _jwtConfig.RefreshTokenValidityInDays);
                SetTokenInsideCookie(token, HttpContext);

                return Ok(new Response
                {
                    Status = ResponseStatus.SUCCESS,
                    Message = "Registration successful",
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = "An unexpected error occurred.",
                    Data = ex.Message
                });
            }
        }



        private void SetTokenInsideCookie(TokenDTO tokenDTO, HttpContext context)
        {
            try
            {
                context.Response.Cookies.Append(_jwtConfig.AccessTokenKey, tokenDTO.AccessToken,
                new CookieOptions
                {
                    Expires = DateTimeOffset.UtcNow.AddMinutes(_jwtConfig.TokenValidityInMinutes),
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict
                });

                const string refreshTokenPath = "/api/auth/refresh-token";
                context.Response.Cookies.Append(_jwtConfig.RefreshTokenKey, tokenDTO.RefreshToken,
                new CookieOptions
                {
                    Expires = DateTimeOffset.UtcNow.AddDays(_jwtConfig.RefreshTokenValidityInDays),
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    IsEssential = true,
                    Path = refreshTokenPath
                });
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to set token inside cookies.", ex);
            }
        }


        private void RemoveTokenInsideCookie(HttpContext context)
        {
            context.Response.Cookies.Append(_jwtConfig.AccessTokenKey, "",
            new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(-1),
                HttpOnly = false
            });
        }
    }
}