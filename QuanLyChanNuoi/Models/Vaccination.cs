namespace QuanLyChanNuoi.Models
{
    public class Vaccination
    {
        public int Id { get; set; }
        public int AnimalId { get; set; }
        public string VaccineName { get; set; }
        public DateTime VaccinationDate { get; set; }

        // Navigation property
        public Animal Animal { get; set; }
    }
}
