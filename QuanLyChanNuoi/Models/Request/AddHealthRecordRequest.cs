namespace QuanLyChanNuoi.Models.Request
{
    public class AddHealthRecordRequest
    {
        public int AnimalId { get; set; }
        public DateTime CheckupDate { get; set; }
        public string Diagnosis { get; set; }
        public string Treatment { get; set; }
        public string Medication { get; set; }
        public string Notes { get; set; }
    }
    public class UpdateHealthRecordRequest
    {
        public DateTime CheckupDate { get; set; }
        public string Diagnosis { get; set; }
        public string Treatment { get; set; }
        public string Medication { get; set; }
        public string Notes { get; set; }
    }

}
