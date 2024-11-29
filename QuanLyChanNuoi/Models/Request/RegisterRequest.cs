using System.ComponentModel.DataAnnotations;

namespace QuanLyChanNuoi.Models.Request
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Tên người dùng là bắt buộc.")]
        [StringLength(50, ErrorMessage = "Tên người dùng không được vượt quá 50 ký tự.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Email là bắt buộc.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Mật khẩu là bắt buộc.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Họ tên là bắt buộc.")]
        public string FullName { get; set; }

        [Phone(ErrorMessage = "Số điện thoại không hợp lệ.")]
        public string? PhoneNumber { get; set; }

        [RegularExpression("Admin|User", ErrorMessage = "Vai trò chỉ có thể là 'Admin' hoặc 'User'.")]
        public string? Role { get; set; }
    }
}
