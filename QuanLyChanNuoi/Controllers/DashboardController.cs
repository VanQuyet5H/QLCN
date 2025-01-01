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
        public class DashboardSummary
        {
            public int TotalAnimals { get; set; }
            public int SickAnimals { get; set; }
            public decimal TotalFeed { get; set; }
            public decimal TotalRevenue { get; set; }
            public int VaccinationCount { get; set; }
        }

        [HttpGet("dashboard/summary")]
        public async Task<ActionResult<DashboardSummary>> GetDashboardSummary()
        {
            var totalAnimals = await _context.Animal.CountAsync();
            var sickAnimals = await _context.Animal
                                             .Where(h => h.Status == "Sick")
                                             .CountAsync();
            var totalFeed =await _context.Feed.SumAsync(f => f.Quantity);
            var totalRevenue = await _context.Sale
                                              .SumAsync(s => s.Quantity);
            var vaccinationCount = await _context.Vaccination.CountAsync();
            
            var summary = new DashboardSummary
            {
                TotalAnimals = totalAnimals,
                SickAnimals = sickAnimals,
                TotalFeed = totalFeed,
                TotalRevenue = totalRevenue,
                VaccinationCount = vaccinationCount
            };

            return Ok(summary);
        }




        [HttpPost("AnimalByMonthGrouped")]
        public async Task<IActionResult> GetAnimalReportByMonthGrouped(AnimalReportDto animalReportDto)
        {
            try
            {
                var data = await _context.Animal
                    .Where(data => data.BirthDate >= animalReportDto.startDate && data.BirthDate <= animalReportDto.endDate)
                    .ToListAsync(); // Lấy dữ liệu trước, xử lý sau

                var report = data
                    .GroupBy(data => new
                    {
                        Month = data.BirthDate.ToString("yyyy-MM"),
                        Type = data.Type
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
            var healthActivities = await _context.HealthRecord
                .Where(h => h.CheckupDate >= DateTime.Now.AddDays(-2)) // Hoạt động trong 2 ngày qua
                .Select(h => new RecentActivity
                {
                    Id = Guid.NewGuid().ToString(), // Tạo ID duy nhất
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
                    Id = Guid.NewGuid().ToString(), // Tạo ID duy nhất
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
                    Id = Guid.NewGuid().ToString(), // Tạo ID duy nhất
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
        [HttpGet]
        public async Task<IActionResult> GetGrowthInfoAsync(DateTime? startDate, DateTime? endDate, string? searchQuery = "", int pageNumber = 1, int pageSize = 10)
        {
            var query = _context.Animal.AsQueryable();

            // Lọc theo thời gian sinh
            if (startDate.HasValue)
            {
                query = query.Where(a => a.BirthDate >= startDate.Value);
            }
            if (endDate.HasValue)
            {
                query = query.Where(a => a.BirthDate <= endDate.Value);
            }

            // Lọc theo từ khóa tìm kiếm (tên vật nuôi)
            if (!string.IsNullOrEmpty(searchQuery))
            {
                query = query.Where(a => EF.Functions.Like(a.Name, $"%{searchQuery}%"));
            }

            // Lấy tổng số vật nuôi sau khi lọc
            var totalAnimals = await query.CountAsync();

            // Lấy danh sách vật nuôi với phân trang
            var animals = await query
                .Skip((pageNumber - 1) * pageSize) // Bỏ qua các phần tử trước trang hiện tại
                .Take(pageSize) // Lấy số vật nuôi của trang hiện tại
                .ToListAsync();

            var growthInfoList = new List<GrowthInfoDTO>();

            foreach (var animal in animals)
            {
                var feedRecords = await _context.Feed
                    .Where(f => f.AnimalId == animal.Id)
                    .ToListAsync();

                var totalFeedConsumed = feedRecords.Sum(f => f.Quantity);
                var totalCaloriesConsumed = feedRecords.Sum(f => f.Calories);

                var growthInfo = new GrowthInfoDTO
                {
                    TenVatNuoi = animal.Name,
                    NgaySinh = animal.BirthDate,
                    CanNangHienTai = animal.Weight ?? 0,
                    // Tính tăng cân trung bình mỗi ngày (cần logic tính toán)
                    TangCanMoiNgayTrungBinh = CalculateDailyWeightGain(animal.BirthDate, animal.Weight ?? 0),
                    TongLuongThucAnDaTieuThu = totalFeedConsumed,
                    TongCalorieDaTieuThu = totalCaloriesConsumed,
                    TrangThaiSucKhoe = animal.Status ?? "Không có dữ liệu"
                };

                growthInfoList.Add(growthInfo);
            }

            // Trả về kết quả phân trang
            var result = new
            {
                TotalCount = totalAnimals,
                Items = growthInfoList
            };

            return Ok(result);
        }


        private decimal CalculateDailyWeightGain(DateTime birthDate, decimal currentWeight)
        {
            var daysAlive = (DateTime.UtcNow - birthDate).Days;
            return daysAlive > 0 ? currentWeight / daysAlive : 0;
        }

        public class RecentActivity
        {
            public string Id { get; set; } // Thêm ID
            public string Action { get; set; }
            public string Time { get; set; }
            public string Type { get; set; }
            public string Priority { get; set; }
        }


        public class GrowthInfoDTO
        {
            public string TenVatNuoi { get; set; }
            public DateTime NgaySinh { get; set; }
            public decimal CanNangHienTai { get; set; }
            public decimal TangCanMoiNgayTrungBinh { get; set; }
            public decimal TongLuongThucAnDaTieuThu { get; set; }
            public decimal TongCalorieDaTieuThu { get; set; }
            public string TrangThaiSucKhoe { get; set; }
        }

        public class AnimalReportDto
        {
            public DateTime? startDate { get; set; }
            public DateTime? endDate { get; set; }
        }

    }
}
