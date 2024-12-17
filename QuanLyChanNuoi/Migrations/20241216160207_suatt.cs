using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuanLyChanNuoi.Migrations
{
    public partial class suatt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cost",
                table: "Treatment");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Cost",
                table: "Treatment",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
