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
            // Truy vấn dữ liệu QualityControl
            var growthData = await _context.QualityControl
                .Include(q => q.Animal) // Include để lấy thông tin liên quan đến động vật
                .GroupBy(q => q.Animal.Type) // Group theo loại động vật
                .Select(group => new
                {
                    AnimalType = group.Key,
                    BestGrowthAnimals = group
                        .OrderByDescending(q => q.Weight)
                        .Take(3)
                        .Select(q => new
                        {
                            AnimalId = q.AnimalId,
                            AnimalName = q.Animal.Name,
                            Growth = q.Weight,
                            HealthStatus = q.HealthStatus
                        }),
                    WorstGrowthAnimals = group
                        .OrderBy(q => q.Weight)
                        .Take(3)
                        .Select(q => new
                        {
                            AnimalId = q.AnimalId,
                            AnimalName = q.Animal.Name,
                            Growth = q.Weight,
                            HealthStatus = q.HealthStatus
                        })
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                message = "Thống kê tăng trưởng vật nuôi.",
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
