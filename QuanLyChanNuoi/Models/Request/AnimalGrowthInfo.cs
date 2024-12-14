namespace QuanLyChanNuoi.Models.Request
{
    public class AnimalGrowthInfo
    {
        public int Id { get; set; }  // Mã số
        public string Type { get; set; }  // Loại
        public decimal InitialWeight { get; set; }  // Cân nặng ban đầu
        public decimal CurrentWeight { get; set; }  // Cân nặng hiện tại
        public decimal GrowthPerDay { get; set; }  // Tăng trưởng (kg/ngày)
        public DateTime LastUpdated { get; set; }  // Cập nhật cuối
        public string Status { get; set; }  // Trạng thái
    }

}
