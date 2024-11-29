using System.ComponentModel.DataAnnotations;

namespace QuanLyChanNuoi.Models.Request
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
