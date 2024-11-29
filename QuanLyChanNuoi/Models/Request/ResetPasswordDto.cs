using System.ComponentModel.DataAnnotations;

namespace QuanLyChanNuoi.Models.Request
{
    public class ResetPasswordDto
    {
        [Required]
        public string Token { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự.")]
        public string NewPassword { get; set; }
    }

}
