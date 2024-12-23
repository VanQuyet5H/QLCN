using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
                        m.Id,
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

            // Kiểm tra xem thuốc đã tồn tại chưa
            var existingMedication = _context.Medication
                .FirstOrDefault(m => m.Name.ToLower() == request.Name.ToLower());

            if (existingMedication != null)
            {
                // Kiểm tra xem thông tin tồn kho có tồn tại không
                var existingInventory = _context.Inventory
                    .FirstOrDefault(i => i.MedicationId == existingMedication.Id);

                if (existingInventory != null)
                {
                    // Cập nhật số lượng tồn kho nếu tồn tại
                    existingInventory.Quantity += request.Quantity;

                    // Cập nhật trạng thái tồn kho
                    existingInventory.Status = existingInventory.Quantity < existingInventory.MinimumQuantity
                        ? "Cảnh báo"
                        : "Đủ kho";

                    _context.SaveChanges();
                    return Ok(new { message = "Cập nhật số lượng thuốc thành công!" });
                }
                else
                {
                    // Nếu tồn kho không tồn tại, tạo mới thông tin tồn kho
                    var newInventory = new Inventory
                    {
                        MedicationId = existingMedication.Id,
                        Quantity = request.Quantity,
                        MinimumQuantity = request.MinimumQuantity,
                        Status = request.Quantity < request.MinimumQuantity ? "Cảnh báo" : "Đủ kho"
                    };

                    _context.Inventory.Add(newInventory);
                    _context.SaveChanges();
                    return Ok(new { message = "Thêm thông tin tồn kho thành công!" });
                }
            }

            // Nếu thuốc chưa tồn tại, tạo mới thuốc và thông tin tồn kho
            var medication = new Medication
            {
                Name = request.Name,
                Description = request.Description,
                Unit = request.Unit,
                Cost = request.Cost,
                CreatedAt = DateTime.UtcNow
            };

            _context.Medication.Add(medication);
            _context.SaveChanges();

            var inventory = new Inventory
            {
                MedicationId = medication.Id,
                Quantity = request.Quantity,
                MinimumQuantity = request.MinimumQuantity,
                Status = request.Quantity < request.MinimumQuantity ? "Cảnh báo" : "Đủ kho"
            };

            _context.Inventory.Add(inventory);
            _context.SaveChanges();

            return Ok(new { message = "Thêm thuốc mới thành công!" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedication(int id)
        {
            // Kiểm tra thuốc trong kho có tồn tại không
            var inventoryItem = await _context.Inventory.FirstOrDefaultAsync(i => i.MedicationId == id);
            if (inventoryItem == null)
            {
                return NotFound(new { message = "Không có thông tin thuốc trong kho." });
            }

            try
            {
                // Xóa bản ghi khỏi bảng Inventory
                _context.Inventory.Remove(inventoryItem);

                // Lưu thay đổi vào database
                await _context.SaveChangesAsync();

                return Ok(new { message = "Thông tin thuốc trong kho đã được xóa thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Có lỗi xảy ra khi xóa thông tin thuốc trong kho.", error = ex.Message });
            }
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
