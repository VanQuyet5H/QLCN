using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using QuanLyChanNuoi.Models;
using QuanLyChanNuoi.Models.Request;
using QuanLyChanNuoi.Services;

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
        [HttpPost("add")]
        public async Task<IActionResult> AddHealthRecord([FromBody] AddHealthRecordRequest request)
        {
            if (request == null)
                return BadRequest("Request không hợp lệ.");

            var animal = await _context.Animal.FindAsync(request.AnimalId);
            if (animal == null)
                return NotFound("Vật nuôi không tồn tại.");

            var healthRecord = new HealthRecord
            {
                AnimalId = request.AnimalId,
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
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateHealthRecord(int id, [FromBody] UpdateHealthRecordRequest request)
        {
            var healthRecord = await _context.HealthRecord.FindAsync(id);
            if (healthRecord == null)
                return NotFound("Lịch sử chăm sóc không tồn tại.");

            healthRecord.CheckupDate = request.CheckupDate;
            healthRecord.Diagnosis = request.Diagnosis;
            healthRecord.Treatment = request.Treatment;
            healthRecord.Medication = request.Medication;
            healthRecord.Notes = request.Notes;

            _context.HealthRecord.Update(healthRecord);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Cập nhật lịch sử chăm sóc thành công." });
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


    }
}
