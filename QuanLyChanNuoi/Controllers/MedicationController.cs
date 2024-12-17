using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuanLyChanNuoi.Models;

namespace QuanLyChanNuoi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MedicationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetMedicationStock")]
        public IActionResult GetMedicationStock()
        {
            // Lấy thông tin thuốc cùng với thông tin tồn kho từ bảng Inventory
            var medications = _context.Medication
                .Join(_context.Inventory,
                    m => m.Id,
                    i => i.MedicationId,
                    (m, i) => new
                    {
                        m.Name,  // Tên thuốc
                        m.Description,  // Mô tả thuốc
                        m.Unit,  // Đơn vị
                        m.Cost,  // Giá mỗi đơn vị
                        i.Quantity,  // Số lượng hiện có trong kho
                        i.MinimumQuantity,  // Mức tồn kho tối thiểu
                        i.Status,  // Trạng thái
                        Warning = i.Quantity < i.MinimumQuantity ?
                            $"Cảnh báo: {m.Name} dưới mức tồn kho tối thiểu! Hiện tại: {i.Quantity} (Tối thiểu: {i.MinimumQuantity})" :
                            $"Đủ kho"
                    })
                .ToList();

            return Ok(medications);
        }
        [HttpPost("AddMedication")]
        public IActionResult AddMedication([FromBody] MedicationRequest request)
        {
            if (request == null)
            {
                return BadRequest("Dữ liệu không hợp lệ.");
            }

            // Tạo mới một đối tượng Medication
            var medication = new Medication
            {
                Name = request.Name,
                Description = request.Description,
                Unit = request.Unit,
                Cost = request.Cost,
                CreatedAt = DateTime.UtcNow
            };

            // Thêm thuốc vào cơ sở dữ liệu
            _context.Medication.Add(medication);
            _context.SaveChanges();

            // Thêm thông tin tồn kho cho thuốc mới
            var inventory = new Inventory
            {
                MedicationId = medication.Id,
                Quantity = request.Quantity,
                MinimumQuantity = request.MinimumQuantity,
                Status = request.Quantity < request.MinimumQuantity ? "Cảnh báo" : "Đủ kho"
            };

            // Thêm thông tin tồn kho vào cơ sở dữ liệu
            _context.Inventory.Add(inventory);
            _context.SaveChanges();

            return Ok(new { message = "Thêm thuốc thành công!" });
        }
        public class MedicationRequest
        {
            public string Name { get; set; } = null!; // Tên thuốc
            public string? Description { get; set; } // Mô tả thuốc
            public string Unit { get; set; } = null!; // Đơn vị (viên, chai, lọ,...)
            public decimal Cost { get; set; } // Giá mỗi đơn vị
            public int Quantity { get; set; } // Số lượng nhập vào
            public int MinimumQuantity { get; set; } // Mức tồn kho tối thiểu
        }

    }

}
