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
        [HttpGet("growth-statistics")]
        public async Task<IActionResult> GetGrowthStatistics()
        {
            // Tính toán phạm vi ngày cho 30 ngày gần nhất
            var endDate = DateTime.UtcNow;
            var startDate = endDate.AddDays(-30);

            var growthData = await _context.QualityControl
                .Include(q => q.Animal) // Bao gồm thông tin động vật
                .Where(q => q.InspectionDate >= startDate && q.InspectionDate <= endDate) // Lọc theo ngày kiểm tra
                .GroupBy(q => new { q.AnimalId, q.Animal.Type, q.Animal.Name }) // Nhóm theo AnimalId, Type, Name
                .Select(group => new
                {
                    AnimalId = group.Key.AnimalId,
                    AnimalType = group.Key.Type,
                    AnimalName = group.Key.Name,
                    // Tính tỷ lệ tăng trưởng: (trọng lượng cuối - trọng lượng đầu) / số ngày
                    GrowthRate = (
                        group.OrderByDescending(q => q.InspectionDate).First().Weight -
                        group.OrderBy(q => q.InspectionDate).First().Weight
                    ) / (
                        (group.Max(q => q.InspectionDate) - group.Min(q => q.InspectionDate)).Days
                    ),
                    InitialWeight = group.OrderBy(q => q.InspectionDate).First().Weight,
                    CurrentWeight = group.OrderByDescending(q => q.InspectionDate).First().Weight,
                    DaysTracked = (group.Max(q => q.InspectionDate) - group.Min(q => q.InspectionDate)).Days,
                    LatestHealthStatus = group.OrderByDescending(q => q.InspectionDate).First().HealthStatus
                })
                .GroupBy(x => x.AnimalType) // Nhóm theo loại động vật
                .Select(typeGroup => new
                {
                    AnimalType = typeGroup.Key,
                    AverageGrowthRate = typeGroup.Average(x => x.GrowthRate), // Tính tỷ lệ tăng trưởng trung bình
                    BestGrowthAnimals = typeGroup
                        .OrderByDescending(x => x.GrowthRate) // Sắp xếp theo tỷ lệ tăng trưởng giảm dần
                        .Take(3) // Lấy 3 động vật có tăng trưởng tốt nhất
                        .Select(a => new
                        {
                            AnimalId = a.AnimalId,
                            AnimalName = a.AnimalName,
                            GrowthRatePerDay = Math.Round(a.GrowthRate, 2), // Làm tròn tỷ lệ tăng trưởng
                            InitialWeight = Math.Round(a.InitialWeight, 2),
                            CurrentWeight = Math.Round(a.CurrentWeight, 2),
                            TotalGrowth = Math.Round(a.CurrentWeight - a.InitialWeight, 2), // Tính tổng mức tăng trưởng
                            DaysTracked = a.DaysTracked,
                            HealthStatus = a.LatestHealthStatus
                        }),
                    WorstGrowthAnimals = typeGroup
                        .OrderBy(x => x.GrowthRate) // Sắp xếp theo tỷ lệ tăng trưởng tăng dần
                        .Take(3) // Lấy 3 động vật có tăng trưởng kém nhất
                        .Select(a => new
                        {
                            AnimalId = a.AnimalId,
                            AnimalName = a.AnimalName,
                            GrowthRatePerDay = Math.Round(a.GrowthRate, 2),
                            InitialWeight = Math.Round(a.InitialWeight, 2),
                            CurrentWeight = Math.Round(a.CurrentWeight, 2),
                            TotalGrowth = Math.Round(a.CurrentWeight - a.InitialWeight, 2),
                            DaysTracked = a.DaysTracked,
                            HealthStatus = a.LatestHealthStatus
                        })
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                message = "Thống kê tăng trưởng vật nuôi trong 30 ngày gần nhất.",
                data = growthData
            });
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

    }
}
