using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using QuanLyChanNuoi.Models;
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
                // Kiểm tra tổng số lượng vật nuôi theo tên
                var totalQuantity = await _context.Animal
                    .Where(a => a.Name == saleDto.AnimalName)
                    .CountAsync();

                if (saleDto.Quantity > totalQuantity)
                {
                    return BadRequest(new { Message = $"Not enough animals available with the name {saleDto.AnimalName}. Current stock: {totalQuantity}." });
                }

                // Lấy chuồng chứa vật nuôi
                var cage = await (from animal in _context.Animal
                                  join c in _context.Cage on animal.CageId equals c.Id
                                  where animal.Name == saleDto.AnimalName
                                  select c).FirstOrDefaultAsync();

                if (cage == null)
                {
                    return NotFound(new { Message = $"No cage found for animals with name {saleDto.AnimalName}." });
                }

                // Cập nhật số lượng vật nuôi trong chuồng
                cage.CurrentOccupancy -= saleDto.Quantity;
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
                    new SqlParameter("@Quantity", saleDto.Quantity),
                    new SqlParameter("@AnimalName", saleDto.AnimalName));

                // Thêm giao dịch vào bảng Sale
                var sale = new Sale
                {
                    AnimalName = saleDto.AnimalName,
                    UserId = saleDto.UserId,
                    BuyerName = saleDto.BuyerName,
                    Price = saleDto.Price,
                    Quantity = saleDto.Quantity,
                    SaleDate = saleDto.SaleDate
                };

                _context.Sale.Add(sale);
                await _context.SaveChangesAsync();

                // Commit giao dịch
                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetSaleById), new { id = sale.Id }, sale);
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

                // Tính tổng số bản ghi trước khi phân trang
                var totalRecords = await query.CountAsync();

                // Phân trang và lấy dữ liệu
                var sales = await query
                    .OrderBy(s => s.SaleDate) // Sắp xếp theo ngày bán
                    .Skip((pageNumber - 1) * pageSize) // Bỏ qua số lượng bản ghi đã tải
                    .Take(pageSize) // Lấy số lượng bản ghi theo kích thước trang
                    .Select(s => new SaleDto1 // Ánh xạ sang DTO
                    {
                        Id = s.Id,
                        AnimalName=s.AnimalName,
                        BuyerName = s.BuyerName,
                        SaleDate = s.SaleDate,
                        Price = s.Price,
                        Quantity = s.Quantity
                    })
                    .ToListAsync();

                // Tạo kết quả trả về
                var result = new
                {
                    TotalRecords = totalRecords,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    Sales = sales
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

        [HttpGet("CheckAnimalQuantity/{animalId}")]
        public async Task<ActionResult<int>> KiemTraSoLuongAnimal(int animalId)
        {
            // Tính số lượng vật nuôi với animalId được chỉ định
            var animalCount = await _context.Animal
                .Where(a => a.Id == animalId) // Tìm vật nuôi theo animalId
                .CountAsync();

            // Nếu không tìm thấy vật nuôi
            if (animalCount == 0)
            {
                return NotFound(new { Message = "Không tìm thấy vật nuôi với ID này." });
            }

            // Trả về số lượng vật nuôi
            return Ok(animalCount);
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
        [HttpGet("group-by-buyer/{saleId}")]
        public async Task<IActionResult> GetSalesGroupedByBuyer(int saleId)
        {
            // Lọc giao dịch theo saleId và nhóm theo tên người mua
            var salesGroupedByBuyer = await _context.Sale
                .Where(s => s.Id == saleId)  // Lọc theo saleId
                .Include(s => s.Animal)  // Bao gồm thông tin vật nuôi
                .GroupBy(s => s.BuyerName) // Nhóm theo tên người mua
                .Select(group => new
                {
                    BuyerName = group.Key,  // Tên người mua
                    Sales = group.Select(sale => new
                    {
                        SaleId = sale.Id,
                        AnimalName = sale.AnimalName,  // Tên vật nuôi
                        SaleDate = sale.SaleDate,
                        Price = sale.Price,
                        Quantity = sale.Quantity
                    }).ToList()  // Danh sách các giao dịch của người mua này
                })
                .ToListAsync();

            // Nếu không tìm thấy giao dịch nào
            if (salesGroupedByBuyer == null || !salesGroupedByBuyer.Any())
                return NotFound("Không tìm thấy giao dịch nào.");

            return Ok(salesGroupedByBuyer);  // Trả về kết quả đã nhóm theo người mua
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
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSale(int id)
        {
            try
            {
                // Tìm bản ghi theo ID
                var sale = await _context.Sale.FindAsync(id);

                // Kiểm tra nếu sale không tồn tại
                if (sale == null)
                {
                    return NotFound(new { Message = "Không tìm thấy bản ghi với ID được cung cấp." });
                }

                // Thực hiện xóa bản ghi
                _context.Sale.Remove(sale);
                await _context.SaveChangesAsync();

                // Trả về phản hồi thành công
                return Ok(new { Message = "Xóa thành công." });
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
            public string BuyerName { get; set; }
            public DateTime SaleDate { get; set; }
            public decimal Price { get; set; }
            public decimal Quantity { get; set; }
            public string AnimalName { get; set; }
            public string AnimalBreed { get; set; }
        }


        public class SaleDTO
        {
            public int AnimalId { get; set; }
            public int UserId { get; set; } 
            public string BuyerName { get; set; }
            public string AnimalName { get; set; }
            public decimal Price { get; set; }
            public int Quantity { get; set; }
            public DateTime SaleDate { get; set; }
        }

    }
}
