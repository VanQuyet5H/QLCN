namespace QuanLyChanNuoi.Models
{
    public class Inventory
    {
        public int Id { get; set; } // Primary Key
        public int MedicationId { get; set; } // Foreign Key liên kết với bảng Medication
        public int Quantity { get; set; } // Số lượng hiện có trong kho
        public int MinimumQuantity { get; set; } // Mức tồn kho tối thiểu
        public string Status { get; set; } // Trạng thái (Ví dụ: "Cảnh báo", "Đủ kho", v.v.)

        // Navigation property
        public Medication Medication { get; set; } = null!;
    }

}
