using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext: DbContext
{
  public DataContext(DbContextOptions options): base(options){}

//אוסף היוזרים כלומר טבלת היוזרים
  public DbSet<AppUser> Users { get; set; }
}