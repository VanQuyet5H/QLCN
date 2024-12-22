using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuanLyChanNuoi.Migrations
{
    public partial class db : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Cập nhật các giá trị không hợp lệ trong cột Dosage thành 0 (hoặc giá trị hợp lệ khác)
            migrationBuilder.Sql("UPDATE TreatmentMedication SET Dosage = 0 WHERE ISNUMERIC(Dosage) = 0");

            // Tiến hành thay đổi kiểu dữ liệu cột Dosage từ nvarchar sang float
            migrationBuilder.AlterColumn<double>(
                name: "Dosage",
                table: "TreatmentMedication",
                type: "float",  // Hoặc double, tùy vào yêu cầu
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Quay lại kiểu dữ liệu cột Dosage là nvarchar nếu cần
            migrationBuilder.AlterColumn<string>(
                name: "Dosage",
                table: "TreatmentMedication",
                type: "nvarchar(100)",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");
        }
    }
}
