namespace QuanLyChanNuoi.Models.Request
{
    public class HoSoSkDto
    {
        public class HealthRecordDto
        {
            public int AnimalId { get; set; }
            public DateTime CheckupDate { get; set; }
            public string Diagnosis { get; set; }
            public string Notes { get; set; }
            public List<TreatmentDto> Treatments { get; set; }
        }

        public class TreatmentDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public DateTime CreatedAt { get; set; }
            public string Description { get; set; }
            public List<MedicationDto> Medications { get; set; }
        }

        public class MedicationDto
        {
            public string MedicationName { get; set; }
            public double Dosage { get; set; }
            public string Frequency { get; set; }
            public string MedicationDescription { get; set; }
        }


    }
}
