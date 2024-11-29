namespace QuanLyChanNuoi.Models
{
    public class FoodInventory
    {
        public int Id { get; set; }
        public string FoodType { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public string Supplier { get; set; }
        public DateTime? LastRestockDate { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
