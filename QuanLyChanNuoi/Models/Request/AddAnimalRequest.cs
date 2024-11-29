namespace QuanLyChanNuoi.Models.Request
{
    public class AddAnimalRequest
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Gender { get; set; }
        public DateTime BirthDate { get; set; }
        public decimal Weight { get; set; }
        public string Breed { get; set; }
        public string FoodType { get; set; }
        public int FoodQuantity { get; set; }
        public string VaccineName { get; set; }
        public DateTime VaccinationDate { get; set; }
    }
}
