using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Google.Apis.Auth;
using SpaceY.Domain.Entities;

namespace SpaceY.Application.Services
{
    public interface ITokenService
    {
        string GenerateRefreshToken();
        string GenerateAccessToken(List<Claim> claims);
        ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
        Task<GoogleJsonWebSignature.Payload?> VerifyGoogleToken(ExternalAuthDTO externalAuth);
    }

}