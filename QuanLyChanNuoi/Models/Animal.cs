using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.ComponentModel.DataAnnotations;

namespace QuanLyChanNuoi.Models
{
    public class Animal
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Tên động vật là bắt buộc.")]
        [StringLength(50, ErrorMessage = "Tên không được vượt quá 50 ký tự.")]
        public string Name { get; set; }
        public string Type { get; set; }  // Loại (bò, gà, lợn, v.v.)
        [Required(ErrorMessage = "Giới tính là bắt buộc.")]
        [RegularExpression("Male|Female", ErrorMessage = "Giới tính phải là 'Male' hoặc 'Female'.")]
        public string Gender { get; set; }  // Giới tính (Male/Female)
        public DateTime BirthDate { get; set; }
        [Required(ErrorMessage = "Trạng thái sức khỏe là bắt buộc.")]
        public string Status { get; set; }  // Trạng thái (Healthy, Sick, Sold, Dead)
        public decimal? Weight { get; set; }  // Cân nặng (kg)
        [Required(ErrorMessage = "Giống là bắt buộc.")]
        [StringLength(50, ErrorMessage = "Giống không được vượt quá 50 ký tự.")]
        public string Breed { get; set; }  // Giống (nếu cần)
        public DateTime CreatedAt { get; set; }

        public ICollection<Sale> Sales { get; set; }
        public int? CageId { get; set; }
        public Cage Cage { get; set; }
    }
}
