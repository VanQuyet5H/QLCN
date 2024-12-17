using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using QuanLyChanNuoi.Models;
using QuanLyChanNuoi.Models.Request;
using QuanLyChanNuoi.Services;
using System.ComponentModel.DataAnnotations;

namespace QuanLyChanNuoi.Controllers
{
    public class HealthRecordController : Controller
    {
        private readonly AppDbContext _context;
        private readonly ISendMailService _emailService;

        public HealthRecordController(AppDbContext context,ISendMailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }
        //hiển thị danh sách vật nuôi
        [HttpGet("danhsachvatnuoicandieutri")]
        public List<Animal> GetAnimalsInSickStatus()
        {
            // Lấy danh sách vật nuôi có trạng thái "ốm"
            var sickAnimals = _context.Animal
                                      .Where(a => a.Status == "Sick")  // Giả sử trạng thái "Sick" đại diện cho vật nuôi bị ốm
                                      .ToList();

            return sickAnimals;
        }
        [HttpPost("add")]
        public async Task<IActionResult> AddHealthRecord([FromBody] AddHealthRecordRequest request)
        {
            if (request == null)
                return BadRequest("Request không hợp lệ.");

            var animal = await _context.Animal.FindAsync(request.AnimalId);
            if (animal == null)
                return NotFound("Vật nuôi không tồn tại.");
            if (animal.Status != "Sick")
            {
                return BadRequest("Chỉ có thể thêm lịch sử chăm sóc cho những vật nuôi bị ốm.");
            }
            var user = await _context.User.FindAsync(request.UserId);
            if (user == null)
                return NotFound("Người dùng không tồn tại.");

            // Kiểm tra vai trò người dùng
            if (user.Role != "User" && user.Role!="Admin")
            {
                return Forbid("Người dùng không có quyền thực hiện hành động này.");
            }
            var healthRecord = new HealthRecord
            {
                AnimalId = request.AnimalId,
                UserId = request.UserId,
                CheckupDate = request.CheckupDate,
                Diagnosis = request.Diagnosis,
                Treatment = request.Treatment,
                Medication = request.Medication,
                Notes = request.Notes
            };

            _context.HealthRecord.Add(healthRecord);
            await _context.SaveChangesAsync();
          
            return Ok(new { Message = "Thêm lịch sử chăm sóc thành công.", HealthRecordId = healthRecord.Id });
        }
        [HttpGet("get-by-animal/{animalId}")]
        public async Task<IActionResult> GetHealthRecordsByAnimal(int animalId)
        {
            var healthRecords = await _context.HealthRecord
                .Where(h => h.AnimalId == animalId)
                .OrderByDescending(h => h.CheckupDate)
                .ToListAsync();

            if (!healthRecords.Any())
                return NotFound("Không có lịch sử chăm sóc nào cho vật nuôi này.");

            return Ok(healthRecords);
        }
        // API để cập nhật trạng thái vật nuôi
        [HttpPut("update-status/{animalId}")]
        public async Task<IActionResult> UpdateAnimalStatus(int animalId, [FromBody] UpdateAnimalStatusRequest request)
        {
            var animal = await _context.Animal.FindAsync(animalId);
            if (animal == null)
                return NotFound("Vật nuôi không tồn tại.");

            if (request.Status == "Healthy")
            {
                // Cập nhật trạng thái thành Khỏe mạnh
                animal.Status = "Healthy";
            }
            else if (request.Status == "Dead")
            {
                // Xóa vật nuôi nếu chết
                _context.Animal.Remove(animal);
            }
            else
            {
                return BadRequest("Trạng thái không hợp lệ.");
            }

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Cập nhật trạng thái vật nuôi thành công." });
        }

