using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChanNuoi.Models;
using System.Net.WebSockets;

namespace QuanLyChanNuoi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QualityControlController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QualityControlController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("cages")]
        public async Task<IActionResult> GetCages()
        {
            var cages = await _context.Cage
                .Select(c => new { c.Id, c.Name })
                .ToListAsync();

            return Ok(cages);
        }
        [HttpGet("cages/{cageId}/animals")]
        public async Task<IActionResult> GetAnimalsByCage(int cageId)
        {
            var cage = await _context.Cage
                .Include(c => c.Animal)
                .FirstOrDefaultAsync(c => c.Id == cageId);

            if (cage == null)
                return NotFound(new { message = "Chuồng không tồn tại" });

            var animals = cage.Animal
                .Select(a => new
                {
                    a.Id,
                    a.Name,
                    a.Weight,
                    a.Status
                })
                .ToList();

            return Ok(animals);
        }
        // 3. Theo dõi toàn bộ vật nuôi trong chuồng
        [HttpPost("cages/{cageId}/track")]
        public async Task<IActionResult> TrackCage(int cageId, [FromBody] TrackCageRequest request)
        {
            var cage = await _context.Cage
                .Include(c => c.Animal)
                .FirstOrDefaultAsync(c => c.Id == cageId);

            if (cage == null)
                return NotFound(new { message = "Chuồng không tồn tại" });

            var qualityControlRecords = new List<QualityControlDTO>();

            foreach (var animalDetail in request.AnimalDetails)
            {
                var animal = cage.Animal.FirstOrDefault(a => a.Id == animalDetail.AnimalId);
                if (animal != null)
                {
                    // Create a quality control record using the data from the request
                    var record = CreateQualityControlRecord(animal, request.UserId, animalDetail);
                    var qualityControlDTO = new QualityControlDTO
                    {
                        AnimalId = record.AnimalId,
                        UserId = record.UserId,
                        InspectionDate = record.InspectionDate,
                        Weight = record.Weight,
                        Height = record.Height,
                        Condition = record.Condition,
                        HealthStatus = record.HealthStatus,
                        QualityGrade = record.QualityGrade,
                        Remarks = record.Remarks,
                        Passed = record.Passed
                    };

                    qualityControlRecords.Add(qualityControlDTO);

                    // Save the record in the database (the actual QualityControl model)
                    _context.QualityControl.Add(record);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Theo dõi toàn bộ vật nuôi thành công",
                data = qualityControlRecords
            });
        }

        // Create the QualityControl record using the animal data and employee-provided details
        private QualityControl CreateQualityControlRecord(Animal animal, int userId, AnimalTrackDetail animalDetail)
        {
            return new QualityControl
            {
                AnimalId = animal.Id,
                UserId = userId,
                InspectionDate = DateTime.UtcNow,
                Weight = animalDetail.Weight ?? animal.Weight ?? 0,  // Use input from employee or fallback to default
                Height = animalDetail.Height,  // Employee-provided height
                Condition = animalDetail.Condition ?? "Condition Example",  // Use employee-provided condition or default
                HealthStatus = animalDetail.HealthStatus ?? animal.Status,  // Use employee-provided health status or default
                QualityGrade = (animalDetail.Weight ?? animal.Weight ?? 0) >= 50 ? "Grade A" : "Grade B",  // Calculate quality grade based on weight
                Remarks = animalDetail.Remarks ?? "Theo dõi tự động",  // Use employee-provided remarks or default
                Passed = (animalDetail.Weight ?? animal.Weight ?? 0) >= 50  // Check if the animal passes based on weight
            };
        }
        [HttpGet("tang-truong")]
        public async Task<IActionResult> LayTangTruong([FromQuery] int? ngay = 30)
        {
            try
            {
                // Đảm bảo giá trị ngày hợp lệ
                if (!ngay.HasValue || ngay.Value <= 0)
                {
                    ngay = 30;
                }

                // Bước 1: Lấy dữ liệu thô
                var duLieuGoc = await _context.QualityControl
                                .Include(qc => qc.Animal)
                                .Where(qc => qc.InspectionDate >= DateTime.Now.AddDays(-ngay.Value))
                                .GroupBy(qc => new { qc.AnimalId, qc.Animal.Type, qc.Animal.Breed })
                                .Select(g => new
                                {
                                    LoaiVatNuoi = g.Key.Type,
                                    Giong = g.Key.Breed,
                                    MaVatNuoi = g.Key.AnimalId,
                                    CanNangBanDau = g.OrderBy(qc => qc.InspectionDate).FirstOrDefault().Weight,
                                    CanNangHienTai = g.OrderByDescending(qc => qc.InspectionDate).FirstOrDefault().Weight,
                                    SoNgay = (g.Max(qc => qc.InspectionDate) - g.Min(qc => qc.InspectionDate)).Days,
                                    SoLanKiemTra = g.Count()
                                })
                                .OrderBy(d => d.LoaiVatNuoi)
                                .ThenBy(d => d.Giong)
                                .ToListAsync();
                // Nếu không có dữ liệu
                if (!duLieuGoc.Any())
                {
                    return Ok(new
                    {
                        ThongBao = "Không có dữ liệu phù hợp với điều kiện tìm kiếm."
                    });
                }

                // Bước 2: Tính toán các giá trị cần thiết
                var phanTich = duLieuGoc.GroupBy(a => new { a.LoaiVatNuoi, a.Giong })
                    .Select(nhomLoai => new PhanTichTangTruongDTO
                    {
                        LoaiVatNuoi = nhomLoai.Key.LoaiVatNuoi,
                        Giong = nhomLoai.Key.Giong,
                        TiLeTangTruongTB = nhomLoai.Average(a =>
                            a.SoNgay > 0 ? ((a.CanNangHienTai - a.CanNangBanDau) / a.CanNangBanDau * 100) / a.SoNgay : 0),
                        TongSoVatNuoi = nhomLoai.Count(),
                        ChiTiet = nhomLoai.Select(a => new TiLeTangTruongDTO
                        {
                            MaVatNuoi = a.MaVatNuoi,
                            TiLeTangTruong = a.SoNgay > 0 ? ((a.CanNangHienTai - a.CanNangBanDau) / a.CanNangBanDau * 100) / a.SoNgay : 0,
                            CanNangBanDau = a.CanNangBanDau,
                            CanNangHienTai = a.CanNangHienTai,
                            SoNgay = a.SoNgay,
                            SoLanKiemTra = a.SoLanKiemTra
                        }).OrderByDescending(d => d.TiLeTangTruong)
                    })
                    .OrderByDescending(pt => pt.TiLeTangTruongTB)
                    .ToList();

                // Bước 3: Chuẩn bị phản hồi
                var ketQua = new
                {
                    VatNuoiTangTruongTot = phanTich.Where(pt => pt.TiLeTangTruongTB > 0)
                        .Take(3)
                        .Select(pt => new
                        {
                            pt.LoaiVatNuoi,
                            pt.Giong,
                            TiLeTangTruong = Math.Round(pt.TiLeTangTruongTB, 2),
                            pt.TongSoVatNuoi,
                            TrangThai = "Tăng trưởng tốt"
                        }),
                    VatNuoiTangTruongKem = phanTich.Where(pt => pt.TiLeTangTruongTB <= 0)
                        .Take(3)
                        .Select(pt => new
                        {
                            pt.LoaiVatNuoi,
                            pt.Giong,
                            TiLeTangTruong = Math.Round(pt.TiLeTangTruongTB, 2),
                            pt.TongSoVatNuoi,
                            TrangThai = "Tăng trưởng kém"
                        }),
                    PhanTichChiTiet = phanTich.Select(pt => new
                    {
                        pt.LoaiVatNuoi,
                        pt.Giong,
                        TiLeTangTruongTB = Math.Round(pt.TiLeTangTruongTB, 2),
                        pt.TongSoVatNuoi,
                        TrangThai = pt.TiLeTangTruongTB > 0 ? "Tăng trưởng tốt" : "Tăng trưởng kém",
                        VatNuoiTotNhat = pt.ChiTiet.OrderByDescending(d => d.TiLeTangTruong).Take(3).Select(d => new
                        {
                            d.MaVatNuoi,
                            d.TiLeTangTruong,
                            d.CanNangBanDau,
                            d.CanNangHienTai,
                            d.SoNgay,
                            d.SoLanKiemTra
                        }),
                        VatNuoiKemNhat = pt.ChiTiet.OrderBy(d => d.TiLeTangTruong).TakeLast(3).Select(d => new
                        {
                            d.MaVatNuoi,
                            d.TiLeTangTruong,
                            d.CanNangBanDau,
                            d.CanNangHienTai,
                            d.SoNgay,
                            d.SoLanKiemTra
                        })
                    })
                };

                return Ok(ketQua);
            }
            catch (Exception ex)
            {
                // Log lỗi và trả về thông báo lỗi
                Console.WriteLine($"Lỗi: {ex.Message}");
                return StatusCode(500, new
                {
                    ThongBao = "Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau."
                });
            }
        }


        // DTO for tracking animals in a cage
        public class TrackCageRequest
        {
            public int UserId { get; set; }
            public List<AnimalTrackDetail> AnimalDetails { get; set; }
        }

        // DTO for animal details input
        public class AnimalTrackDetail
        {
            public int AnimalId { get; set; }
            public decimal? Weight { get; set; }
            public int Height { get; set; }
            public string Condition { get; set; }
            public string Remarks { get; set; }
            public string HealthStatus { get; set; }
        }

        public class QualityControlDTO
        {
            public int AnimalId { get; set; }
            public int UserId { get; set; }
            public DateTime InspectionDate { get; set; }
            public decimal Weight { get; set; }
            public decimal Height { get; set; }
            public string Condition { get; set; }
            public string HealthStatus { get; set; }
            public string QualityGrade { get; set; }
            public string Remarks { get; set; }
            public bool Passed { get; set; }
        }

        public class CreateQualityControlRequest
        {
            public int? AnimalId { get; set; }
            public int? CageId { get; set; }
            public DateTime InspectionDate { get; set; }
            public decimal Weight { get; set; }
            public decimal Height { get; set; }
            public string HealthStatus { get; set; }
            public string Remarks { get; set; }
        }

        public class QualityControlResponse
        {
            public int Id { get; set; }
            public int AnimalId { get; set; }
            public DateTime InspectionDate { get; set; }
            public decimal Weight { get; set; }
            public decimal Height { get; set; }
            public decimal? WaistCircumference { get; set; }
            public string HealthStatus { get; set; }
            public string Remarks { get; set; }
            public bool Passed { get; set; }
        }
        public class TrackRequest
        {
            public string Mode { get; set; } // "individual" hoặc "cage"
            public List<int> Ids { get; set; } // Danh sách ID vật nuôi hoặc chuồng
        }
        //Dto bao cao
        public class TiLeTangTruongDTO
        {
            public string LoaiVatNuoi { get; set; } // Loại vật nuôi
            public string Giong { get; set; } // Giống
            public int MaVatNuoi { get; set; } // Mã vật nuôi
            public decimal TiLeTangTruong { get; set; } // Tỷ lệ tăng trưởng
            public decimal CanNangBanDau { get; set; } // Cân nặng ban đầu
            public decimal CanNangHienTai { get; set; } // Cân nặng hiện tại
            public int SoNgay { get; set; } // Số ngày đã trôi qua
            public int SoLanKiemTra { get; set; } // Số lần kiểm tra
        }

        public class PhanTichTangTruongDTO
        {
            public string LoaiVatNuoi { get; set; } // Loại vật nuôi
            public string Giong { get; set; } // Giống
            public decimal TiLeTangTruongTB { get; set; } // Tỷ lệ tăng trưởng trung bình
            public int TongSoVatNuoi { get; set; } // Tổng số vật nuôi
            public IEnumerable<TiLeTangTruongDTO> ChiTiet { get; set; } // Danh sách chi tiết
        }

        public class PhanHoiTangTruongDTO
        {
            public IEnumerable<PhanTichTangTruongDTO> VatNuoiTangTruongTot { get; set; } // Các vật nuôi tăng trưởng tốt
            public IEnumerable<PhanTichTangTruongDTO> VatNuoiTangTruongKem { get; set; } // Các vật nuôi tăng trưởng kém
            public IEnumerable<PhanTichTangTruongDTO> PhanTichChiTiet { get; set; } // Phân tích chi tiết
        }




    }
}
