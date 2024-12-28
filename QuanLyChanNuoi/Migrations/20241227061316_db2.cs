using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuanLyChanNuoi.Migrations
{
    public partial class db2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Đổi cột AnimalId thành nullable
            migrationBuilder.AlterColumn<int?>(
                name: "AnimalId",
                table: "Sale",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            // Thay đổi hành vi xóa thành SetNull
            migrationBuilder.DropForeignKey(
                name: "FK_Sale_Animal_AnimalId",
                table: "Sale");

            migrationBuilder.AddForeignKey(
                name: "FK_Sale_Animal_AnimalId",
                table: "Sale",
                column: "AnimalId",
                principalTable: "Animal",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Đổi lại cột AnimalId thành NOT NULL
            migrationBuilder.AlterColumn<int>(
                name: "AnimalId",
                table: "Sale",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int?),
                oldType: "int",
                oldNullable: true);

            // Phục hồi hành vi xóa thành Restrict
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
