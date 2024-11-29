using QuanLyChanNuoi.Models.Request;
using QuanLyChanNuoi.Models;
using AutoMapper;

namespace QuanLyChanNuoi.Extensions
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Ánh xạ UserDto sang User và ngược lại
            CreateMap<UserDto, User>();
            CreateMap<User, UserDto>();
        }
    }
}
