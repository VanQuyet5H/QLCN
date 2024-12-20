using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuanLyChanNuoi.Migrations
{
    public partial class thembangcage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Thêm cột CageId vào bảng Animal
            migrationBuilder.AddColumn<int>(
                name: "CageId",
                table: "Animal",
                type: "int",
                nullable: true); // Cho phép null ban đầu để tránh lỗi ràng buộc

            // Tạo bảng Cage
            migrationBuilder.CreateTable(
                name: "Cage",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AnimalType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AgeGroup = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Purpose = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Area = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    CurrentOccupancy = table.Column<int>(type: "int", nullable: false),
                    MaintenanceDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EnvironmentalConditions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cage", x => x.Id);
                });

            // Xử lý dữ liệu: Gán CageId của các bản ghi hiện tại trong Animal về null (hoặc giá trị hợp lệ)
            migrationBuilder.Sql(
                "UPDATE Animal SET CageId = NULL WHERE CageId = 0"
            );

            // Tạo chỉ mục cho CageId trong Animal
            migrationBuilder.CreateIndex(
                name: "IX_Animal_CageId",
                table: "Animal",
                column: "CageId");

            // Thêm khóa ngoại giữa Animal và Cage
            migrationBuilder.AddForeignKey(
                name: "FK_Animal_Cage_CageId",
                table: "Animal",
                column: "CageId",
                principalTable: "Cage",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animal_Cage_CageId",
                table: "Animal");

            migrationBuilder.DropTable(
                name: "Cage");

            migrationBuilder.DropIndex(
                name: "IX_Animal_CageId",
                table: "Animal");

            migrationBuilder.DropColumn(
                name: "CageId",
                table: "Animal");
        }
    }
}
