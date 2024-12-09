using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChanNuoi.Models;
using QuanLyChanNuoi.Models.Request;
using System.Data;
using System.Text;
using static QuanLyChanNuoi.Models.Request.AnimalList;

namespace QuanLyChanNuoi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnimalController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AnimalController(AppDbContext context)
        {
            _context = context;
        }
        //[Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAnimals(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
        {
            // Kiểm tra đầu vào
            if (page <= 0 || pageSize <= 0)
            {
                return BadRequest("Page and PageSize must be greater than 0.");
            }

            // Query dữ liệu
            var query = _context.Animal.AsQueryable();
            // Tổng số bản ghi
            var totalRecords = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

            // Lấy dữ liệu theo trang
            var animals = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Trả về dữ liệu dạng JSON
            return Ok(new
            {
                Data = animals,
                TotalRecords = totalRecords,
                TotalPages = totalPages,
                CurrentPage = page,
                PageSize = pageSize
            });
        }

        // Xem chi tiết vật nuôi
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAnimalById(int id)
        {
            var animal = await _context.Animal.FindAsync(id);
            if (animal == null)
            {
                return NotFound(new { message = "Vật nuôi không tồn tại" });
            }
            return Ok(animal);
        }
       

        // Thêm mới vật nuôi
        [HttpPost("ThemGiong")]
        public async Task<IActionResult> CreateAnimal([FromBody] Animal animal)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }


                animal.CreatedAt = DateTime.Now;

                // Thêm vật nuôi vào cơ sở dữ liệu
                _context.Animal.Add(animal);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch(Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });

            }
        }


        // Cập nhật thông tin vật nuôi
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

            animal.Name = updatedAnimal.Name;
            animal.Type = updatedAnimal.Type;
            animal.Gender = updatedAnimal.Gender;
            animal.BirthDate = updatedAnimal.BirthDate;
            animal.Status = updatedAnimal.Status;
            animal.Weight = updatedAnimal.Weight;
            animal.Breed = updatedAnimal.Breed;
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Xóa vật nuôi
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnimal(int id)
        {
            var animal = await _context.Animal.FindAsync(id);
            if (animal == null)
            {
                return NotFound(new { message = "Vật nuôi không tồn tại" });
            }

            _context.Animal.Remove(animal);
            await _context.SaveChangesAsync();
            return Ok();
        }
        //hiển thị chi tiêt theo dõi vật nuôi
        
    }
}
