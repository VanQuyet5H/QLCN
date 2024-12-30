using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuanLyChanNuoi.Migrations
{
    public partial class cnxoa : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sale_Animal_AnimalId",
                table: "Sale");

            migrationBuilder.AddForeignKey(
                name: "FK_Sale_Animal_AnimalId",
                table: "Sale",
                column: "AnimalId",
                principalTable: "Animal",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sale_Animal_AnimalId",
                table: "Sale");

            migrationBuilder.AddForeignKey(
                name: "FK_Sale_Animal_AnimalId",
                table: "Sale",
                column: "AnimalId",
                principalTable: "Animal",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
