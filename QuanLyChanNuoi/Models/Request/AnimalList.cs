namespace QuanLyChanNuoi.Models.Request
{
    public class AnimalList
    {
        public class AnimalStatusDto
        {
            public int Id { get; set; }
            public string Type { get; set; }
            public decimal InitialWeight { get; set; }
            public decimal CurrentWeight { get; set; }
            public decimal GrowthRate { get; set; } // kg/ngày
            public DateTime LastUpdated { get; set; }
            public string Status { get; set; }
        }
       

    }
}
