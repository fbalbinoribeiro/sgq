﻿using Newtonsoft.Json;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace User.Models;

public enum UserRole
{
	GENERAL,
	MANAGER,
	ADMIN
}

public class UserModel
{

	public string Id { get; set; }
	public string Name { get; set; }
	public string Email { get; set; }
	public string Password { get; set; } = "123456";
	public UserRole Role { get; set; }

	public UserModel(
		string id, string name, string email, UserRole role
	) {
		Id = id ?? System.Guid.NewGuid().ToString();
		Name = name;
		Email = email;
		Password = string.Empty;
		Role = role;
	 }

	[JsonConstructor]
	public UserModel(string id, string name, string email, string password, UserRole role)
	{
		Id = id ?? System.Guid.NewGuid().ToString();
		Name = name;
		Email = email;
		Password = string.IsNullOrEmpty(password) ? GenerateShaPassword(Password) : password;
		Role = role;
	}

	public static string GenerateShaPassword(string password)
	{
		using SHA256 sha = SHA256.Create();
		byte[] hash = sha.ComputeHash(Encoding.ASCII.GetBytes(password));
		string stringHash = string.Join("", hash.Select((b) => $"{b:X2}").ToList());
		return stringHash;
	}

	public override string ToString() => JsonConvert.SerializeObject(this, Formatting.Indented);
}
