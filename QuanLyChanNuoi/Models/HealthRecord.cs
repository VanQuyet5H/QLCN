namespace QuanLyChanNuoi.Models
{
    public class HealthRecord
    {
        public int Id { get; set; }
        public int AnimalId { get; set; }
        public int UserId { get; set; }
        public DateTime CheckupDate { get; set; }
        public string Diagnosis { get; set; }
        public string Treatment { get; set; }
        public string Medication { get; set; }
        public string Notes { get; set; }

        // Navigation Properties
        public Animal Animal { get; set; }
        public User User { get; set; }
    }
}
