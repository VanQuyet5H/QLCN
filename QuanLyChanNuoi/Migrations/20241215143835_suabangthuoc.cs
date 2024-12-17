using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuanLyChanNuoi.Migrations
{
    public partial class suabangthuoc : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FoodInventory");
            migrationBuilder.DropForeignKey(
    name: "FK_HealthRecord_Medicine_MedicineId",
    table: "HealthRecord");

            migrationBuilder.DropTable(
                name: "Medicine");

            migrationBuilder.DropIndex(
                name: "IX_HealthRecord_MedicineId",
                table: "HealthRecord");

            migrationBuilder.DropColumn(
                name: "MedicineId",
                table: "HealthRecord");

            migrationBuilder.CreateTable(
                name: "Medication",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Cost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medication", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TreatmentMedication",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TreatmentId = table.Column<int>(type: "int", nullable: false),
                    MedicationId = table.Column<int>(type: "int", nullable: false),
                    Dosage = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Frequency = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TreatmentMedication", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TreatmentMedication_Medication_MedicationId",
                        column: x => x.MedicationId,
                        principalTable: "Medication",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TreatmentMedication_Treatment_TreatmentId",
                        column: x => x.TreatmentId,
                        principalTable: "Treatment",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HealthRecord_Medicine_MedicineId",
                table: "HealthRecord");

            migrationBuilder.DropTable(
                name: "Medicine");

            migrationBuilder.DropIndex(
                name: "IX_HealthRecord_MedicineId",
                table: "HealthRecord");

            migrationBuilder.DropColumn(
                name: "MedicineId",
                table: "HealthRecord");

            migrationBuilder.CreateTable(
                name: "FoodInventory",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    FoodType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastRestockDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Supplier = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FoodInventory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FoodInventory_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FoodInventory_UserId",
                table: "FoodInventory",
                column: "UserId");
        }
    }
}
