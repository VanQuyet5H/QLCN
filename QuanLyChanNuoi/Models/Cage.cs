namespace QuanLyChanNuoi.Models
{
    public class Cage
    {
        public int Id { get; set; }
        public string Name { get; set; }  // Tên chuồng
        public string Purpose { get; set; }  // Mục đích (Thịt, Sinh sản, Giống)
        public decimal Area { get; set; }  // Diện tích chuồng (m2)
        public bool IsAvailable { get; set; }  // Trạng thái chuồng có sẵn không

        // Các trường bổ sung
        public string Location { get; set; }  // Vị trí chuồng
        public int Capacity { get; set; }  // Sức chứa tối đa
        public int CurrentOccupancy { get; set; }  // Số lượng vật nuôi hiện tại
        public DateTime? MaintenanceDate { get; set; }  // Ngày bảo trì gần nhất
        public string EnvironmentalConditions { get; set; }  // Điều kiện môi trường yêu cầu
        public string Notes { get; set; }  // Ghi chú thêm

        // Liên kết với bảng Animal
        public ICollection<Animal> Animal { get; set; }
    }

}
