using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChanNuoi.Models;
using static QuanLyChanNuoi.Controllers.TiemChungController;

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
        [HttpGet("GetVaccinations")]
        public async Task<IActionResult> GetVaccinations(
         int page = 1,
         int pageSize = 10,
         string? search = "")
        {
            try
            {
                var query = _context.Vaccination
                    .Join(_context.Animal,
                        vaccination => vaccination.AnimalId,
                        animal => animal.Id,
                        (vaccination, animal) => new VaccinationListDto
                        {
                            VaccinationId = vaccination.Id,
                            AnimalId = animal.Id,
                            AnimalName = animal.Name,
                            AnimalType = animal.Type,
                            VaccineName = vaccination.VaccineName,
                            VaccinationDate = vaccination.VaccinationDate,
                            Status = vaccination.Status,
                            Note = vaccination.Note
                        });

                // Áp dụng bộ lọc tìm kiếm
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(v =>
                        v.VaccineName.Contains(search) ||
                        v.Status.Contains(search) ||
                        v.AnimalName.Contains(search) ||
                        v.AnimalType.Contains(search));
                }

                // Tính tổng số bản ghi
                var totalRecords = await query.CountAsync();

                // Phân trang dữ liệu
                var vaccinations = await query
                    .Skip((page - 1) * pageSize)  // Bỏ qua số bản ghi đã xem
                    .Take(pageSize)  // Lấy số bản ghi theo kích thước trang
                    .ToListAsync();

                // Trả về dữ liệu phân trang
                var result = new
                {
                    TotalRecords = totalRecords,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalRecords / pageSize),
                    Data = vaccinations
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("animal/{animalId}")]
        public async Task<ActionResult<IEnumerable<Vaccination>>> GetVaccinationByAnimal(int animalId)
        {
            var vaccinations = await _context.Vaccination
                                             .Where(v => v.AnimalId == animalId)
                                             .ToListAsync();

            if (vaccinations == null || vaccinations.Count == 0)
            {
                return NotFound();
            }

            return vaccinations;
        }
        // POST: api/Vaccination
        [HttpPost("nhapthongtintiem")]
        public async Task<ActionResult<VaccinationDto>> PostVaccination(VaccinationDto vaccinationDto)
        {
            // Check if Animal exists
            var animal = await _context.Animal.FindAsync(vaccinationDto.AnimalId);
            if (animal == null)
            {
                return BadRequest("Animal not found");
            }
            var vaccination = new Vaccination
            {
                AnimalId = vaccinationDto.AnimalId,
                VaccineName = vaccinationDto.VaccineName,
                VaccinationDate = vaccinationDto.VaccinationDate,
                Note=vaccinationDto.Note,
                NumberOfDoses = vaccinationDto.NumberOfDoses,
                Status=vaccinationDto.Status,
            };
            try
            {

                // Add vaccination record
                _context.Vaccination.Add(vaccination);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Vaccion created successfully",
                    vaccination= new
                    {
                        Id=vaccination.Id,
                        AnimalId=animal.Id,
                        VaccineName = vaccination.VaccineName,
                        VaccinationDate = vaccination.VaccinationDate,
                        Status=vaccination.Status,
                        NumberOfDoses=vaccination.NumberOfDoses,
                        Note=vaccination.Note
                    }
                });
            }catch (Exception ex)
            {
                // Xử lý lỗi nếu có
                return StatusCode(500, new { Error = "An error occurred while saving the vaccionation", Details = ex.Message });
            }
        }
        [HttpGet("LayAnimalTiem")]
        public async Task<IActionResult> GetAnimalVaccionation()
        {
            var animalsList = await _context.Animal
                             .Select(a => new
                             {
                                 a.Id,
                                 a.Name,
                                 a.Type
                             })
                             .ToListAsync();
            var result = new
            {
                Animal = animalsList,
            };

            return Ok(result);
        }
        [HttpPut("UpdateVaccination")]
        public async Task<IActionResult> UpdateVaccination([FromBody] UpdateVaccinationDto vaccinationDto)
        {
            if (vaccinationDto == null)
            {
                return BadRequest("Dữ liệu không hợp lệ");
            }

            var vaccination = await _context.Vaccination.FindAsync(vaccinationDto.VaccinationId);
            if (vaccination == null)
            {
                return NotFound("Tiêm chủng không tồn tại");
            }

            // Cập nhật các thuộc tính của tiêm chủng
            vaccination.AnimalId = vaccinationDto.AnimalId;
            vaccination.VaccineName = vaccinationDto.VaccineName;
            vaccination.VaccinationDate = vaccinationDto.VaccinationDate;
            vaccination.Status = vaccinationDto.Status;
            vaccination.Note = vaccinationDto.Note;

            // Lưu thay đổi vào cơ sở dữ liệu
            _context.Vaccination.Update(vaccination);
            await _context.SaveChangesAsync();

            return Ok("Cập nhật thông tin tiêm chủng thành công");
        }
        public class VaccinationDto
        {
            public int Id { get; set; }                // ID của tiêm chủng
            public int AnimalId { get; set; }           // ID vật nuôi
            public string VaccineName { get; set; }     // Tên vắc-xin
            public DateTime VaccinationDate { get; set; } // Ngày tiêm chủng
            public string Status { get; set; } // Trạng thái tiêm (Ví dụ: "Đã Tiêm", "Chưa Tiêm")
            public int NumberOfDoses { get; set; } // Số lần tiêm
            public string Note { get; set; }
        }
        public class VaccinationListDto
        {
            public int VaccinationId { get; set; }  // Mã tiêm
            public int AnimalId { get; set; }        // Mã vật nuôi
            public string AnimalName { get; set; }   // Tên vật nuôi
            public string AnimalType { get; set; }   // Loại vật nuôi
            public string VaccineName { get; set; }  // Tên vaccine
            public DateTime VaccinationDate { get; set; }  // Ngày tiêm
            public string Status { get; set; }       // Trạng thái
            public string Note { get; set; }         // Ghi chú
        }
        public class UpdateVaccinationDto
        {
            public int VaccinationId { get; set; }
            public int AnimalId { get; set; }
            public string VaccineName { get; set; }
            public DateTime VaccinationDate { get; set; }
            public string Status { get; set; }
            public string Note { get; set; }
        }

    }
}
