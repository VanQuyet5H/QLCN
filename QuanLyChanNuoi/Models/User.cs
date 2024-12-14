using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyChanNuoi.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required(ErrorMessage = "Tên người dùng là bắt buộc.")]
        [StringLength(50, ErrorMessage = "Tên người dùng không được vượt quá 50 ký tự.")]
        public string Username { get; set; }
        public string Image { get; set; }
        public string PasswordHash { get; set; }  // Lưu mật khẩu đã mã hóa
        public string? FullName { get; set; }
        [Required(ErrorMessage = "Email là bắt buộc.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        public string Email { get; set; }
        [RegularExpression(@"^(?:\+84|0)(?:[3|5|7|8|9][0-9]{8})$", ErrorMessage = "Số điện thoại không hợp lệ.")]
        public string? PhoneNumber { get; set; }
        [Required(ErrorMessage = "Vai trò người dùng là bắt buộc.")]
        [RegularExpression("Admin|User", ErrorMessage = "Vai trò chỉ có thể là 'Admin' hoặc 'User'.")]
        public string Role { get; set; }  // Vai trò (Admin, Staff, Viewer)
        public DateTime CreatedAt { get; set; }
        [Required(ErrorMessage = "Trạng thái tài khoản là bắt buộc.")]
        public bool IsActive { get; set; }  // Trạng thái tài khoản
      
        // Navigation Properties
        public string? ResetPasswordToken { get; set; }
        public DateTime? ResetPasswordTokenExpiry { get; set; }
    }
}
