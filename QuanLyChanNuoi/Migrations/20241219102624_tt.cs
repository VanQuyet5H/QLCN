using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuanLyChanNuoi.Migrations
{
    public partial class tt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
            name: "CageId",
            table: "Animal",
            type: "int",
            nullable: true, // Allow NULL
            oldClrType: typeof(int),
            oldType: "int",
            oldNullable: false); // Previously not NULL
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
           name: "CageId",
           table: "Animal",
           type: "int",
           nullable: false, // Revert to NOT NULL
           oldClrType: typeof(int),
           oldType: "int",
           oldNullable: true);
        }
    }
}
