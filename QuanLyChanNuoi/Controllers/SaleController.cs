using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChanNuoi.Models;

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

            // Chuyển đổi từ SaleDTO sang Sale entity
            var sale = new Sale
            {
                AnimalId = saleDto.AnimalId,
                UserId = saleDto.UserId,
                BuyerName = saleDto.BuyerName,
                Price = saleDto.Price,
                Quantity = saleDto.Quantity,
                SaleDate = saleDto.SaleDate
            };

            // Thêm Sale vào cơ sở dữ liệu
            _context.Sale.Add(sale);
            await _context.SaveChangesAsync();

            // Trả về thông tin của Sale sau khi thêm
            return CreatedAtAction(nameof(GetSaleById), new { id = sale.Id }, sale);
        }


        // Xem danh sách giao dịch bán
        [HttpGet]
        public async Task<IActionResult> GetAllSales([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var query = _context.Sale.AsQueryable();

            // Kiểm tra ngày bắt đầu và kết thúc hợp lệ
            if (startDate.HasValue && endDate.HasValue && startDate > endDate)
            {
                return BadRequest("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
            }

            if (startDate.HasValue)
                query = query.Where(s => s.SaleDate >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(s => s.SaleDate <= endDate.Value);

            // Phân trang
            var totalRecords = await query.CountAsync();
            var sales = await query
                .Skip((pageNumber - 1) * pageSize) // Bỏ qua số lượng bản ghi đã tải
                .Take(pageSize) // Lấy số lượng bản ghi theo kích thước trang
                .ToListAsync();

            var result = new
            {
                TotalRecords = totalRecords,
                Sales = sales
            };

            return Ok(result);
        }
        [HttpGet("layidvaten")]
        public async Task<ActionResult<IEnumerable<Animal>>> GetAnimals()
        {
            var animals = await _context.Animal
                .Select(a => new { a.Id, a.Name }) // Lấy chỉ Id và Name
                .ToListAsync();

            return Ok(animals);
        }

        // Xem chi tiết giao dịch bán
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSaleById(int id)
        {
            var sale = await _context.Sale.FindAsync(id);
            if (sale == null) return NotFound();
            return Ok(sale);
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
            var sale = await _context.Sale.FindAsync(id);
            if (sale == null) return NotFound();

            _context.Sale.Remove(sale);
            await _context.SaveChangesAsync();
            return NoContent();
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

                var report = query
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

                return Ok(report);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpGet("sales-detail")]
        public IActionResult GetSalesDetail([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            if (startDate == null || endDate == null)
            {
                return BadRequest("Vui lòng cung cấp ngày bắt đầu và ngày kết thúc.");
            }

            var sales = _context.Sale
                .Where(s => s.SaleDate >= startDate && s.SaleDate <= endDate)
                .Select(s => new
                {
                    s.Id,
                    AnimalName = s.Animal.Name, // Giả định có bảng Animal liên kết
                    s.BuyerName,
                    s.Quantity,
                    s.Price,
                    TotalAmount = s.Price * s.Quantity,
                    SaleDate = s.SaleDate // Trả về kiểu DateTime
                })
                .OrderBy(s => s.SaleDate) // Sắp xếp theo kiểu DateTime
                .ToList();

            return Ok(sales);
        }


        public class SaleDTO
        {
            public int AnimalId { get; set; }
            public int UserId { get; set; } 
            public string BuyerName { get; set; }
            public decimal Price { get; set; }
            public int Quantity { get; set; }
            public DateTime SaleDate { get; set; }
        }

    }
}
