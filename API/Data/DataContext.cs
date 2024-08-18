using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext: DbContext
{
  public DataContext(DbContextOptions options): base(options){}

//Tables:
  public DbSet<AppUser> Users { get; set; }
  public DbSet <UserLike> Likes { get; set; }
  public DbSet<Message> Messages { get; set; }


  protected override void OnModelCreating(ModelBuilder builder) ////Defining primary and foreign keys:
  {
        base.OnModelCreating(builder);

      //Defining primary key for UserLike
      builder.Entity<UserLike>()
        .HasKey(k=> new {k.SourceUserId, k.TargetUserId });

      //Defining One-To-Mant connection
      builder.Entity<UserLike>()
        .HasOne(s=>s.SourceUser)
        .WithMany(l=>l.LikedUsers)
        .HasForeignKey(s=>s.SourceUserId)
        .OnDelete(DeleteBehavior.Cascade);

      builder.Entity<UserLike>()
       .HasOne(s => s.TargetUser)
       .WithMany(l => l.LikedByUsers)
       .HasForeignKey(s => s.TargetUserId)
       .OnDelete(DeleteBehavior.NoAction);

      builder.Entity<Message>()
       .HasOne(s => s.Recipient)
       .WithMany(l => l.MessagesReceived)
       .OnDelete(DeleteBehavior.Restrict);

      builder.Entity<Message>()
       .HasOne(s => s.Sender)
       .WithMany(l => l.MessagesSent)
       .OnDelete(DeleteBehavior.Restrict);
  }
}