using DinkToPdf;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using QuanLyChanNuoi.Models;
using QuanLyChanNuoi.Models.Request;

namespace QuanLyChanNuoi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : Controller
    {
        private readonly AppDbContext _context;

        public ReportController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("GetStatictics")]
        public async Task<IActionResult> GetStatistics()
        {
            try
            {
                // Kế hoạch (mục tiêu) và các giá trị tham chiếu
                const int targetTimeToMarket = 30; // Kế hoạch xuất chuồng là 30 ngày
                const double targetGrowthRate = 0.1; // Mục tiêu tăng trưởng là 0.1 kg/ngày

                // Lấy tổng số vật nuôi trong tháng hiện tại và tháng trước
                int totalLivestockCurrent = await _context.Animal.CountAsync();
                int totalLivestockPrevious = await _context.Animal
                    .Where(a => a.CreatedAt.Month == DateTime.Now.AddMonths(-1).Month)
                    .CountAsync();

                // Tính sự thay đổi (trend) cho tổng đàn
                string totalLivestockTrend = CalculatePercentageChange(totalLivestockPrevious, totalLivestockCurrent);

                // Tính khối lượng trung bình tháng hiện tại và tháng trước
                double averageWeightCurrent =(double) await _context.Animal.AverageAsync(a => a.Weight);
                double averageWeightPrevious =(double) await _context.Animal
                    .Where(a => a.CreatedAt.Month == DateTime.Now.AddMonths(-1).Month)
                    .AverageAsync(a => a.Weight);

                // Tính sự thay đổi (trend) cho khối lượng trung bình
                string averageWeightTrend = CalculateWeightChange(averageWeightPrevious, averageWeightCurrent);

                // Tính chi tiết về khối lượng trung bình so với tháng trước
                string averageWeightDetails = CalculatePercentageChange(averageWeightPrevious, averageWeightCurrent);
                var currentMonth = DateTime.Now.Month;
                var previousMonth = DateTime.Now.AddMonths(-1).Month;
                // Tính tốc độ tăng trưởng từ bảng HealthRecord
                var growthDataCurrent = from a in _context.HealthRecord
                                        join b in _context.Animal on a.AnimalId equals b.Id
                                        where a.CheckupDate.Month == currentMonth && a.CheckupDate.Year == DateTime.Now.Year
                                        group b by b.Id into g
                                        select new
                                        {
                                            AnimalId = g.Key,
                                            InitialWeight = g.Min(x => x.Weight), // Trọng lượng nhỏ nhất (ban đầu)
                                            LatestWeight = g.Max(x => x.Weight), // Trọng lượng lớn nhất (cuối cùng)
                                            GrowthRate = (g.Max(x => x.Weight) - g.Min(x => x.Weight)) / g.Count() // Tốc độ tăng trưởng trung bình
                                        };
                var result = await growthDataCurrent.ToListAsync();
                var growthDataPrevious = from a in _context.Animal
                                         join b in _context.HealthRecord on a.Id equals b.AnimalId
                                         where b.CheckupDate.Month == previousMonth && b.CheckupDate.Year == DateTime.Now.Year
                                         group a by a.Id into g
                                         select new
                                         {
                                             AnimalId = g.Key,
                                             InitialWeight = g.Min(x => x.Weight), // Trọng lượng nhỏ nhất (ban đầu)
                                             LatestWeight = g.Max(x => x.Weight), // Trọng lượng lớn nhất (cuối cùng)
                                             GrowthRate = (g.Max(x => x.Weight) - g.Min(x => x.Weight)) / g.Count() // Tốc độ tăng trưởng trung bình
                                         };

                var resultPrevious = await growthDataPrevious.ToListAsync();
                double averageGrowthRateCurrent =result.Any()? (double) result.Average(g => g.GrowthRate):0;
                double averageGrowthRatePrevious =resultPrevious.Any()? (double)resultPrevious.Average(g => g.GrowthRate):0;

                // Tính sự thay đổi (trend) cho tốc độ tăng trưởng
                string growthRateTrend = CalculateGrowthRateChange(averageGrowthRatePrevious, averageGrowthRateCurrent);

                // Tính chi tiết về tốc độ tăng trưởng so với mục tiêu
                string growthRateDetails = CalculatePercentageChange(targetGrowthRate, averageGrowthRateCurrent);

                // Tính thời gian xuất chuồng trung bình từ bảng Animal
                var timeToMarketDataCurrent = await _context.Animal
                    .Where(a => a.CreatedAt.Month == DateTime.Now.Month && a.CreatedAt.Year == DateTime.Now.Year && a.Status=="Đã Bán")
                    .Select(a => new
                    {
                        AnimalId = a.Id,
                        AgeAtMarket = (DateTime.Now - a.CreatedAt).Days
                    })
                    .ToListAsync();

                var timeToMarketDataPrevious = await _context.Animal
                    .Where(a => a.CreatedAt.Month == DateTime.Now.AddMonths(-1).Month && a.CreatedAt.Year == DateTime.Now.Year && a.Status=="Đã Bán")
                    .Select(a => new
                    {
                        AnimalId = a.Id,
                        AgeAtMarket = (DateTime.Now - a.CreatedAt).Days
                    })
                    .ToListAsync();

                double averageTimeToMarketCurrent = timeToMarketDataCurrent.Average(t => t.AgeAtMarket);
                double averageTimeToMarketPrevious = timeToMarketDataPrevious.Average(t => t.AgeAtMarket);

                // Tính sự thay đổi (trend) cho thời gian xuất chuồng
                string timeToMarketTrend = CalculateTimeToMarketChange(averageTimeToMarketPrevious, averageTimeToMarketCurrent);

                // Tính chi tiết về thời gian xuất chuồng so với kế hoạch
                string timeToMarketDetails = CalculatePercentageChange(targetTimeToMarket, averageTimeToMarketCurrent);

                // Kết quả trả về
                var statistics = new
                {
                    totalLivestock = new
                    {
                        title = "Tổng đàn",
                        value = totalLivestockCurrent.ToString(),
                        trend = totalLivestockTrend,
                        icon = "FaPiggyBank",
                        details = $"Tổng: {totalLivestockCurrent}, Bò: {totalLivestockCurrent - totalLivestockPrevious}, Heo: {totalLivestockCurrent - totalLivestockPrevious}"
                    },
                    averageWeight = new
                    {
                        title = "Khối lượng TB",
                        value = $"{averageWeightCurrent:0.##} kg",
                        trend = averageWeightTrend,
                        icon = "FaWeight",
                        details = averageWeightDetails // Lấy thông tin chi tiết về khối lượng trung bình
                    },
                    growthRate = new
                    {
                        title = "Tốc độ tăng trưởng",
                        value = $"{averageGrowthRateCurrent:0.##} kg/ngày",
                        trend = growthRateTrend,
                        icon = "FaChartLine",
                        details = growthRateDetails // Lấy thông tin chi tiết về tốc độ tăng trưởng
                    },
                    timeToMarket = new
                    {
                        title = "Thời gian xuất chuồng",
                        value = $"{averageTimeToMarketCurrent} ngày",
                        trend = timeToMarketTrend,
                        icon = "FaCalendarAlt",
                        details = timeToMarketDetails // Lấy thông tin chi tiết về thời gian xuất chuồng
                    }
                };

                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // Tính sự thay đổi theo phần trăm
        private string CalculatePercentageChange(double previous, double current)
        {
            if (previous == 0) return "+0%"; // Nếu không có dữ liệu trước đó
            double change = ((current - previous) / previous) * 100;
            return $"{(change > 0 ? "+" : "")}{change:0.##}%";
        }

        // Tính sự thay đổi khối lượng
        private string CalculateWeightChange(double previous, double current)
        {
            double change = current - previous;
            return $"{(change > 0 ? "+" : "")}{change:0.##}kg";
        }

        // Tính sự thay đổi tốc độ tăng trưởng
        private string CalculateGrowthRateChange(double previous, double current)
        {
            double change = current - previous;
            return $"{(change > 0 ? "+" : "")}{change:0.##}kg/ngày";
        }

        // Tính sự thay đổi thời gian xuất chuồng
        private string CalculateTimeToMarketChange(double previous, double current)
        {
            double change = current - previous;
            return $"{(change > 0 ? "+" : "")}{change:0.##} ngày";
        }
        [HttpGet("system-report")]
        public async Task<IActionResult> GetSystemReport()
        {
            var report = new
            {
                TotalAnimals = await _context.Animal.CountAsync(),
                TotalHealthRecords = await _context.HealthRecord.CountAsync(),
                TotalVaccinations = await _context.Vaccination.CountAsync(),
                TotalFeedCost = await _context.Feed.SumAsync(f => f.Cost)
            };

            return Ok(report);
        }
        [HttpGet("detailed-report-pdf")]
        public async Task<IActionResult> GetDetailedReportPdf()
        {
            // Lấy dữ liệu chi tiết
            var animals = await _context.Animal.ToListAsync();
            var vaccinations = await _context.Vaccination.ToListAsync();
            var feedCosts = await _context.Feed.SumAsync(f => f.Cost);

            // Tạo nội dung báo cáo dưới dạng HTML
            var htmlContent = GenerateHtmlReport(animals, vaccinations, feedCosts);

            // Chuyển đổi HTML thành PDF
            var pdf = GeneratePdfFromHtml(htmlContent);

            // Trả về file PDF
            return File(pdf, "application/pdf", "System_Report.pdf");
        }

        private string GenerateHtmlReport(List<Animal> animals, List<Vaccination> vaccinations, double feedCosts)
        {
            var html = "<html><body><h1>Detailed System Report</h1>";
            html += "<h2>Animals</h2><table border='1'><tr><th>Name</th><th>Type</th><th>Weight</th></tr>";
            foreach (var animal in animals)
            {
                html += $"<tr><td>{animal.Name}</td><td>{animal.Type}</td><td>{animal.Weight}</td></tr>";
            }
            html += "</table>";

            html += "<h2>Vaccinations</h2><table border='1'><tr><th>Animal ID</th><th>Vaccine Name</th><th>Vaccination Date</th></tr>";
            foreach (var vaccination in vaccinations)
            {
                html += $"<tr><td>{vaccination.AnimalId}</td><td>{vaccination.VaccineName}</td><td>{vaccination.VaccinationDate}</td></tr>";
            }
            html += "</table>";

            html += $"<h2>Total Feed Cost: {feedCosts}</h2>";
            html += "</body></html>";

            return html;
        }

        private byte[] GeneratePdfFromHtml(string htmlContent)
        {
            var converter = new BasicConverter(new PdfTools());
            var doc = new HtmlToPdfDocument()
            {
                GlobalSettings = {
                PaperSize = PaperKind.A4,
                Orientation = Orientation.Portrait
            },
                Objects = {
                new ObjectSettings() {
                    HtmlContent = htmlContent,
                    WebSettings = { DefaultEncoding = "utf-8" }
                }
            }
            };
            return converter.Convert(doc);
        }
        [HttpGet("export-excel")]
        public async Task<IActionResult> ExportAnimalsToExcel()
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            var animals = await (from a in _context.User
                                 join b in _context.Feed on a.Id equals b.UserId
                                 join c in _context.Animal on b.AnimalId equals c.Id
                                 join d in _context.HealthRecord on a.Id equals d.UserId
                                 join e in _context.Sale on c.Id equals e.AnimalId
                                 join f in _context.QualityControl on c.Id equals f.AnimalId
                                 select new DataExcel
                                 {
                                     Id = c.Id,
                                     Name = c.Name,
                                     Loai = c.Type,
                                     Weight = c.Weight ?? 0m,
                                     NgayXuatChuong = e.SaleDate,
                                     HealthStatus = f.HealthStatus,
                                     FullName = a.FullName,
                                     Contact = a.PhoneNumber,
                                     Diagnosis = d.Diagnosis,
                                     FoodType = b.FoodType,
                                     TotalFeedQuantity = b.Quantity,
                                     HasCertificate = f.QualityGrade
                                 }).ToListAsync();

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Animal");

                // Tiêu đề
                worksheet.Cells["E1"].Value = "BÁO CÁO THÔNG TIN DANH SÁCH VẬT NUÔI ";
                worksheet.Cells["E1"].Style.Font.Size = 16;
                worksheet.Cells["E1"].Style.Font.Bold = true;
                worksheet.Cells["E1:I1"].Merge = true;

                // Header
                worksheet.Cells[3, 1].Value = "Stt";
                worksheet.Cells[3, 2].Value = "Tên";
                worksheet.Cells[3, 3].Value = "Loại";
                worksheet.Cells[3, 4].Value = "Cân Nặng";
                worksheet.Cells[3, 5].Value = "Ngày Bán";
                worksheet.Cells[3, 6].Value = "Trạng Thái Sức Khỏe";
                worksheet.Cells[3, 7].Value = "Tên Chủ Sở Hữu";
                worksheet.Cells[3, 8].Value = "Liên Hệ";
                worksheet.Cells[3, 9].Value = "Chuẩn Đoán";
                worksheet.Cells[3, 10].Value = "Loại Thức Ăn";
                worksheet.Cells[3, 11].Value = "Tổng Số Lượng Thức Ăn";
                worksheet.Cells[3, 12].Value = "Chứng Nhận";

                // Dữ liệu
                int row = 4; // Dòng bắt đầu
                int sst = 1;
                foreach (var animal in animals)
                {
                    worksheet.Cells[row, 1].Value = sst++;
                    worksheet.Cells[row, 2].Value = animal.Name;
                    worksheet.Cells[row, 3].Value = animal.Loai;
                    worksheet.Cells[row, 4].Value = animal.Weight;
                    worksheet.Cells[row, 5].Value = animal.NgayXuatChuong.ToString("yyyy-MM-dd");
                    worksheet.Cells[row, 6].Value = animal.HealthStatus;
                    worksheet.Cells[row, 7].Value = animal.FullName;
                    worksheet.Cells[row, 8].Value = animal.Contact;
                    worksheet.Cells[row, 9].Value = animal.Diagnosis;
                    worksheet.Cells[row, 10].Value = animal.FoodType;
                    worksheet.Cells[row, 11].Value = animal.TotalFeedQuantity;
                    worksheet.Cells[row, 12].Value = animal.HasCertificate;
                    row++;
                }

                // Footer
                worksheet.HeaderFooter.OddFooter.LeftAlignedText = "Báo cáo hệ thống - Trang {PAGE} / {NUMPAGES}";
                worksheet.HeaderFooter.OddFooter.CenteredText = "Báo cáo xuất chuồng vật nuôi";
                worksheet.HeaderFooter.OddFooter.RightAlignedText = "Ngày tạo: " + DateTime.Now.ToString("dd/MM/yyyy");
                worksheet.Cells[row + 1, 1].Style.Font.Italic = true;

                // Tự động điều chỉnh độ rộng
                worksheet.Cells.AutoFitColumns();

                // Tạo file Excel
                var stream = new MemoryStream();
                package.SaveAs(stream);
                stream.Position = 0;

                // Trả về file Excel
                return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "AnimalsReport.xlsx");
            }
        }

        public class DataExcel{

            public int Id { get; set; }
            public string Name { get; set; }
            public string Loai { get; set; }
            public decimal  Weight { get; set; }
            public DateTime NgayXuatChuong { get; set; }
            public string HealthStatus { get; set; }
            public string FullName { get; set; }
            public string Contact { get; set; }
            public string FoodType { get; set; }
            public string Diagnosis { get; set; }
            public decimal TotalFeedQuantity { get; set; }
            public string HasCertificate { get; set; }



        }
    }
}
