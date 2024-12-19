using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using QuanLyChanNuoi.Models;
using System.Text.Json;

namespace QuanLyChanNuoi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnimalController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AnimalController> _logger;
        public AnimalController(AppDbContext context, ILogger<AnimalController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Lấy danh sách vật nuôi (kèm thông tin chuồng)
        [HttpGet]
        public async Task<IActionResult> GetAnimals(
     [FromQuery] int page = 1,
     [FromQuery] int pageSize = 10)
        {
            if (page <= 0 || pageSize <= 0)
            {
                return BadRequest("Page and PageSize must be greater than 0.");
            }

            // Truy vấn danh sách vật nuôi và bao gồm chuồng
            var query = _context.Animal.Include(a => a.Cage).AsQueryable();
            var totalRecords = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

            var animals = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Kiểm tra và xử lý trường hợp không có chuồng
            foreach (var animal in animals)
            {
                if (animal.Cage == null)
                {
                    // Xử lý nếu vật nuôi chưa có chuồng
                    animal.Cage = new Cage { Name = "Chưa gán chuồng" }; // Gán chuồng tạm
                }
            }

            // Ánh xạ từ Animal sang AnimalDto
            var animalDtos = animals.Select(animal => new AnimalDto
            {
                Id = animal.Id,
                Name = animal.Name,
                Type = animal.Type,
                Status = animal.Status,
                Weight = animal.Weight,
                Breed = animal.Breed,
                Gender = animal.Gender,
                BirthDate = animal.BirthDate,
                Cage = animal.Cage != null ? new CageDto
                {
                    Id = animal.Cage.Id,
                    Name = animal.Cage.Name,
                    Purpose = animal.Cage.Purpose,
                    Area = animal.Cage.Area,
                    IsAvailable = animal.Cage.IsAvailable,
                    Location = animal.Cage.Location,
                    Capacity = animal.Cage.Capacity,
                    CurrentOccupancy = animal.Cage.CurrentOccupancy
                } : null
            }).ToList();

            var response = new
            {
                Data = animalDtos,
                TotalRecords = totalRecords,
                TotalPages = totalPages,
                CurrentPage = page,
                PageSize = pageSize
            };

            // Trả về dưới dạng JSON
            return Ok(response);
        }




        // Lấy thông tin chi tiết vật nuôi (kèm thông tin chuồng)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAnimalById(int id)
        {
            var animal = await _context.Animal
                .Include(a => a.Cage)
                .Where(a => a.Id == id)
                .Select(a => new
                {
                    a.Id,
                    a.Name,
                    a.Type,
                    a.Gender,
                    a.Status,
                    a.Weight,
                    a.BirthDate,
                    a.Breed,
                    Cage = a.Cage == null ? null : new
                    {
                        a.Cage.Id,
                        a.Cage.Name,
                        a.Cage.Purpose,
                        a.Cage.Location,
                        a.Cage.Capacity,
                        a.Cage.CurrentOccupancy
                    }
                })
                .FirstOrDefaultAsync();

            if (animal == null)
            {
                return NotFound(new { message = "Vật nuôi không tồn tại" });
            }

            return Ok(animal);
        }

        // Thêm mới vật nuôi (kèm cập nhật chuồng)
        [HttpPost]
        public async Task<IActionResult> CreateAnimal([FromBody] Animal animal)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cage = await _context.Cage.FindAsync(animal.CageId);
            if (cage == null)
            {
                return BadRequest(new { message = "Chuồng không tồn tại" });
            }

            if (cage.CurrentOccupancy >= cage.Capacity)
            {
                return BadRequest(new { message = "Chuồng đã đầy" });
            }

            animal.CreatedAt = DateTime.Now;
            _context.Animal.Add(animal);

            // Cập nhật số lượng vật nuôi trong chuồng
            cage.CurrentOccupancy++;
            await _context.SaveChangesAsync();

            return Ok(animal);
        }

        // Cập nhật thông tin vật nuôi (kèm cập nhật chuồng)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAnimal(int id, [FromBody] Animal updatedAnimal)
        {
            if (id != updatedAnimal.Id)
            {
                return BadRequest(new { message = "Id không khớp" });
            }

            var animal = await _context.Animal.FindAsync(id);
            if (animal == null)
            {
                return NotFound(new { message = "Vật nuôi không tồn tại" });
            }

            if (animal.CageId != updatedAnimal.CageId)
            {
                // Giảm số lượng ở chuồng cũ
                var oldCage = await _context.Cage.FindAsync(animal.CageId);
                if (oldCage != null) oldCage.CurrentOccupancy--;

                // Tăng số lượng ở chuồng mới
                var newCage = await _context.Cage.FindAsync(updatedAnimal.CageId);
                if (newCage == null || newCage.CurrentOccupancy >= newCage.Capacity)
                {
                    return BadRequest(new { message = "Chuồng mới không hợp lệ" });
                }
                newCage.CurrentOccupancy++;
            }

            animal.Name = updatedAnimal.Name;
            animal.Type = updatedAnimal.Type;
            animal.Gender = updatedAnimal.Gender;
            animal.BirthDate = updatedAnimal.BirthDate;
            animal.Status = updatedAnimal.Status;
            animal.Weight = updatedAnimal.Weight;
            animal.Breed = updatedAnimal.Breed;
            animal.CageId = updatedAnimal.CageId;

            await _context.SaveChangesAsync();
            return Ok(animal);
        }

        // Xóa vật nuôi (kèm cập nhật chuồng)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnimal(int id)
        {
            var animal = await _context.Animal.FindAsync(id);
            if (animal == null)
            {
                return NotFound(new { message = "Vật nuôi không tồn tại" });
            }

            var cage = await _context.Cage.FindAsync(animal.CageId);
            if (cage != null)
            {
                cage.CurrentOccupancy--;
            }

            _context.Animal.Remove(animal);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa vật nuôi thành công" });
        }
        [HttpPost("assign-cages")]
        public async Task<IActionResult> AssignCagesToAnimals()
        {
            // Lấy danh sách vật nuôi chưa được gán chuồng
            var unassignedAnimals = await _context.Animal
                                    .Where(a => a.CageId == null)
                                    .ToListAsync();
            if (!unassignedAnimals.Any())
            {
                return Ok(new { message = "Tất cả vật nuôi đã được phân chuồng." });
            }
            // Lấy danh sách các chuồng còn khả dụng
            var availableCages = await _context.Cage
                .Where(c => c.IsAvailable && c.CurrentOccupancy < c.Capacity)
                .OrderBy(c => c.Id) // Sắp xếp chuồng theo thứ tự để phân bổ tuần tự
                .ToListAsync();

            if (!availableCages.Any())
            {
                return BadRequest(new { message = "Không có chuồng nào khả dụng để phân bổ." });
            }

            // Tạo từ điển để theo dõi các chuồng và số lượng vật nuôi trong từng chuồng
            var cageOccupancyTracker = availableCages.ToDictionary(
                                       cage => cage.Id,
                                       cage => cage.CurrentOccupancy
                                     );
            foreach (var animal in unassignedAnimals)
            {
                var cage = availableCages.FirstOrDefault(c =>
                            c.Purpose.Trim().ToLower().StartsWith(animal.Type.Trim().ToLower()) && // Kiểm tra nếu Purpose bắt đầu với Type
                            cageOccupancyTracker[c.Id] < c.Capacity);

                if (cage != null)
                {
                    // Gán chuồng cho vật nuôi
                    animal.CageId = cage.Id;

                    // Cập nhật số lượng vật nuôi trong chuồng
                    cageOccupancyTracker[cage.Id]++;

                    // Nếu chuồng đầy, đánh dấu không khả dụng
                    if (cageOccupancyTracker[cage.Id] >= cage.Capacity)
                    {
                        cage.IsAvailable = false;
                    }

                    // Cập nhật chuồng trong cơ sở dữ liệu
                    _context.Cage.Update(cage);  // Đảm bảo chuồng được cập nhật trong cơ sở dữ liệu
                    _logger.LogInformation($"Assigned animal {animal.Id} to cage {cage.Id}. Current occupancy: {cageOccupancyTracker[cage.Id]}.");
                }
                else
                {
                    _logger.LogWarning($"No available cage for animal {animal.Id}."); // Không tìm được chuồng cho vật nuôi
                }
            }
            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();
            return Ok(new
            {
                message = "Phân chuồng thành công.",
                unassignedCount = unassignedAnimals.Count
            });
        }
        public class AnimalDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Type { get; set; }
            public string Status { get; set; }
            public decimal? Weight { get; set; }
            public string Breed { get; set; }
            public string Gender { get; set; }
            public DateTime BirthDate { get; set; }
            public CageDto Cage { get; set; }
        }

        public class CageDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Purpose { get; set; }
            public decimal Area { get; set; }
            public bool IsAvailable { get; set; }
            public string Location { get; set; }
            public int Capacity { get; set; }
            public int CurrentOccupancy { get; set; }
        }

    }
}
