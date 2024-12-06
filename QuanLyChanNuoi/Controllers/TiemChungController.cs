using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChanNuoi.Models;

namespace QuanLyChanNuoi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TiemChungController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TiemChungController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetVaccinationSchedules()
        {
            var vaccinationSchedules = await _context.Vaccination
                .Join(_context.Animal,
                    v => v.AnimalId,
                    a => a.Id,
                    (v, a) => new { Vaccination = v, Animal = a })
                .Join(_context.HealthRecord,
                    va => va.Animal.Id,
                    hr => hr.AnimalId,
                    (va, hr) => new
                    {
                        VaccinationId = va.Vaccination.Id,
                        AnimalId = va.Animal.Id,
                        AnimalType = va.Animal.Type,
                        VaccineName = va.Vaccination.VaccineName,
                        VaccinationDate = va.Vaccination.VaccinationDate,
                        Status = va.Animal.Status,
                        Notes = hr.Notes // Ghi chú từ bảng HealthRecord
                    })
                .ToListAsync();

            return Ok(vaccinationSchedules);
        }

    }
}
