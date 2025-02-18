﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using QuanLyChanNuoi.Models;
using QuanLyChanNuoi.Models.Request;
using QuanLyChanNuoi.Services;
using System.ComponentModel.DataAnnotations;
using static QuanLyChanNuoi.Models.Request.HoSoSkDto;

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
                                      .Where(a => a.Status == "Ốm"||a.Status=="Đang điều trị")  // Giả sử trạng thái "Sick" đại diện cho vật nuôi bị ốm
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
            if (animal.Status != "Ốm" && animal.Status != "Đang điều trị")
            {
                return BadRequest("Chỉ có thể thêm lịch sử chăm sóc cho những vật nuôi bị ốm hoặc vật nuôi đang điều trị.");
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

            if (request.Status == "Khỏe mạnh")
            {
                // Cập nhật trạng thái thành Khỏe mạnh
                animal.Status = "Khỏe mạnh";
            }
            else if (request.Status == "Đang điều trị")
            {
                // Cập nhật trạng thái thành đang điều trị
                animal.Status = "Đang điều trị";
            }
            else if (request.Status == "Chết")
            {
                if (animal != null)
                {
                    // Cập nhật số lượng vật nuôi trong chuồng
                    var cage = _context.Cage.FirstOrDefault(c => c.Id == animal.CageId);
                    if (cage != null)
                    {
                        cage.CurrentOccupancy--;  // Giảm số lượng vật nuôi trong chuồng
                        _context.Cage.Update(cage);  // Lưu thay đổi trong chuồng
                    }

                    // Xóa vật nuôi nếu chết
                    _context.Animal.Remove(animal);
                    _context.SaveChanges();  // Lưu thay đổi vào cơ sở dữ liệu
                }
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
                Effectiveness = treatmentDto.Effectiveness,
                HealthRecordId = treatmentDto.HealthRecordId,
                CreatedAt=DateTime.Now,
                TreatmentMedication = new List<TreatmentMedication>()
            };

            // Tạo các TreatmentMedication từ MedicineDto
            foreach (var medicine in treatmentDto.Medicines)
            {
                // Sử dụng join để lấy thông tin thuốc và tồn kho
                var medicationWithInventory = await (from m in _context.Medication
                                                     join i in _context.Inventory on m.Id equals i.MedicationId
                                                     where m.Name == medicine.Name
                                                     select new
                                                     {
                                                         Medication = m,
                                                         Inventory = i
                                                     }).FirstOrDefaultAsync();

                if (medicationWithInventory == null)
                {
                    return BadRequest(new { Error = $"Medication with ID {medicine.Name} not found in inventory" });
                }

                var medication = medicationWithInventory.Medication;
                var inventory = medicationWithInventory.Inventory;

                // Kiểm tra số lượng tồn kho
                if (inventory.Quantity < medicine.Dosage)
                {
                    return BadRequest(new
                    {
                        Error = $"Not enough stock for medication {medication.Name}. Available: {inventory.Quantity}, Required: {medicine.Dosage}"
                    });
                }

                // Trừ số lượng tồn kho
                // Nếu medicine.Dosage là double hoặc decimal và bạn muốn làm tròn trước khi trừ
                int dosageToSubtract = (int)Math.Floor(medicine.Dosage); // Làm tròn xuống

                // Nếu muốn làm tròn đến số nguyên gần nhất
                // int dosageToSubtract = (int)Math.Round(medicine.Dosage);

                if (inventory.Quantity < dosageToSubtract)
                {
                    return BadRequest(new
                    {
                        Error = $"Not enough stock for medication {medication.Name}. Available: {inventory.Quantity}, Required: {dosageToSubtract}"
                    });
                }

                // Trừ số lượng tồn kho
                inventory.Quantity -= dosageToSubtract;


                // Thêm vào danh sách TreatmentMedication
                treatment.TreatmentMedication.Add(new TreatmentMedication
                {
                    MedicationId = medication.Id,
                    Dosage = medicine.Dosage,
                    Frequency = medicine.Frequency ?? "1 lần/ngày"
                });
            }



            try
            {
                // Lưu thông tin điều trị và cập nhật kho thuốc
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
                return StatusCode(500, new { Error = "An error occurred while saving the treatment", Details = ex.Message });
            }
        }
        [HttpGet("api/inventory/{medicineName}")]
        public async Task<IActionResult> GetMedicineQuantity(string medicineName)
        {
            // Lấy số lượng thuốc từ cơ sở dữ liệu, kết hợp giữa Inventory và Medication
            var medicationData = await (from inv in _context.Inventory
                                        join med in _context.Medication on inv.MedicationId equals med.Id
                                        where med.Name.ToLower() == medicineName.ToLower() // So sánh không phân biệt hoa/thường
                                        select new
                                        {
                                            med.Name,  // Tên thuốc
                                            inv.Quantity // Số lượng thuốc
                                        }).FirstOrDefaultAsync();

            // Kiểm tra nếu không tìm thấy thuốc
            if (medicationData == null)
            {
                return NotFound(new { Message = "Thuốc không có trong kho" });
            }

            // Trả về thông tin số lượng thuốc
            return Ok(new
            {
                MedicineName = medicationData.Name,
                Quantity = medicationData.Quantity
            });
        }

        [HttpGet("laydanhsachthuocvahealthrecord")]
        public async Task<IActionResult> GetMedicationsAndHealthRecords()
        {
            // Lấy danh sách thuốc và loại bỏ trùng lặp
            var medications = await _context.Medication
                            .Select(m => new { m.Name, m.Unit })  // Chọn cả tên thuốc và đơn vị
                            .Distinct()  // Lọc các cặp tên thuốc và đơn vị duy nhất
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
        //danh sách vật nuôi điều trị(ok)
        [HttpGet("with-health-records")]
        public async Task<IActionResult> GetAnimalsWithHealthRecords(
    int page = 1,
    int size = 10,
    string searchQuery = "")
        {
            // Tạo truy vấn cơ bản
            var query = _context.Animal
                .Where(a => _context.HealthRecord.Any(hr => hr.AnimalId == a.Id)); // Kiểm tra nếu có bản ghi sức khỏe liên quan

            // Nếu có tìm kiếm theo tên hoặc ID
            if (!string.IsNullOrEmpty(searchQuery))
            {
                query = query.Where(a => a.Name.Contains(searchQuery) || a.Id.ToString().Contains(searchQuery));
            }

            // Tính toán phân trang
            var totalRecords = await query.CountAsync();
            var animals = await query
                .Skip((page - 1) * size)  // Bỏ qua các bản ghi trước trang hiện tại
                .Take(size)  // Lấy số lượng bản ghi theo kích thước trang
                .Select(a => new AnimalResponse
                {
                    Id = a.Id,
                    Name = a.Name,
                    Type = a.Type,
                    Gender = a.Gender,
                    BirthDate = a.BirthDate,
                    Status = a.Status,
                    Weight = a.Weight,
                    Breed = a.Breed,
                    CreatedAt = a.CreatedAt
                })
                .OrderBy(a => a.Name)  // Sắp xếp theo tên vật nuôi
                .ToListAsync();

            // Trả về kết quả với tổng số bản ghi và dữ liệu vật nuôi
            var result = new
            {
                TotalRecords = totalRecords,
                Animals = animals
            };

            return Ok(result);
        }

        // API lấy lịch sử khám chữa bệnh của vật nuôi theo ID vật nuôi(chưa sd)
        [HttpGet("history/{animalId}")]
        public async Task<ActionResult<IEnumerable<HealthRecordHistoryDto>>> GetAnimalHistory(int animalId)
        {
            var historyRecords = await _context.HealthRecord
                .Where(hr => hr.AnimalId == animalId)
                .Include(hr => hr.User)
                .Include(hr => hr.Animal) // Lấy thông tin vật nuôi liên quan
                .Select(hr => new HealthRecordHistoryDto
                {
                    Id = hr.Id,
                    AnimalId = hr.AnimalId,
                    AnimalName = hr.Animal.Name,
                    CheckupDate = hr.CheckupDate,
                    Diagnosis = hr.Diagnosis,
                    Treatment = hr.Treatment,
                    Medication = hr.Medication,
                    Notes = hr.Notes,
                    UserFullName = hr.User.FullName
                })
                .ToListAsync();

            if (historyRecords == null || !historyRecords.Any())
            {
                return NotFound("No history found for this animal.");
            }

            return Ok(historyRecords);
        }
        //thống kê sức theo dõi sức khỏe vật nuoi
        [HttpGet("thongketheodoisuckhoevatnuoi")]
        public IActionResult GetHealthStatistics(DateTime? startDate = null, DateTime? endDate = null)
        {
            // Lọc theo ngày nếu có
            var query = _context.Animal.AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(a => a.CreatedAt >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(a => a.CreatedAt <= endDate.Value);
            }

            // Thống kê dữ liệu
            var totalAnimals = query.Count();
            var totalSickAnimals = query.Count(a => a.Status == "Ốm");
            var totalHealthyAnimals = query.Count(a => a.Status == "Khỏe mạnh");

            var sickAnimals = query
                        .Where(a => a.Status == "Ốm")
                        .Select(a => new { a.Id, a.Name })
                        .ToList();


            var healthyAnimalIds = query
                .Where(a => a.Status == "Khỏe mạnh")
                .Select(a => new {a.Id,a.Name })
                .ToList();

            var totalRecords = _context.Animal.Count(); // Tổng số bản ghi không áp dụng bộ lọc

            // Tạo kết quả trả về
            var statistics = new
            {
                TotalAnimals = totalAnimals,
                TotalSickAnimals = totalSickAnimals,
                TotalHealthyAnimals = totalHealthyAnimals,
                SickAnimals = sickAnimals,
                HealthyAnimals = healthyAnimalIds,
                TotalRecords = totalRecords
            };

            return Ok(statistics);
        }
        [HttpGet("{animalId}")]
        public async Task<IActionResult> GetHealthRecord(int animalId)
        {
            var healthRecordQuery = await (from hr in _context.HealthRecord
                                           join tm in _context.Treatment on hr.Id equals tm.HealthRecordId
                                           join tmm in _context.TreatmentMedication on tm.Id equals tmm.TreatmentId
                                           join m in _context.Medication on tmm.MedicationId equals m.Id
                                           where hr.AnimalId ==animalId
                                           select new
                                           {
                                               hr.AnimalId,
                                               hr.CheckupDate,
                                               hr.Diagnosis,
                                               hr.Notes,
                                               TreatmentId = tm.Id,
                                               TreatmentName = tm.Name,
                                               TreatmentCreatedAt = tm.CreatedAt,
                                               MedicationName = m.Name,
                                               Dosage = tmm.Dosage,
                                               Frequency = tmm.Frequency,
                                               MedicationDescription = m.Description,
                                               TreatmentDescription = tm.Description
                                           }).ToListAsync();

            if (healthRecordQuery == null || !healthRecordQuery.Any())
            {
                return NotFound();
            }

            return Ok(healthRecordQuery);
        }



        public class HealthStatistics
        {
            public int TotalAnimals { get; set; }
            public int TotalSickAnimals { get; set; }
            public int TotalHealthyAnimals { get; set; }
            public List<int> SickAnimals { get; set; }
            public List<int> HealthyAnimals { get; set; }
            public int TotalRecords { get; set; }
        }


        public class AnimalResponse
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Type { get; set; }
            public string Gender { get; set; }
            public DateTime BirthDate { get; set; }
            public string Status { get; set; }
            public decimal? Weight { get; set; }
            public string Breed { get; set; }
            public DateTime CreatedAt { get; set; }
        }

        public class HealthRecordHistoryDto
        {
            public int Id { get; set; }
            public int AnimalId { get; set; }
            public string AnimalName { get; set; }
            public DateTime CheckupDate { get; set; }
            public string Diagnosis { get; set; }
            public string Treatment { get; set; }
            public string Medication { get; set; }
            public string Notes { get; set; }
            public string UserFullName { get; set; }
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
            public double Dosage { get; set; }
            public string Frequency { get; set; }
        }



        public class UpdateAnimalStatusRequest
        {
            public string Status { get; set; }  // "Healthy" hoặc "Dead"
        }

    }
}
