using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
  public static async Task SeedUsers(DataContext Context)
  {
    if(await Context.Users.AnyAsync()) return;

    var userDate= await File.ReadAllTextAsync("Data/UserSeedData.json");
    var options= new JsonSerializerOptions{PropertyNameCaseInsensitive=true};
    var users= JsonSerializer.Deserialize <List<AppUser>>(userDate,options); //convertion from json to AppUser- "Deserialize"
  
    if(users==null) return;

    foreach(var user in users)
    {
       using var hmac= new HMACSHA512();
       user.UserName=user.UserName.ToLower();
       user.PasswordHash=hmac.ComputeHash(Encoding.UTF8.GetBytes("pa$$w0rd"));
       user.PasswordSalt=hmac.Key;

       Context.Users.Add(user);
    }

    await Context.SaveChangesAsync();
  }
}
