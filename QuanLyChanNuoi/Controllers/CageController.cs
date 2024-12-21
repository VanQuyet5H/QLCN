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
        public async Task<ActionResult> GetCages(
     int pageNumber = 1,       // Trang hiện tại
     int pageSize = 10,        // Số mục trên mỗi trang
     string? searchTerm = "",  // Từ khóa tìm kiếm
     string sortBy = "Name",   // Trường sắp xếp
     bool ascending = true     // Thứ tự sắp xếp (tăng dần hoặc giảm dần)
 )
        {
            // Kiểm tra giá trị hợp lệ của `pageNumber` và `pageSize`
            if (pageNumber <= 0 || pageSize <= 0)
            {
                return BadRequest(new { Message = "PageNumber và PageSize phải lớn hơn 0." });
            }

            // Lấy dữ liệu và bao gồm liên kết với `Animal`
            var query = _context.Cage.Include(c => c.Animal).AsQueryable();

            // Tìm kiếm theo tên chuồng
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(c => c.Name.Contains(searchTerm));
            }

            // Sắp xếp
            query = ascending switch
            {
                true => sortBy.ToLower() switch
                {
                    "capacity" => query.OrderBy(c => c.Capacity),
                    "currentoccupancy" => query.OrderBy(c => c.CurrentOccupancy),
                    _ => query.OrderBy(c => c.Name)
                },
                false => sortBy.ToLower() switch
                {
                    "capacity" => query.OrderByDescending(c => c.Capacity),
                    "currentoccupancy" => query.OrderByDescending(c => c.CurrentOccupancy),
                    _ => query.OrderByDescending(c => c.Name)
                }
            };

            // Tổng số mục trước khi phân trang
            var totalItems = await query.CountAsync();

            // Lấy dữ liệu theo phân trang
            var cages = await query.Skip((pageNumber - 1) * pageSize)
                                   .Take(pageSize)
                                   .Select(c => new
                                   {
                                       c.Id,
                                       c.Name,
                                       c.Capacity,
                                       c.CurrentOccupancy,
                                       Animals = c.Animal.Select(a => new
                                       {
                                           a.Id,
                                           a.Name,
                                           a.BirthDate,
                                           a.Type,
                                           a.Gender
                                       })
                                   })
                                   .ToListAsync();

            // Trả về kết quả
            return Ok(new
            {
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling((double)totalItems / pageSize),
                PageNumber = pageNumber,
                PageSize = pageSize,
                Cages = cages
            });
        }

        public class CageDto1
        {
            public int Id { get; set; }
            public string Name { get; set; }
           
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CageDto1>> GetCage(int id)
        {
            var cage = await _context.Cage.Include(c => c.Animal)
                                            .FirstOrDefaultAsync(c => c.Id == id);

            if (cage == null)
            {
                return NotFound(new { message = "Chuồng không tồn tại." });
            }

            // Chuyển đổi thành DTO để tránh vòng lặp
            var cageDto = new CageDto1
            {
                Id = cage.Id,
                Name = cage.Name,
               
            };

            return Ok(cageDto);
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
            public string EnvironmentalConditions { get; set; } = "Đảm bảo tiêu chuẩn vệ sinh.";
            public string Notes { get; set; } // Ghi chú
        }
    }
}
