using DinkToPdf;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using QuanLyChanNuoi.Models;

namespace QuanLyChanNuoi.Controllers
{
    public class ReportController : Controller
    {
        private readonly AppDbContext _context;

        public ReportController(AppDbContext context)
        {
            _context = context;
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
