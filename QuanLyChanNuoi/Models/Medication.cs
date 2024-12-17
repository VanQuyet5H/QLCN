namespace QuanLyChanNuoi.Models
{
    public class Medication
    {
        public int Id { get; set; } // Primary Key
        public string Name { get; set; } = null!; // Tên thuốc
        public string? Description { get; set; } // Mô tả thuốc
        public string Unit { get; set; } = null!; // Đơn vị (viên, chai, lọ,...)
        public decimal Cost { get; set; } // Giá mỗi đơn vị
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Ngày tạo

        // Navigation property
        public ICollection<TreatmentMedication> TreatmentMedication { get; set; } = new List<TreatmentMedication>();
    }


}
