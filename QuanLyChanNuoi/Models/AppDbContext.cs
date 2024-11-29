using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;

namespace QuanLyChanNuoi.Models
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }
        public DbSet<Animal> Animal { get; set; }
        public DbSet<HealthRecord> HealthRecord { get; set; }
        public DbSet<FoodInventory> FoodInventory { get; set; }
        public DbSet<Sale> Sale { get; set; }
        public DbSet<Feed> Feed { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<QualityControl> QualityControl { get; set; }
        public DbSet<Treatment> Treatment { get; set; }
        public DbSet<Vaccination> Vaccination { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            

        }
    }
}
