namespace QuanLyChanNuoi.Models
{
    public class QualityControl
    {
        public int Id { get; set; }
        public int AnimalId { get; set; }
        public DateTime InspectionDate { get; set; }
        public int UserId { get; set; }
        public decimal Weight { get; set; }
        public decimal Height { get; set; }
        public string Condition { get; set; }
        public string HealthStatus { get; set; }
        public string QualityGrade { get; set; }
        public string Remarks { get; set; }
        public bool Passed { get; set; }

        // Navigation Properties
        public Animal Animal { get; set; }
        public User User { get; set; }
    }
}
