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
        public async Task<IActionResult> AddSale([FromBody] Sale sale)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Sale.Add(sale);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSaleById), new { id = sale.Id }, sale);
        }

        // Xem danh sách giao dịch bán
        [HttpGet]
        public async Task<IActionResult> GetAllSales([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var query = _context.Sale.AsQueryable();

            if (startDate.HasValue)
                query = query.Where(s => s.SaleDate >= startDate.Value);
            if (endDate.HasValue)
                query = query.Where(s => s.SaleDate <= endDate.Value);

            var sales = await query.ToListAsync();
            return Ok(sales);
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
    }
}
