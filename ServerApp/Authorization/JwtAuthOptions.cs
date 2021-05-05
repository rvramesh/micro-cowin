
using System;
using System.Linq;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace MicroWin.Authorization
{
    public static class AuthJwtTokenOptions
    {
        private static readonly string Key = System.Environment.GetEnvironmentVariable("BOT_TOKEN");
        public static readonly string Issuer =System.Environment.GetEnvironmentVariable("BOT_ID");
        public static readonly string Audience = System.Environment.GetEnvironmentVariable("BOT_ID");
        public static readonly SymmetricSecurityKey SecuirtyKey =
            new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Key));
    }
    public class AuthJwtTokenHandler
    {
        private readonly SecurityKey securityKey;
        private readonly string issuer;
        private string audience;
        public AuthJwtTokenHandler(SecurityKey securityKey, string issuer, string audience)
        {
            this.securityKey = securityKey;
            this.issuer = issuer;
            this.audience = audience;
        }

        public string GetJwtToken(long id, string username, string[] roles)
        {
            List<Claim> claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, username),
                new Claim(JwtRegisteredClaimNames.Sub, id.ToString())
            };
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            JwtSecurityToken jwtSecurityToken = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                notBefore: DateTime.UtcNow,
                claims: claims,
                // our token will live 30 mins, but you can change you token lifetime here
                expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(30)),
                signingCredentials: new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256));
            return new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
        }
    }
}