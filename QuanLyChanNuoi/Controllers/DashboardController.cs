using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChanNuoi.Extensions;
using QuanLyChanNuoi.Models;
using QuanLyChanNuoi.Models.Request;
using QuanLyChanNuoi.Models.Response;

namespace QuanLyChanNuoi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : Controller
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        // API lấy số lượng vật nuôi theo loại và những thay đổi so với tháng trước
        [HttpGet("animal-count")]
        public async Task<IActionResult> GetAnimalCount()
        {
            var animalCount = await _context.Animal
                .GroupBy(a => a.Type)
                .Select(group => new
                {
                    Type = group.Key,
                    Count = group.Count()
                })
                .ToListAsync();

            return Ok(animalCount);
        }

        //API lấy tình trạng sức khỏe vật nuôi
        [HttpGet("health-status")]
        public async Task<IActionResult> GetHealthStatus()
        {
            try
            {
                // Lấy dữ liệu từ bảng Animal, nhóm theo `Status`, và đếm số lượng
                var healthStatusCounts = await _context.Animal
                    .GroupBy(a => a.Status)
                    .Select(group => new
                    {
                        Status = group.Key, // Trạng thái sức khỏe (Healthy, Sick, ...)
                        Count = group.Count() // Số lượng vật nuôi trong trạng thái đó
                    })
                    .Where(a => a.Status.Equals("Khỏe mạnh"))
                    .ToListAsync();

                return Ok(healthStatusCounts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Đã xảy ra lỗi: {ex.Message}");
            }
        }

        // API lấy tổng chi tiêu cho vật nuôi
        [HttpGet("expenditures")]
        public async Task<IActionResult> GetExpenditures()
        {
            var feedExpenditure = await _context.Feed
                .SumAsync(f => f.Cost);

            var treatmentExpenditure = await _context.Medication
                .SumAsync(t => t.Cost);

            var totalExpenditure = feedExpenditure + treatmentExpenditure;

            return Ok(new
            {
                FeedExpenditure = feedExpenditure,
                TreatmentExpenditure = treatmentExpenditure,
                TotalExpenditure = totalExpenditure
            });
        }
        //api lấy tổng số lượng vật nuôi và số lượng vật nuôi đã bán
        [HttpGet("animal-treatment-sold")]
        public async Task<IActionResult> GetAnimalTreatmentAndSoldCount()
        {
            try
            {
                // Tính tổng số lượng vật nuôi đang điều trị và đã bán
                var treatmentAndSoldCounts = await _context.Animal
                    .GroupBy(a => a.Status)
                    .Where(g => g.Key == "Sick" || g.Key == "Sold")
                    .Select(group => new
                    {
                        Status = group.Key, // Trạng thái (Sick hoặc Sold)
                        Count = group.Count() // Số lượng vật nuôi trong trạng thái đó
                    })
                    .ToListAsync();

                // Trả về dữ liệu tổng hợp
                var result = new
                {
                    TotalSick = treatmentAndSoldCounts.FirstOrDefault(x => x.Status == "Sick")?.Count ?? 0,
                    TotalSold = treatmentAndSoldCounts.FirstOrDefault(x => x.Status == "Sold")?.Count ?? 0
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Đã xảy ra lỗi: {ex.Message}");
            }
        }
        [HttpGet("vaccination-notifications")]
        public async Task<IActionResult> GetImportantVaccinationNotifications()
        {
            try
            {
                var today = DateTime.Today;

                // Lọc các lịch tiêm phòng trong 7 ngày tới
                var notifications = await _context.Vaccination
                    .Where(v => v.VaccinationDate >= today && v.VaccinationDate <= today.AddDays(7))
                    .Select(v => new
                    {
                        AnimalName = v.Animal.Name,       // Tên vật nuôi từ bảng Animal qua Navigation Property
                        VaccineName = v.VaccineName,     // Tên vắc xin
                        VaccinationDate = v.VaccinationDate, // Ngày tiêm
                    })
                    .ToListAsync();

                // Nếu không có thông báo, trả về thông điệp
                if (!notifications.Any())
                {
                    return Ok(new { Message = "Không có thông báo tiêm phòng quan trọng." });
                }

                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Đã xảy ra lỗi: {ex.Message}");
            }
        }
        [HttpPost("AnimalByMonthGrouped")]
        public async Task<IActionResult> GetAnimalReportByMonthGrouped(AnimalReportDto animalReportDto)
        {
            try
            {
                var data = await _context.Animal
                    .Join(_context.Sale, a => a.Id, s => s.AnimalId, (a, s) => new { Animal = a, Sale = s })
                    .Where(data => data.Sale.SaleDate >= animalReportDto.startDate && data.Sale.SaleDate <= animalReportDto.endDate)
                    .ToListAsync(); // Lấy dữ liệu trước, xử lý sau

                var report = data
                    .GroupBy(data => new
                    {
                        Month = data.Sale.SaleDate.ToString("yyyy-MM"),
                        Type = data.Animal.Type
                    })
                    .Select(g => new
                    {
                        Month = g.Key.Month,
                        AnimalType = g.Key.Type,
                        Total = g.Count()
                    })
                    .OrderBy(r => r.Month)
                    .ThenBy(r => r.AnimalType)
                    .ToList();

                return Ok(report);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error generating report.", error = ex.Message });
            }

        }
        [HttpPost("weekly")]
        public async Task<ActionResult<IEnumerable<WeeklyFeedConsumption>>> GetWeeklyFeedConsumption(TotalFeedReportDto totalFeedReportDto )
        {
            var feedData = await _context.Feed
                               .Where(f => f.FeedingDate.Year ==totalFeedReportDto.year)
                               .ToListAsync();

            // Tính tuần và nhóm theo tuần trong bộ nhớ C#
            var result = feedData
                .GroupBy(f => new { Week = GetWeekNumber.SoTuan(f.FeedingDate) })
                .Select(g => new WeeklyFeedConsumption
                {
                    Name = $"Tuần {g.Key.Week}",
                    TotalQuantity = g.Sum(f => f.Quantity)
                })
                .OrderBy(r => r.Name) // Sắp xếp theo tuần
                .ToList();
            return Ok(result);
        }
        public class TotalFeedReportDto
        {
            public int year { get; set; }
        }
        [HttpGet("CattleSummary")]
        public async Task<IActionResult> GetCattleSummary()
        {
            try
            {
                var startOfMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);

                // Cuối ngày hôm nay
                var endOfMonth = DateTime.Now.Date.AddDays(1).AddTicks(-1); // Bao gồm cả phần thời gian

                // Đầu tháng trước
                var startOfLastMonth = new DateTime(DateTime.Now.AddMonths(-1).Year, DateTime.Now.AddMonths(-1).Month, 1);

                // Cuối tháng trước
                var endOfLastMonth = startOfLastMonth.AddMonths(1).AddDays(-1);

                // Lấy tất cả động vật trong tháng hiện tại
                var totalCattle = await _context.Animal
                                 .Where(a => a.CreatedAt>=startOfMonth && a.CreatedAt<=endOfMonth)
                                 .ToListAsync();

                // Nhóm động vật theo Breed và đếm số lượng của từng loại
                var groupByType = totalCattle
                    .GroupBy(a => a.Breed) // Nhóm theo loại
                    .Select(g => new
                    {
                        Breed = g.Key,          // Tên loại động vật (Breed)
                        Count = g.Count()       // Số lượng động vật theo loại
                    }).ToList();

                // Lấy danh sách các loại động vật và số lượng từng loại
                var layType = string.Join(", ", groupByType.Select(g => $"{g.Breed}: {g.Count}"));

                // Lấy số lượng động vật tổng cộng trong tháng hiện tại
                var laySoCon = totalCattle.Count();

                // Lấy dữ liệu động vật tháng này
                var nowAnimal = laySoCon;

                // Tổng số động vật tháng trước
                var lastMonthTotal = await _context.Animal
                    .Where(a => a.CreatedAt>=startOfLastMonth && a.CreatedAt<=endOfLastMonth)
                    .CountAsync();

                // Tính tỷ lệ tăng trưởng (trend) so với tháng trước
                double trendPercentage = 0;
                if (lastMonthTotal != 0)  // Tránh chia cho 0
                {
                    trendPercentage = ((nowAnimal - lastMonthTotal) / (double)lastMonthTotal) * 100;
                }

                // Trả về kết quả thống kê
                var result = new
                {
                    title = totalCattle.Select(a=>a.Name),  // Tiêu đề
                    value = $"{laySoCon} con",  // Số lượng động vật trong tháng hiện tại
                    trend = trendPercentage >= 0 ? $"+{trendPercentage:0.00}%" : $"{trendPercentage:0.00}%",  // Tỷ lệ tăng trưởng
                    details = layType  // Chi tiết theo từng loại động vật
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }

        }
        [HttpGet("recent-activities")]
        public async Task<IActionResult> GetRecentActivities()
        {
            var recentActivities = new List<RecentActivity>();

            // Lấy thông tin từ bảng HealthRecord (ví dụ: tiêm vaccine)
            var healthActivities = await _context.HealthRecord.Where(h => h.CheckupDate >= DateTime.Now.AddDays(-2)) // Hoạt động trong 2 ngày qua
            .Select(h => new RecentActivity
            {
                Action = $"Tiêm vaccine cho {h.Animal.Name}",
                Time = $"{(DateTime.Now - h.CheckupDate).Hours} giờ trước",
                Type = "health",
                Priority = "high"
            })
            .ToListAsync();

            // Lấy thông tin từ bảng Sale (ví dụ: xuất bán)
            var saleActivities = await _context.Sale
                .Where(s => s.SaleDate >= DateTime.Now.AddDays(-2))
                .Select(s => new RecentActivity
                {
                    Action = $"Xuất bán {s.Quantity} con {s.Animal.Name}",
                    Time = $"{(DateTime.Now - s.SaleDate).Hours} giờ trước",
                    Type = "sell",
                    Priority = "high"
                })
                .ToListAsync();

            // Lấy thông tin từ bảng Feed (ví dụ: nhập thức ăn)
            var feedActivities = await _context.Feed
                .Where(f => f.FeedingDate >= DateTime.Now.AddDays(-1))
                .Select(f => new RecentActivity
                {
                    Action = $"Nhập {f.Quantity} tấn thức ăn",
                    Time = $"{(DateTime.Now - f.FeedingDate).Days} ngày trước",
                    Type = "food",
                    Priority = "low"
                })
                .ToListAsync();

            // Kết hợp các hoạt động và trả về
            recentActivities.AddRange(healthActivities);
                recentActivities.AddRange(saleActivities);
                recentActivities.AddRange(feedActivities);

                return Ok(recentActivities.OrderByDescending(a => a.Time)); // Sắp xếp theo thời gian
        }
        

        public class AnimalReportDto
        {
            public DateTime? startDate { get; set; }
            public DateTime? endDate { get; set; }
        }

    }
}
