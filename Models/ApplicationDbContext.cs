using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Metadata;

namespace NeedleWork2016.Models
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        //connections string
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseInMemoryDatabase(); 
        }

        //creating model
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Color>(entity =>
            {

                entity.Property(e => e.Hex)
                    .HasMaxLength(7)
                    .HasColumnType("nchar");

                entity.HasOne(d => d.Palette).WithMany(p => p.Colors).HasForeignKey(d => d.IdPalette).OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Palette>(entity =>
            {
                entity.Property(e => e.IdUser)
                    .HasMaxLength(450);

                entity.HasOne(d => d.User).WithMany(p => p.Palettes).HasForeignKey(d => d.IdUser).OnDelete(DeleteBehavior.Cascade);
            });
            builder.Entity<Feedback>(entity =>
            {
                entity.Property(e => e.IdUser)
                    .HasMaxLength(450);
                entity.HasOne(d => d.User).WithMany(p => p.Feedbacks).HasForeignKey(d => d.IdUser).OnDelete(DeleteBehavior.Cascade);
            });
            builder.Entity<PDF>(entity =>
            {
                entity.Property(e => e.IdUser)
                    .HasMaxLength(450);
                entity.HasOne(d => d.User).WithMany(p => p.PDFs).HasForeignKey(d => d.IdUser).OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<CustomerWork>(entity =>
            {
                entity.Property(e => e.IdUser)
                    .HasMaxLength(450);

                entity.HasOne(d => d.User).WithMany(p => p.CustomerWorks).HasForeignKey(d => d.IdUser).OnDelete(DeleteBehavior.Cascade);
            });

        }
        public virtual DbSet<Color> Color { get; set; }
        public virtual DbSet<Feedback> Feedback { get; set; }
        public virtual DbSet<Palette> Palette { get; set; }
        public virtual DbSet<PDF> PDF { get; set;} 
        public virtual DbSet<CustomerWork> CustomerWork { get; set; }
    }
}
