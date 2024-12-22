namespace QuanLyChanNuoi.Models
{
    public class TreatmentMedication
    {
        public int Id { get; set; } // Primary Key

        // Foreign Keys
        public int TreatmentId { get; set; }
        public int MedicationId { get; set; }

        // Additional Columns
        public double Dosage { get; set; }  // Liều lượng
        public string Frequency { get; set; } = null!; // Tần suất sử dụng (ví dụ: 2 lần/ngày)

        // Navigation properties
        public Treatment Treatment { get; set; } = null!;
        public Medication Medication { get; set; } = null!;
    }

}
