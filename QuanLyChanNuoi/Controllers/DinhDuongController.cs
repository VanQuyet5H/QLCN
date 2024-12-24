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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FeedDto>>> GetFeeds(
    [FromQuery] string? foodType = null,
    [FromQuery] string? animalName = null,
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 10)
        {
            // Lọc danh sách Feed theo các tiêu chí tìm kiếm (nếu có)
            var feedsQuery = _context.Feed
                .Include(f => f.Animal)
                .Include(f => f.User)
                .AsQueryable(); // Sử dụng AsQueryable() để xây dựng truy vấn động

            // Tìm kiếm theo loại thức ăn (nếu có)
            if (!string.IsNullOrEmpty(foodType))
            {
                feedsQuery = feedsQuery.Where(f => f.FoodType.Contains(foodType));
            }

            // Tìm kiếm theo tên vật nuôi (nếu có)
            if (!string.IsNullOrEmpty(animalName))
            {
                feedsQuery = feedsQuery.Where(f => f.Animal.Name.Contains(animalName));
            }

            // Tính toán tổng số phần tử và tổng số trang
            var totalFeeds = await feedsQuery.CountAsync();
            var totalPages = (int)Math.Ceiling(totalFeeds / (double)pageSize);

            // Áp dụng phân trang (skip và take)
            var feeds = await feedsQuery
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Chuyển đổi các đối tượng Feed thành FeedDto
            var feedDtos = feeds.Select(f => new FeedDto1
            {
                Id = f.Id,
                FeedingDate = f.FeedingDate,
                FoodType = f.FoodType,
                Quantity = f.Quantity,
                Cost = f.Cost,
                Notes = f.Notes,
                Calories = f.Calories,
                Protein = f.Protein,
                Fat = f.Fat,
                Carbohydrates = f.Carbohydrates,
                Vitamins = f.Vitamins,
                Minerals = f.Minerals,
                AnimalName = f.Animal.Name,
                UserName = f.User.Username
            }).ToList();

            // Thêm thông tin phân trang vào header phản hồi
            var paginationMetaData = new
            {
                TotalItems = totalFeeds,
                TotalPages = totalPages,
                CurrentPage = pageNumber,
                PageSize = pageSize
            };
            Response.Headers.Add("X-Pagination", System.Text.Json.JsonSerializer.Serialize(paginationMetaData));

            return Ok(feedDtos);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeed(int id)
        {
            // Tìm feed trong cơ sở dữ liệu
            var feed = await _context.Feed.FindAsync(id);

            if (feed == null)
            {
                return NotFound(new { message = "Feed không tồn tại." });
            }

            // Xóa feed
            _context.Feed.Remove(feed);
            await _context.SaveChangesAsync();

            // Trả về trạng thái 200 OK khi xóa thành công
            return Ok(new { message = "Feed đã được xóa thành công." });
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
        public class FeedDto1
        {
            public int Id { get; set; }
            public DateTime FeedingDate { get; set; }
            public string FoodType { get; set; }
            public decimal Quantity { get; set; }
            public int Cost { get; set; }
            public string Notes { get; set; }

            // Dinh dưỡng
            public decimal Calories { get; set; }
            public decimal Protein { get; set; }
            public decimal Fat { get; set; }
            public decimal Carbohydrates { get; set; }
            public decimal Vitamins { get; set; }
            public decimal Minerals { get; set; }

            // Tên vật nuôi và người dùng để trả về từ DTO
            public string AnimalName { get; set; }
            public string UserName { get; set; }
        }

    }
}
