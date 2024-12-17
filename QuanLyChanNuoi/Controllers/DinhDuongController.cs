using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace QuanLyChanNuoi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DinhDuongController : ControllerBase
    {
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
    }
}