        [HttpGet("report")]
        public async Task<IActionResult> GetHealthRecordReport()
        {
            var report = await _context.HealthRecord
                .GroupBy(h => h.Diagnosis)
                .Select(g => new
                {
                    Diagnosis = g.Key,
                    Count = g.Count(),
                    AnimalsAffected = g.Select(h => h.AnimalId).Distinct().Count()
                })
                .OrderByDescending(r => r.Count)
                .ToListAsync();

            return Ok(report);
        }
        [HttpPost("api/treatment")]
        public async Task<IActionResult> CreateTreatment([FromBody] TreatmentCreateDto treatmentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Kiểm tra danh sách thuốc
            if (treatmentDto.Medicines == null || !treatmentDto.Medicines.Any())
            {
                return BadRequest(new { Error = "Medicines list cannot be null or empty" });
            }

            // Kiểm tra HealthRecordId có tồn tại không
            var healthRecord = await _context.HealthRecord.FindAsync(treatmentDto.HealthRecordId);
            if (healthRecord == null)
            {
                return NotFound(new { Error = "HealthRecordId does not exist" });
            }

            // Tạo thực thể Treatment từ DTO
            var treatment = new Treatment
            {
                Name = treatmentDto.Name,
                Description = treatmentDto.Description,
                Duration = treatmentDto.Duration,
                Effectiveness = treatmentDto.Effectiveness, // Đảm bảo Effectiveness được truyền
                HealthRecordId = treatmentDto.HealthRecordId,
                TreatmentMedication = new List<TreatmentMedication>()
            };

            // Tạo các TreatmentMedication từ MedicineDto
            foreach (var medicine in treatmentDto.Medicines)
            {
                var medication = await _context.Medication
                    .FirstOrDefaultAsync(m => m.Name == medicine.Name); // Tìm thuốc trong cơ sở dữ liệu

                if (medication == null)
                {
                    return BadRequest(new { Error = $"Medication with name {medicine.Name} not found" });
                }

                treatment.TreatmentMedication.Add(new TreatmentMedication
                {
                    MedicationId = medication.Id, // Ánh xạ MedicationId
                    Dosage = medicine.Dosage,     // Ánh xạ liều lượng
                    Frequency = medicine.Frequency ?? "1 lần/ngày"  // Tần suất sử dụng mặc định nếu không có
                });
            }

            try
            {
                // Lưu vào cơ sở dữ liệu
                _context.Treatment.Add(treatment);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Treatment created successfully",
                    Treatment = new
                    {
                        treatment.Id,
                        treatment.Name,
                        treatment.Description,
                        treatment.Duration,
                        Medicines = treatment.TreatmentMedication.Select(m => new
                        {
                            m.Medication.Name,
                            m.Dosage,
                            m.Frequency
                        })
                    }
                });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu có
                return StatusCode(500, new { Error = "An error occurred while saving the treatment", Details = ex.Message });
            }
        }
        [HttpGet("laydanhsachthuocvahealthrecord")]
        public async Task<IActionResult> GetMedicationsAndHealthRecords()
        {
            // Lấy danh sách thuốc và loại bỏ trùng lặp
            var medications = await _context.TreatmentMedication
                .Join(
                    _context.Medication,
                    tm => tm.MedicationId,
                    m => m.Id,
                    (tm, m) => new
                    {
                        MedicineName = m.Name
                    }
                )
                .Distinct()
                .ToListAsync();

            // Lấy danh sách HealthRecord ID va ten vat nuoi
            var healthRecords = await _context.HealthRecord.Join(_context.Animal,tm=>tm.AnimalId,m=>m.Id, (tm, m) => new
            {
               Id=tm.Id,
               Name=m.Name
            })
                .Distinct()
                .ToListAsync();

            // Gộp hai kết quả vào một đối tượng
            var result = new
            {
                Medications = medications,
                HealthRecords = healthRecords
            };

            return Ok(result);
        }


        public class TreatmentCreateDto
        {
            [Required(ErrorMessage = "Name is required")]
            [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
            public string Name { get; set; } = string.Empty;

            [Required(ErrorMessage = "Description is required")]
            public string Description { get; set; } = string.Empty;

            [Range(1, 365, ErrorMessage = "Duration must be between 1 and 365 days")]
            public int Duration { get; set; }

            [Required(ErrorMessage = "Medicines list is required")]
            public List<MedicineDto> Medicines { get; set; } = new List<MedicineDto>();

            [Required(ErrorMessage = "HealthRecordId is required")]
            public int HealthRecordId { get; set; }
            [Required(ErrorMessage = "Effectiveness is required")]
            [MaxLength(20, ErrorMessage = "Effectiveness cannot exceed 20 characters")]
            public string Effectiveness { get; set; } = string.Empty;
        }
        public class MedicineDto
        {
            public string Name { get; set; }
            public string Dosage { get; set; }
            public string Frequency { get; set; }
        }



        public class UpdateAnimalStatusRequest
        {
            public string Status { get; set; }  // "Healthy" hoặc "Dead"
        }

    }
}
