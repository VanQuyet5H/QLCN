using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChanNuoi.Models;
using QuanLyChanNuoi.Models.Request;
using System.Data;

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
        [HttpPost("addanimal")]
        public async Task<IActionResult> AddNewAnimalWithToken([FromBody] AddAnimalRequest request)
        {
            if (request == null)
            {
                return BadRequest("Dữ liệu không hợp lệ.");
            }
            // 2. Thêm con vật mới vào bảng Animal
            var newAnimal = new Animal
            {
                Name = request.Name,
                Type = request.Type,
                Gender = request.Gender,
                BirthDate = request.BirthDate,
                Status = "Healthy",
                Weight = request.Weight,
                Breed = request.Breed,
                CreatedAt=DateTime.Now
            };

            _context.Animal.Add(newAnimal);
            await _context.SaveChangesAsync();

            // 3. Cập nhật kho thức ăn
            var foodInventory = await _context.FoodInventory
                .Where(f => f.FoodType == request.FoodType)
                .FirstOrDefaultAsync();

            if (foodInventory == null || foodInventory.Quantity < request.FoodQuantity)
            {
                return BadRequest("Số lượng thức ăn không đủ trong kho.");
            }

            foodInventory.Quantity -= request.FoodQuantity;
            _context.FoodInventory.Update(foodInventory);

            // 4. Thêm thông tin tiêm phòng cho con vật
            var vaccination = new Vaccination
            {
                AnimalId = newAnimal.Id,
                VaccineName = request.VaccineName,
                VaccinationDate = request.VaccinationDate
            };
            _context.Vaccination.Add(vaccination);

            // Lưu tất cả thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Con vật và dữ liệu liên quan đã được thêm thành công." });
        }
        [HttpPost]
        public async Task<IActionResult> GetAnimals([FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = _context.Animal.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(a => a.Name.Contains(search) || a.Type.Contains(search));
            }

            var totalRecords = await query.CountAsync();
            var animals = await query
                .OrderBy(a => a.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                Data = animals,
                TotalRecords = totalRecords,
                Page = page,
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
        [HttpPost]
        public async Task<IActionResult> CreateAnimal([FromBody] Animal animal)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
           

            animal.CreatedAt = DateTime.Now;
            _context.Animal.Add(animal);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAnimalById), new { id = animal.Id }, animal);
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

            await _context.SaveChangesAsync();
            return NoContent();
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
            return NoContent();
        }
    }
}
