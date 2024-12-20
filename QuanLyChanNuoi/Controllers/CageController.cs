using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChanNuoi.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace QuanLyChanNuoi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CageController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Thêm Chuồng Mới
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cage>>> GetCages(
     int pageNumber = 1,       // Trang hiện tại
     int pageSize = 10,        // Số mục trên mỗi trang
     string? searchTerm = "",   // Từ khóa tìm kiếm
     string sortBy = "Name",   // Trường sắp xếp
     bool ascending = true     // Thứ tự sắp xếp (tăng dần hoặc giảm dần)
 )
        {
            var query = _context.Cage.Include(c => c.Animal).AsQueryable();

            // Tìm kiếm theo tên chuồng
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(c => c.Name.Contains(searchTerm));
            }

            // Sắp xếp theo trường được chỉ định
            if (ascending)
            {
                switch (sortBy.ToLower())
                {
                    case "name":
                        query = query.OrderBy(c => c.Name);
                        break;
                    case "capacity":
                        query = query.OrderBy(c => c.Capacity);
                        break;
                    case "currentoccupancy":
                        query = query.OrderBy(c => c.CurrentOccupancy);
                        break;
                    default:
                        query = query.OrderBy(c => c.Name); // Sắp xếp theo tên mặc định
                        break;
                }
            }
            else
            {
                switch (sortBy.ToLower())
                {
                    case "name":
                        query = query.OrderByDescending(c => c.Name);
                        break;
                    case "capacity":
                        query = query.OrderByDescending(c => c.Capacity);
                        break;
                    case "currentoccupancy":
                        query = query.OrderByDescending(c => c.CurrentOccupancy);
                        break;
                    default:
                        query = query.OrderByDescending(c => c.Name); // Sắp xếp theo tên mặc định
                        break;
                }
            }

            // Phân trang
            var totalItems = await query.CountAsync();
            var cages = await query.Skip((pageNumber - 1) * pageSize)
                                    .Take(pageSize)
                                    .ToListAsync();

            // Trả về kết quả phân trang
            return Ok(new
            {
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling((double)totalItems / pageSize),
                PageNumber = pageNumber,
                PageSize = pageSize,
                Cages = cages
            });
        }


        // 2. Thêm chuồng mới
        [HttpPost("NhapChuong")]
        public async Task<IActionResult> AddCage([FromBody] CageDto cageDto)
        {
            if (cageDto == null) return BadRequest("Thông tin không hợp lệ.");

            // Kiểm tra logic
            if (cageDto.CurrentOccupancy > cageDto.Capacity)
            {
                return BadRequest("Số lượng vật nuôi hiện tại vượt sức chứa chuồng.");
            }
            if (string.IsNullOrEmpty(cageDto.EnvironmentalConditions))
            {
                cageDto.EnvironmentalConditions = "Không có yêu cầu đặc biệt.";
            }

            var cage = new Cage
            {
                Name = cageDto.Name,
                Purpose = cageDto.Purpose,
                Area = cageDto.Area,
                Location = cageDto.Location,
                Capacity = cageDto.Capacity,
                CurrentOccupancy = cageDto.CurrentOccupancy,
                IsAvailable = cageDto.IsAvailable,
                MaintenanceDate = cageDto.MaintenanceDate,
                Notes = cageDto.Notes,
                EnvironmentalConditions = cageDto.EnvironmentalConditions
            };

            _context.Cage.Add(cage);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Thêm chuồng thành công!", Data = cage });
        }
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<Cage>>> GetAvailableCages()
        {
            var cages = await _context.Cage
                .Where(c => c.CurrentOccupancy < c.Capacity) // Chỉ lấy chuồng còn chỗ trống
                .ToListAsync();

            if (cages == null || cages.Count == 0)
            {
                return NotFound("Không có chuồng khả dụng.");
            }

            return Ok(cages);
        }
        // 3. Thêm vật nuôi vào chuồng
        [HttpPost("{cageId}/AddAnimals")]
        public async Task<ActionResult> AddAnimalsToCage(int cageId, List<int> animalIds)
        {
            var cage = await _context.Cage.Include(c => c.Animal).FirstOrDefaultAsync(c => c.Id == cageId);

            if (cage == null)
                return NotFound("Chuồng không tồn tại.");

            var animals = await _context.Animal.Where(a => animalIds.Contains(a.Id)).ToListAsync();

            if (animals.Count != animalIds.Count)
                return BadRequest("Một số vật nuôi không tồn tại.");

            if (cage.CurrentOccupancy + animals.Count > cage.Capacity)
                return BadRequest("Chuồng không đủ chỗ.");

            foreach (var animal in animals)
            {
                animal.CageId = cageId;
                cage.CurrentOccupancy++;
            }

            _context.Animal.UpdateRange(animals);
            _context.Cage.Update(cage);

            await _context.SaveChangesAsync();
            return Ok("Đã thêm vật nuôi vào chuồng.");
        }


        // 4. Di chuyển vật nuôi giữa các chuồng
        [HttpPost("MoveAnimal")]
        public async Task<ActionResult> MoveAnimal(int animalId, int targetCageId)
        {
            var animal = await _context.Animal.FindAsync(animalId); // Sử dụng bảng Animal không có 's'
            if (animal == null)
                return NotFound("Vật nuôi không tồn tại.");

            var currentCage = await _context.Cage.FirstOrDefaultAsync(c => c.Id == animal.CageId);
            var targetCage = await _context.Cage.FirstOrDefaultAsync(c => c.Id == targetCageId);

            if (targetCage == null)
                return NotFound("Chuồng đích không tồn tại.");

            if (targetCage.CurrentOccupancy + 1 > targetCage.Capacity)
                return BadRequest("Chuồng đích đã đầy.");

            // Cập nhật sức chứa
            if (currentCage != null)
                currentCage.CurrentOccupancy--;
            targetCage.CurrentOccupancy++;

            // Cập nhật chuồng cho vật nuôi
            animal.CageId = targetCageId;

            _context.Cage.Update(currentCage);
            _context.Cage.Update(targetCage);
            _context.Animal.Update(animal); // Sử dụng bảng Animal không có 's'

            await _context.SaveChangesAsync();
            return Ok("Đã di chuyển vật nuôi thành công.");
        }

        // 5. Xóa vật nuôi khỏi chuồng
        [HttpDelete("RemoveAnimal/{animalId}")]
        public async Task<ActionResult> RemoveAnimal(int animalId)
        {
            var animal = await _context.Animal.FindAsync(animalId); // Sử dụng bảng Animal không có 's'
            if (animal == null)
                return NotFound("Vật nuôi không tồn tại.");

            var cage = await _context.Cage.FirstOrDefaultAsync(c => c.Id == animal.CageId);

            if (cage != null)
                cage.CurrentOccupancy--;

            _context.Animal.Remove(animal); // Sử dụng bảng Animal không có 's'
            _context.Cage.Update(cage);

            await _context.SaveChangesAsync();
            return Ok("Đã xóa vật nuôi khỏi chuồng.");
        }

        // 6. Lấy danh sách vật nuôi trong một chuồng
        [HttpGet("{cageId}/Animals")]
        public async Task<ActionResult<IEnumerable<object>>> GetAnimalsInCage(int cageId)
        {
            var animals = await _context.Animal
                .Where(a => a.CageId == cageId)
                .Select(a => new
                {
                    a.Id,
                    a.Name,
                    a.Type,
                    a.BirthDate
                })
                .ToListAsync();

            if (!animals.Any())
                return NotFound("Không có vật nuôi nào trong chuồng này.");

            return Ok(animals);
        }


        // 7. Lấy danh sách các chuồng đầy
        [HttpGet("FullCages")]
        public async Task<ActionResult<IEnumerable<Cage>>> GetFullCages()
        {
            var fullCages = await _context.Cage.Where(c => c.CurrentOccupancy >= c.Capacity).ToListAsync();
            return Ok(fullCages);
        }

        // 8. Thống kê vật nuôi theo chuồng
        [HttpGet("Statistics")]
        public async Task<ActionResult> GetCageStatistics()
        {
            var statistics = await _context.Cage
                .Select(c => new
                {
                    CageName = c.Name,
                    Capacity = c.Capacity,
                    CurrentOccupancy = c.CurrentOccupancy,
                    AvailableSlots = c.Capacity - c.CurrentOccupancy
                })
                .ToListAsync();

            return Ok(statistics);
        }
        public class CageDto
        {
            public string Name { get; set; } // Tên chuồng
            public string Purpose { get; set; } // Mục đích (Thịt, Sinh sản, Giống)
            public decimal Area { get; set; } // Diện tích chuồng (m²)
            public string Location { get; set; } // Vị trí
            public int Capacity { get; set; } // Sức chứa tối đa
            public int CurrentOccupancy { get; set; } // Số lượng vật nuôi hiện tại
            public bool IsAvailable { get; set; } // Trạng thái sẵn sàng
            public DateTime? MaintenanceDate { get; set; } // Ngày bảo trì gần nhất
            public string EnvironmentalConditions { get; set; } = "Đảm bảo tiêu chuẩn vệ sinh.";
            public string Notes { get; set; } // Ghi chú
        }
    }
}
