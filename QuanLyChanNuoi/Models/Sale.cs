namespace QuanLyChanNuoi.Models
{
    public class Sale
    {
        public int Id { get; set; }
        public int AnimalId { get; set; }
        public int UserId {  get; set; }
        public DateTime SaleDate { get; set; }
        public string BuyerName { get; set; }
        public decimal Price { get; set; }
        public decimal Quantity { get; set; }

        // Navigation Properties
        public Animal Animal { get; set; }
        public User User { get; set; }
    }
}
