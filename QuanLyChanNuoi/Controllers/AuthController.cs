﻿using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChanNuoi.Extensions;
using QuanLyChanNuoi.Models;
using QuanLyChanNuoi.Models.Request;
using QuanLyChanNuoi.Services;
using System.IdentityModel.Tokens.Jwt;

namespace QuanLyChanNuoi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly AppDbContext _context;
        private readonly ISendMailService _emailService;
        private readonly IMapper _mapper;
        
        public AuthController(AuthService authService, AppDbContext context, ISendMailService emailService, IMapper mapper)
        {
            _authService = authService;
            _context = context;
            _emailService = emailService;
            _mapper = mapper;
            
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.User
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });
            }

            var token = _authService.GenerateJwtToken(user.Username, user.Role);

            return Ok(new
            {
                Token = token,
                Id=user.Id,
                Username = user.Username,
                Role = user.Role
            });
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
           
            // Kiểm tra nếu email đã tồn tại
            if (await _context.User.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email đã được sử dụng." });
            }

            // Kiểm tra nếu tên người dùng đã tồn tại
            if (await _context.User.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest(new { message = "Tên người dùng đã được sử dụng." });
            }

            // Tạo mật khẩu hash
            var passwordHash = PasswordHasher.HashPassword(request.Password);

            // Tạo người dùng mới
            var newUser = new User
            {
                Username = request.Username,
                Email = request.Email,
                FullName = request.FullName,
                PasswordHash = passwordHash,
                PhoneNumber = request.PhoneNumber,
                Role = request.Role ?? "User",// Mặc định là User nếu không chỉ định
                Image = request.Image,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.User.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đăng ký thành công.",
                userId = newUser.Id
            });
        }
        
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            var user = await _context.User.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
            {
                return BadRequest("Email không tồn tại trong hệ thống.");
            }

            // Tạo token reset mật khẩu
            var token = Guid.NewGuid().ToString();
            user.ResetPasswordToken = token;
            user.ResetPasswordTokenExpiry = DateTime.UtcNow.AddHours(1);
            await _context.SaveChangesAsync();

            // Gửi email đặt lại mật khẩu
            var resetLink = $"http://localhost:3000/Resetpass?token={token}";
            var body = $@"
            <p>Chào {user.Username},</p>
            <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào link bên dưới để tiếp tục:</p>
            <a href='{resetLink}'>Đặt lại mật khẩu</a>";
            MailContent content = new MailContent
            {
                To = user.Email,
                Subject = "Yêu cầu đặt lại mật khẩu",
                Body = body
            };

            await _emailService.SendMail(content);
            return Ok("Email đặt lại mật khẩu đã được gửi.");
        }
       
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            var user = await _context.User.SingleOrDefaultAsync(u => u.ResetPasswordToken == model.Token);

            if (user == null || user.ResetPasswordTokenExpiry < DateTime.UtcNow)
            {
                return BadRequest("Token không hợp lệ hoặc đã hết hạn.");
            }

            // Cập nhật mật khẩu mới
            user.PasswordHash = PasswordHasher.HashPassword(model.NewPassword);
            user.ResetPasswordToken = null;
            user.ResetPasswordTokenExpiry = null;
            await _context.SaveChangesAsync();

            return Ok("Đặt lại mật khẩu thành công.");
        }
        //api lấy thông tin user
        [HttpGet("Profile")]
        public async Task<IActionResult> GetUsers(int? id)
        {
            try
            {
                var user = await _context.User.FirstOrDefaultAsync(u => u.Id == id);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Trả về đối tượng người dùng
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpPost("UpdateInfor")]
        public async Task<IActionResult> AddUser(UserDto users)
        {
            var userDto = _mapper.Map<User>(users);
            if (string.IsNullOrWhiteSpace(userDto.Username) || string.IsNullOrWhiteSpace(userDto.Email) || string.IsNullOrWhiteSpace(userDto.Role))
            {
                return BadRequest(new { message = "Invalid data. Username, Email, and Role are required." });
            }

            // Kiểm tra email đã tồn tại
            if (_context.User.Any(u => u.Email == userDto.Email))
            {
                return Conflict(new { message = "Email already exists." });
            }

            // Tạo user mới
            var user = new User
            {
                Username = userDto.Username,
                Email = userDto.Email,
                Role = userDto.Role,
                Image= userDto.Image,
            };

            _context.User.Add(user);
            _context.SaveChanges();

            return Ok(new { message = "User added successfully", user });
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [Bind("Username", "Email", "FullName", "PhoneNumber", "Image")] UserDto users)
        {
            try
            { 
                var user = _context.User.FirstOrDefault(u => u.Id == id);
                if (user == null)
                    return NotFound();
                user.Username = users.Username ?? user.Username;
                user.FullName = users.Fullname ?? user.FullName;
                user.Email = users.Email ?? user.Email;
                user.Image = users.Image ?? user.Image;
                user.PhoneNumber = users.PhoneNumber ?? user.PhoneNumber;
                _context.Update(user);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex) { return StatusCode(500, new { error = ex.Message }); }
            
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _context.User.FirstOrDefault(u => u.Id == id);
            if (user == null)
                return NotFound();

            _context.User.Remove(user);
            return Ok(new { message = "Xóa người dùng thành công!" });
        }
    }
}

