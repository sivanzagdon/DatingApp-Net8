using System;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Microsoft.IdentityModel.Tokens;

namespace API;

public class TokenService(IConfiguration config) : ITokenService
{
    public string CreateToken(AppUser user)
    {
        // Retrieve the token key from the configuration, or throw an exception if not found
        var tokenKey = config["TokenKey"] ?? throw new Exception("Cannot access tokenKey from appsettings");

        // Ensure the token key is at least 64 characters long
        if (tokenKey.Length < 64) throw new Exception("Your tokenKey needs to be longer");

        // Create a symmetric security key from the token key
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));

        // Define the claims for the token, including the username
        var claims = new List<Claim>
    {
        new(ClaimTypes.NameIdentifier, user.UserName)
    };

        // Create signing credentials using the security key and HMAC-SHA256 algorithm
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

        // Create a security token descriptor with the claims, expiration date, and signing credentials
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = creds
        };

        // Create a JWT token handler
        var tokenHandler = new JwtSecurityTokenHandler();

        // Create the token based on the token descriptor
        var token = tokenHandler.CreateToken(tokenDescriptor);

        // Write and return the token as a string
        return tokenHandler.WriteToken(token);
    }
}
