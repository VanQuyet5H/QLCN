using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;

namespace QuanLyChanNuoi.Models
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }
        public DbSet<Animal> Animal { get; set; }
        public DbSet<HealthRecord> HealthRecord { get; set; }
        public DbSet<Medication> Medication { get; set; }
        public DbSet<Sale> Sale { get; set; }
        public DbSet<Feed> Feed { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<QualityControl> QualityControl { get; set; }
        public DbSet<Treatment> Treatment { get; set; }
        public DbSet<Vaccination> Vaccination { get; set; }
        public DbSet<Inventory> Inventory { get; set; }
        public DbSet<TreatmentMedication> TreatmentMedication { get; set; } = null!;
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Medication Entity
            modelBuilder.Entity<Medication>(entity =>
            {
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Name).IsRequired().HasMaxLength(200);
                entity.Property(m => m.Unit).IsRequired().HasMaxLength(50);
                entity.Property(m => m.Cost).HasColumnType("decimal(18,2)");
            });

            // Treatment Entity
            modelBuilder.Entity<Treatment>(entity =>
            {
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Name).IsRequired().HasMaxLength(200);
            });

            // TreatmentMedication (Mapping Table)
            modelBuilder.Entity<TreatmentMedication>(entity =>
            {
                entity.HasKey(tm => tm.Id);
                entity.Property(tm => tm.Dosage).IsRequired().HasMaxLength(100);
                entity.Property(tm => tm.Frequency).IsRequired().HasMaxLength(100);

                entity.HasOne(tm => tm.Treatment)
                    .WithMany(t => t.TreatmentMedication)
                    .HasForeignKey(tm => tm.TreatmentId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(tm => tm.Medication)
                    .WithMany(m => m.TreatmentMedication)
                    .HasForeignKey(tm => tm.MedicationId)
                    .OnDelete(DeleteBehavior.Cascade);
            });


        }
    }
}
