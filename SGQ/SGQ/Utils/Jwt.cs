using JWT;
using JWT.Algorithms;
using JWT.Serializers;
using System.Collections.Generic;
using User.Models;

namespace Utils;

public class Jwt {
    private readonly IJwtAlgorithm _algorithm;
    private readonly IJsonSerializer _serializer;
    private readonly IBase64UrlEncoder _base64Encoder;
    private readonly IJwtEncoder _jwtEncoder;
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
                user
            },
            {
                "role",
                user.Role
            }
        };
        string token = _jwtEncoder.Encode(claims, "5d428ad2fc0ae27cf1da5b926d39d5c7");
        return token;
    }
}