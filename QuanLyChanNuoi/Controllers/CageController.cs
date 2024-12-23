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
        [HttpGet("CheckCage")]
        public async Task<IActionResult> CheckCage(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return BadRequest("Tên chuồng không được để trống.");
            }

            var existingCage = await _context.Cage
     .FirstOrDefaultAsync(c => c.Name.ToLower() == name.ToLower());

            return Ok(new { exists = existingCage });
        }
        // 2. Thêm chuồng mới
        [HttpPost("NhapChuong")]
        public async Task<IActionResult> AddCage([FromBody] CageDto cageDto)
        {
            if (cageDto == null)
                return BadRequest("Thông tin không hợp lệ.");

            // Kiểm tra xem chuồng có bị trùng tên không
            var existingCage = await _context.Cage
     .FirstOrDefaultAsync(c => c.Name.ToLower() == cageDto.Name.ToLower());


            if (existingCage != null)
            {
                return BadRequest("Chuồng với tên này đã tồn tại.");
            }

            // Kiểm tra điều kiện môi trường
            if (string.IsNullOrEmpty(cageDto.EnvironmentalConditions))
            {
                cageDto.EnvironmentalConditions = "Không có yêu cầu đặc biệt.";
            }

            // Tạo đối tượng mới
            var cage = new Cage
            {
                Name = cageDto.Name,
                Purpose = cageDto.Purpose,
                Area = cageDto.Area,
                Location = cageDto.Location,
                Capacity = cageDto.Capacity,
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
            var newCage = await _context.Cage.Include(c => c.Animal).FirstOrDefaultAsync(c => c.Id == cageId);

            if (newCage == null)
                return NotFound("Chuồng không tồn tại.");

            var animals = await _context.Animal.Where(a => animalIds.Contains(a.Id)).ToListAsync();

            if (animals.Count != animalIds.Count)
                return BadRequest("Một số vật nuôi không tồn tại.");

            if (newCage.CurrentOccupancy + animals.Count > newCage.Capacity)
                return BadRequest("Chuồng không đủ chỗ.");

            // Tạo danh sách các chuồng cũ
            var cageIds = animals.Select(a => a.CageId).Distinct().Where(id => id != null).ToList();
            var oldCages = await _context.Cage.Where(c => cageIds.Contains(c.Id)).ToListAsync();

            // Chuyển vật nuôi và cập nhật CurrentOccupancy của chuồng cũ và chuồng mới
            foreach (var animal in animals)
            {
                if (animal.CageId != null) // Giảm CurrentOccupancy của chuồng cũ
                {
                    var oldCage = oldCages.FirstOrDefault(c => c.Id == animal.CageId);
                    if (oldCage != null)
                        oldCage.CurrentOccupancy--;
                }

                animal.CageId = cageId; // Gán CageId mới
            }

            newCage.CurrentOccupancy += animals.Count; // Tăng CurrentOccupancy của chuồng mới

            // Cập nhật thông tin
            _context.Animal.UpdateRange(animals);
            _context.Cage.UpdateRange(oldCages);
            _context.Cage.Update(newCage);

            await _context.SaveChangesAsync();
            return Ok("Đã thêm vật nuôi vào chuồng.");
        }
        [HttpGet("CheckAnimalsInCage")]
        public async Task<IActionResult> CheckAnimalsInCage(string tenChuong)
        {
            var query = from a in _context.Cage
                        join b in _context.Animal on a.Id equals b.CageId
                        select new
                        {
                            a.Name,
                            a.CurrentOccupancy
                        };

            var result = await query.Where(a => a.Name == tenChuong && a.CurrentOccupancy > 0).ToListAsync();

            if (result.Any())  // Nếu có vật nuôi trong chuồng
            {
                return Ok(new { hasAnimals = true });  // Trả về true nếu có vật nuôi
            }

            return Ok(new { hasAnimals = false });  // Trả về false nếu không có vật nuôi
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCage(int id)
        {
            var cage = await _context.Cage.FindAsync(id);

            if (cage == null)
            {
                return NotFound("Chuồng không tồn tại.");
            }

            // Kiểm tra xem chuồng có vật nuôi hay không
            var hasAnimals = await _context.Animal.AnyAsync(a => a.CageId == id);

            if (hasAnimals)
            {
                return BadRequest("Chuồng này có vật nuôi. Bạn cần chuyển chúng sang chuồng khác trước khi xóa.");
            }

            // Xóa chuồng nếu không có vật nuôi
            _context.Cage.Remove(cage);
            await _context.SaveChangesAsync();

            return NoContent(); // Trả về 204 nếu xóa thành công
        }


        // 8. Thống kê vật nuôi theo chuồng
        [HttpGet("Statistics")]
        public async Task<ActionResult> GetCageStatistics()
        {
            try
            {
                var statistics = await _context.Cage
                    .Select(c => new CageStatistics
                    {
                        CageName = c.Name,
                        Capacity = c.Capacity,
                        CurrentOccupancy = c.CurrentOccupancy,
                        AvailableSlots = c.Capacity - c.CurrentOccupancy,
                        AnimalsInCage = _context.Animal.Count(a => a.CageId == c.Id), // Đếm số vật nuôi trong chuồng
                        IsFull = c.CurrentOccupancy >= c.Capacity, // Kiểm tra chuồng đã đầy hay chưa
                        MaintenanceDate = c.MaintenanceDate, // Ngày bảo trì chuồng (nếu có)
                        RepairNotification = "" // Khởi tạo trường RepairNotification
                    })
                    .ToListAsync();

                // Thêm thông báo nếu chuồng có lịch sửa chữa (lịch sửa chữa nếu MaintenanceDate có giá trị trong tương lai)
                foreach (var stat in statistics)
                {
                    if (stat.MaintenanceDate.HasValue && stat.MaintenanceDate.Value > DateTime.Now)
                    {
                        stat.RepairNotification = $"Chuồng {stat.CageName} có lịch sửa chữa vào {stat.MaintenanceDate.Value:dd/MM/yyyy}.";
                    }
                    else
                    {
                        stat.RepairNotification = "Chuồng này không có lịch sửa chữa.";
                    }
                }

                return Ok(statistics);
            }
            catch (Exception ex)
            {
                // Xử lý lỗi và trả về thông báo lỗi
                return StatusCode(500, new { message = "Có lỗi xảy ra khi lấy thông tin thống kê.", error = ex.Message });
            }
        }


        public class CageDto
        {
            public string Name { get; set; } // Tên chuồng
            public string Purpose { get; set; } // Mục đích (Thịt, Sinh sản, Giống)
            public decimal Area { get; set; } // Diện tích chuồng (m²)
            public string Location { get; set; } // Vị trí
            public int Capacity { get; set; } // Sức chứa tối đa
            public bool IsAvailable { get; set; } // Trạng thái sẵn sàng
            public string EnvironmentalConditions { get; set; } = "Đảm bảo tiêu chuẩn vệ sinh.";
            public string Notes { get; set; } // Ghi chú
        }
        public class CageStatistics
        {
            public string CageName { get; set; }
            public int Capacity { get; set; }
            public int CurrentOccupancy { get; set; }
            public int AvailableSlots { get; set; }
            public int AnimalsInCage { get; set; }
            public bool IsFull { get; set; }
            public DateTime? MaintenanceDate { get; set; }
            public string RepairNotification { get; set; }
        }

    }
}
