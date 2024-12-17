namespace QuanLyChanNuoi.Models
{
    public class Vaccination
    {
        public int Id { get; set; }
        public int AnimalId { get; set; }
        public string VaccineName { get; set; }
        public DateTime VaccinationDate { get; set; }
        public string Status { get; set; } // Trạng thái tiêm (Ví dụ: "Đã Tiêm", "Chưa Tiêm")
        public int NumberOfDoses { get; set; } // Số lần tiêm
        public string Note { get; set; }

        // Navigation property
        public Animal Animal { get; set; }
    }
}
