using JWT;
using JWT.Algorithms;
using JWT.Builder;
using JWT.Serializers;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using User.Models;

namespace Utils;

public class Jwt {
    private readonly IJwtAlgorithm _algorithm;
    private readonly IJsonSerializer _serializer;
    private readonly IBase64UrlEncoder _base64Encoder;
    private readonly IJwtEncoder _jwtEncoder;

    private readonly string secret = "5d428ad2fc0ae27cf1da5b926d39d5c7";

    public Jwt() {
        _algorithm = new HMACSHA256Algorithm();
        _serializer = new JsonNetSerializer();
        _base64Encoder = new JwtBase64UrlEncoder();
        _jwtEncoder = new JwtEncoder(_algorithm, _serializer, _base64Encoder);
    }
    public string IssuingJWT(UserModel user) {
        Dictionary <string, object> claims = new()
        {
            {
                "username",
                user.Email
            },
            {
                "role",
                user.Role
            }
        };
        string token = _jwtEncoder.Encode(claims, secret);
        return token;
    }

    public (bool, KeyValuePair<string, UserRole>?) ValidateJWT(HttpRequest request) {
        if (!request.Headers.ContainsKey("Authorization")) {
            return (false, null);
        }

        string authorizationHeader = request.Headers["Authorization"];
        if (string.IsNullOrEmpty(authorizationHeader)) {
            return (false, null);
        }
        IDictionary < string, object > claims = null;
        try {
            if (authorizationHeader.StartsWith("Bearer")) {
                authorizationHeader = authorizationHeader.Substring(7);
            }
            
            claims = new JwtBuilder().WithAlgorithm(new HMACSHA256Algorithm()).WithSecret(secret).MustVerifySignature().Decode < IDictionary < string, object >> (authorizationHeader);
        } catch {
            return (false, null);
        }

        if (!claims.ContainsKey("username") || !claims.ContainsKey("role")) {
            return (false, null);
        }
        
        return (true, new KeyValuePair<string, UserRole>(claims["username"].ToString(), (UserRole)Enum.Parse(typeof(UserRole), claims["role"].ToString())));
    }

    public bool ValidateUserAndRoles(List<UserRole> allowedRoles, HttpRequest request, List<UserModel> users)
    {
        var (isValid, user) = ValidateJWT(request);
        var userFromDb = users.First(u => u.Email == user.Value.Key);

        if (!isValid || userFromDb == null) {
            return false;
        }

        if (!allowedRoles.Contains(userFromDb.Role)) {
            return false;
        }

        return true;
    }
}