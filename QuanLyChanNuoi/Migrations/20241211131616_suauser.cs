using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuanLyChanNuoi.Migrations
{
    public partial class suauser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ActivationToken",
                table: "User",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ActivationTokenExpiry",
                table: "User",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActivationToken",
                table: "User");

            migrationBuilder.DropColumn(
                name: "ActivationTokenExpiry",
                table: "User");
        }
    }
}
