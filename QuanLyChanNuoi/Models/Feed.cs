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
        // Dinh dưỡng
        public decimal Calories { get; set; }
        public decimal Protein { get; set; }
        public decimal Fat { get; set; }
        public decimal Carbohydrates { get; set; }
        public decimal Vitamins { get; set; }
        public decimal Minerals { get; set; }

        // Navigation Properties
        public int AnimalId { get; set; }
        public Animal Animal { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
