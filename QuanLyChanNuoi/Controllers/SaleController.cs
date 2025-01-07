using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using QuanLyChanNuoi.Models;
using System;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static QuanLyChanNuoi.Controllers.SaleController;

namespace QuanLyChanNuoi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SaleController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost]
        public async Task<IActionResult> AddSale([FromBody] SaleDTO saleDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var errorMessages = new List<string>();

                foreach (var animalSale in saleDto.Animals)
                {
                    // Kiểm tra tổng số lượng vật nuôi theo tên
                    var totalQuantity = await _context.Animal
                        .Where(a => a.Name == animalSale.AnimalName)
                        .CountAsync();

                    // Kiểm tra nếu số lượng cần bán vượt quá số lượng tồn kho
                    if (animalSale.Quantity > totalQuantity)
                    {
                        errorMessages.Add($"Số lượng vật nuôi không đủ với tên {animalSale.AnimalName}. Số lượng hiện tại: {totalQuantity}.");
                    }
                    else
                    {
                        // Lấy chuồng chứa vật nuôi
                        var cage = await (from animal in _context.Animal
                                          join c in _context.Cage on animal.CageId equals c.Id
                                          where animal.Name == animalSale.AnimalName
                                          select c).FirstOrDefaultAsync();

                        if (cage == null)
                        {
                            errorMessages.Add($"Không tìm thấy chuồng cho vật nuôi với tên {animalSale.AnimalName}.");
                            continue;
                        }

                        // Cập nhật số lượng vật nuôi trong chuồng
                        cage.CurrentOccupancy -= animalSale.Quantity;
                        if (cage.CurrentOccupancy < 0) cage.CurrentOccupancy = 0;
                        _context.Cage.Update(cage);
                        await _context.SaveChangesAsync();

                        // Xóa số lượng vật nuôi yêu cầu từ bảng Animal
                        var deleteQuery = @"
                            DELETE FROM Animal
                            WHERE Id IN (
                                SELECT TOP (@Quantity) Id
                                FROM Animal
                                WHERE Name = @AnimalName
                            )";
                        await _context.Database.ExecuteSqlRawAsync(deleteQuery,
                            new SqlParameter("@Quantity", animalSale.Quantity),
                            new SqlParameter("@AnimalName", animalSale.AnimalName));
                        var nextBuyerId = _context.Sale.Any()
                                        ? _context.Sale.Max(s => s.BuyerId) + 1
                                        : 1; // Nếu bảng rỗng, bắt đầu từ 1

                        // Thêm giao dịch vào bảng Sale
                        var sale = new Sale
                        {
                            AnimalName = animalSale.AnimalName,
                            UserId = saleDto.UserId,
                            BuyerId = nextBuyerId,
                            BuyerName = saleDto.BuyerName,
                            Price = animalSale.Price,
                            Quantity = animalSale.Quantity,
                            SaleDate = saleDto.SaleDate
                        };

                        _context.Sale.Add(sale);
                    }
                }

                // Nếu có lỗi, trả về danh sách các lỗi
                if (errorMessages.Any())
                {
                    return BadRequest(new { Message = string.Join(", ", errorMessages) });
                }

                // Lưu tất cả các giao dịch
                await _context.SaveChangesAsync();

                // Commit giao dịch
                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetSaleById), new { id = saleDto.UserId }, saleDto);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        //hien thi du lieu
        [HttpGet]
        public async Task<IActionResult> GetAllSales(
    [FromQuery] DateTime? startDate,
    [FromQuery] DateTime? endDate,
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 10)
        {
            // Kiểm tra tham số phân trang hợp lệ
            if (pageNumber <= 0 || pageSize <= 0)
            {
                return BadRequest("Số trang và kích thước trang phải lớn hơn 0.");
            }

            // Kiểm tra ngày bắt đầu và ngày kết thúc hợp lệ
            if (startDate.HasValue && endDate.HasValue && startDate > endDate)
            {
                return BadRequest("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.");
            }

            try
            {
                var query = _context.Sale
                    .Include(s => s.Animal) // Bao gồm thông tin Animal
                    .AsQueryable(); // Đảm bảo có thể tiếp tục truy vấn LINQ

                // Lọc theo ngày bắt đầu nếu có
                if (startDate.HasValue)
                {
                    query = query.Where(s => s.SaleDate >= startDate.Value);
                }

                // Lọc theo ngày kết thúc nếu có
                if (endDate.HasValue)
                {
                    query = query.Where(s => s.SaleDate <= endDate.Value);
                }

                // Lấy toàn bộ dữ liệu
                var salesData = await query.ToListAsync();

                // Nhóm theo ngày giao dịch
                var groupedSales = salesData
                    .GroupBy(s => s.SaleDate.Date) // Nhóm theo ngày giao dịch
                    .Select(g => new
                    {
                        SaleDate = g.Key, // Ngày giao dịch
                        SalesByBuyer = g.GroupBy(s => new { s.BuyerId, s.BuyerName }) // Nhóm theo BuyerId và BuyerName
                            .Select(buyerGroup => new
                            {
                                BuyerId = buyerGroup.Key.BuyerId, // Mã người mua
                                BuyerName = buyerGroup.Key.BuyerName, // Tên người mua
                                TotalQuantity = buyerGroup.Sum(s => s.Quantity), // Tổng số lượng bán
                                TotalRevenue = buyerGroup.Sum(s => s.Price * s.Quantity), // Tổng doanh thu
                                Sales = buyerGroup.OrderBy(s => s.SaleDate) // Sắp xếp theo ngày bán
                                    .Skip((pageNumber - 1) * pageSize) // Bỏ qua số lượng bản ghi đã tải
                                    .Take(pageSize) // Lấy số lượng bản ghi theo kích thước trang
                                    .Select(s => new SaleDto1 // Ánh xạ sang DTO
                                    {
                                        Id = s.Id,
                                        BuyerId = s.BuyerId, // Thêm BuyerId vào DTO
                                        AnimalName = s.AnimalName,
                                        SaleDate = s.SaleDate,
                                        Price = s.Price,
                                        Quantity = s.Quantity
                                    })
                                    .ToList()
                            })
                            .ToList()
                    })
                    .ToList();

                // Tính tổng số bản ghi trong tất cả các nhóm để phân trang chính xác
                var totalGroupedRecords = groupedSales
                    .SelectMany(g => g.SalesByBuyer) // Lấy tất cả các nhóm người mua trong tất cả các ngày
                    .SelectMany(gb => gb.Sales) // Lấy tất cả các giao dịch trong các nhóm người mua
                    .Count(); // Đếm tổng số bản ghi

                // Tạo kết quả trả về
                var result = new
                {
                    TotalRecords = totalGroupedRecords,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    SalesByBuyer = groupedSales
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log lỗi nếu cần (có thể ghi vào file hoặc console)
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "Đã xảy ra lỗi trong khi xử lý yêu cầu.");
            }
        }
        [HttpGet("layidvaten")]
        public async Task<ActionResult<IEnumerable<Animal>>> GetAnimals()
        {
            var animals = await _context.Animal
                .Select(a => new { a.Id, a.Name }) // Lấy chỉ Id và Name
                .ToListAsync();

            return Ok(animals);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSaleById(int id)
        {
            var sale = await _context.Sale.FindAsync(id);
            if (sale == null) return NotFound();
            return Ok(sale);
        }

        // Xem chi tiết giao dịch bán
        [HttpGet("group-by-buyer/{buyerId}")]
        public async Task<IActionResult> GetSalesGroupedByBuyer(int buyerId)
        {
            try
            {
                // Tìm các giao dịch dựa trên buyerId và nhóm theo BuyerId
                var salesGroupedByBuyer = await _context.Sale
                    .Where(s => s.BuyerId == buyerId) // Lọc theo buyerId
                    .Include(s => s.Animal)           // Bao gồm thông tin vật nuôi
                    .GroupBy(s => new { s.BuyerId, s.BuyerName }) // Nhóm theo BuyerId và BuyerName
                    .Select(group => new
                    {
                        BuyerId = group.Key.BuyerId,         // Id của người mua
                        BuyerName = group.Key.BuyerName,     // Tên người mua
                        TotalQuantity = group.Sum(s => s.Quantity), // Tổng số lượng giao dịch
                        TotalRevenue = group.Sum(s => s.Price * s.Quantity), // Tổng doanh thu
                        Sales = group.Select(sale => new
                        {
                            SaleId = sale.Id,
                            AnimalName = sale.AnimalName, // Tên vật nuôi
                            SaleDate = sale.SaleDate,
                            Price = sale.Price,
                            Quantity = sale.Quantity
                        }).ToList() // Danh sách giao dịch chi tiết
                    })
                    .ToListAsync();

                // Nếu không tìm thấy giao dịch nào
                if (salesGroupedByBuyer == null || !salesGroupedByBuyer.Any())
                    return NotFound(new { Message = "Không tìm thấy giao dịch nào cho buyerId đã cho." });

                // Trả về kết quả nhóm theo người mua
                return Ok(salesGroupedByBuyer);
            }
            catch (Exception ex)
            {
                // Ghi log lỗi (nếu cần)
                Console.WriteLine($"Error in GetSalesGroupedByBuyer: {ex.Message}");

                // Trả về mã lỗi 500 với thông báo lỗi
                return StatusCode(500, new { Message = "Đã xảy ra lỗi khi xử lý yêu cầu.", Details = ex.Message });
            }
        }



        // Cập nhật thông tin giao dịch bán
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSale(int id, [FromBody] Sale sale)
        {
            if (id != sale.Id) return BadRequest();

            _context.Entry(sale).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Xóa giao dịch bán
        [HttpDelete("buyer/{buyerId}")]
        public async Task<IActionResult> DeleteSale(int buyerId)
        {
            try
            {
                // Tìm tất cả các bản ghi có buyerId
                var sales = await _context.Sale.Where(s => s.BuyerId == buyerId).ToListAsync();

                // Kiểm tra nếu không tìm thấy bản ghi nào với buyerId
                if (sales == null || !sales.Any())
                {
                    return NotFound(new { Message = "Không tìm thấy bản ghi với buyerId được cung cấp." });
                }

                // Thực hiện xóa tất cả các bản ghi tìm thấy
                _context.Sale.RemoveRange(sales);
                await _context.SaveChangesAsync();

                // Trả về phản hồi thành công
                return Ok(new { Message = "Xóa thành công tất cả giao dịch của buyerId." });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi
                return StatusCode(500, new { Message = "Đã xảy ra lỗi khi xóa bản ghi.", Details = ex.Message });
            }
        }



        // Báo cáo doanh thu
        [HttpGet("revenue")]
        public async Task<IActionResult> GetRevenueReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var sales = await _context.Sale
                .Where(s => s.SaleDate >= startDate && s.SaleDate <= endDate)
                .ToListAsync();

            var totalRevenue = sales.Sum(s => s.Price * s.Quantity);
            var totalQuantity = sales.Sum(s => s.Quantity);

            return Ok(new { TotalRevenue = totalRevenue, TotalQuantity = totalQuantity });
        }
        [HttpGet("sales-report")]
        public IActionResult GetSalesReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var query = _context.Sale.AsQueryable();

                if (startDate.HasValue)
                    query = query.Where(s => s.SaleDate >= startDate.Value);

                if (endDate.HasValue)
                    query = query.Where(s => s.SaleDate <= endDate.Value);

                // Thống kê tổng doanh thu theo năm và tháng (dùng để hiển thị chi tiết)
                var totalReport = query
                    .GroupBy(s => new { s.SaleDate.Year, s.SaleDate.Month })
                    .Select(g => new
                    {
                        Year = g.Key.Year,
                        Month = g.Key.Month,
                        TotalSales = g.Sum(x => x.Price * x.Quantity),
                        TotalTransactions = g.Count()
                    })
                    .OrderBy(r => r.Year)
                    .ThenBy(r => r.Month)
                    .ToList();

                // Thống kê doanh thu theo từng vật nuôi (dùng để vẽ biểu đồ)
                var animalReport = query
                    .GroupBy(s => s.AnimalName) // Nhóm theo tên vật nuôi
                    .Select(g => new
                    {
                        AnimalName = g.Key,
                        TotalSales = g.Sum(x => x.Price * x.Quantity)
                    })
                    .OrderByDescending(r => r.TotalSales) // Sắp xếp theo doanh thu giảm dần
                    .ToList();

                return Ok(new { TotalReport = totalReport, AnimalReport = animalReport });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }


        public class SaleDto1
        {
            public int Id { get; set; }
            public int? AnimalId { get; set; }
            public int BuyerId { get; set; }
            public string BuyerName { get; set; }
            public DateTime SaleDate { get; set; }
            public decimal Price { get; set; }
            public decimal Quantity { get; set; }
            public string AnimalName { get; set; }
            public string AnimalBreed { get; set; }
        }


        public class SaleDTO
        {
            public int UserId { get; set; }
            public string BuyerName { get; set; }
            public DateTime SaleDate { get; set; }
            public List<AnimalSaleDTO> Animals { get; set; }
        }

        public class AnimalSaleDTO
        {
            public string AnimalName { get; set; }
            public int Quantity { get; set; }
            public decimal Price { get; set; }
        }


    }
}
