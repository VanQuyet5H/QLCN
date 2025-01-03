﻿using System.ComponentModel.DataAnnotations;

namespace QuanLyChanNuoi.Models.Request
{
    public class UserDto
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Fullname { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Image { get; set; }

    }
}
