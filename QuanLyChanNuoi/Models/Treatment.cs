namespace QuanLyChanNuoi.Models
{
    public class Treatment
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Duration { get; set; }  // Thời gian điều trị (ngày)
        public string Effectiveness { get; set; }  // Hiệu quả điều trị (Good, Moderate, Poor)
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation Properties
        public int HealthRecordId { get; set; }
        public HealthRecord HealthRecord { get; set; }
        public ICollection<TreatmentMedication> TreatmentMedication { get; set; } = new List<TreatmentMedication>();
    }
}
