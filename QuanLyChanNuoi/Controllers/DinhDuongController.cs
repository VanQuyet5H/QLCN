using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChanNuoi.Models;

namespace QuanLyChanNuoi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DinhDuongController : ControllerBase
    {
        private readonly AppDbContext _context;
       
        public DinhDuongController(AppDbContext context)
        {
            _context = context;
            
        }
        [HttpPost("calculate")]
        public IActionResult CalculateNutrition([FromBody] List<DietRequest> dietRequests)
        {
            if (dietRequests == null || dietRequests.Count == 0)
            {
                return BadRequest("No food items provided.");
            }

            decimal totalProtein = 0;
            decimal totalFat = 0;
            decimal totalCarbs = 0;
            decimal totalVitamins = 0;
            decimal totalMinerals = 0;
            decimal totalCalories = 0;

            foreach (var food in dietRequests)
            {
                totalProtein += food.Quantity * food.Protein;
                totalFat += food.Quantity * food.Fat;
                totalCarbs += food.Quantity * food.Carbohydrates;
                totalVitamins += food.Quantity * food.Vitamins;
                totalMinerals += food.Quantity * food.Minerals;

                // Tính năng lượng dựa vào công thức: Protein (4 kcal/g), Fat (9 kcal/g), Carbs (4 kcal/g)
                totalCalories += (food.Protein * 4 + food.Fat * 9 + food.Carbohydrates * 4) * food.Quantity;
            }

            return Ok(new
            {
                TotalProtein = totalProtein,
                TotalFat = totalFat,
                TotalCarbohydrates = totalCarbs,
                TotalVitamins = totalVitamins,
                TotalMinerals = totalMinerals,
                TotalCalories = totalCalories
            });
        }
        public class DietRequest
        {
            public string FoodItem { get; set; }
            public decimal Quantity { get; set; } // Số kg hoặc gram
            public decimal Protein { get; set; } // Protein mỗi kg/g
            public decimal Fat { get; set; }
            public decimal Carbohydrates { get; set; }
            public decimal Vitamins { get; set; }
            public decimal Minerals { get; set; }
        }
        [HttpPost("create")]
        public async Task<ActionResult<Feed>> CreateFeed([FromBody] FeedDto feedDto)
        {
            if (feedDto == null)
            {
                return BadRequest("Feed data is null.");
            }

            // Chuyển FeedDto thành Feed model
            var feed = new Feed
            {
                AnimalId = feedDto.AnimalId,
                FeedingDate=DateTime.Now,
                UserId = feedDto.UserId,
                FoodType = feedDto.FoodType,
                Quantity = feedDto.Quantity,
                Cost = feedDto.Cost,
                Notes = feedDto.Notes,
                Calories = feedDto.Calories,
                Carbohydrates = feedDto.Carbohydrates,
                Fat = feedDto.Fat,
                Minerals = feedDto.Minerals,
                Protein = feedDto.Protein,
                Vitamins = feedDto.Vitamins
            };

            // Thêm chế độ ăn vào cơ sở dữ liệu
            _context.Feed.Add(feed);
            await _context.SaveChangesAsync();

            // Trả về kết quả vừa tạo
            return CreatedAtAction(nameof(GetFeedById), new { id = feed.Id }, feed);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Feed>> GetFeedById(int id)
        {
            var feed = await _context.Feed.FindAsync(id);

            if (feed == null)
            {
                return NotFound();
            }

            return Ok(feed);
        }
        [HttpGet("animals")]
        public async Task<IActionResult> GetAnimals()
        {
            try
            {
                // Truy vấn danh sách vật nuôi từ cơ sở dữ liệu
                var animals = await _context.Animal
                    .Select(a => new
                    {
                        a.Id,
                        a.Name
                    })
                    .ToListAsync();

                if (animals == null || !animals.Any())
                {
                    return NotFound("No animals found.");
                }

                // Trả về danh sách id và name của vật nuôi
                return Ok(animals);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        public class FeedDto
        {
            public int AnimalId { get; set; }
            public int UserId { get; set; }
            public string FoodType { get; set; }
            public decimal Quantity { get; set; }
            public int Cost { get; set; }
            public string Notes { get; set; }
            public decimal Calories { get; set; }
            public decimal Carbohydrates { get; set; }
            public decimal Fat { get; set; }
            public decimal Minerals { get; set; }
            public decimal Protein { get; set; }
            public decimal Vitamins { get; set; }
        }

    }
}
