namespace QuanLyChanNuoi.Models
{
    public class Feed
    {
        public int Id { get; set; }
        public DateTime FeedingDate { get; set; }
        public string FoodType { get; set; }
        public decimal Quantity { get; set; }
        public int Cost {  get; set; }
        public string Notes { get; set; }

        // Navigation Properties
        public int AnimalId { get; set; }
        public Animal Animal { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
