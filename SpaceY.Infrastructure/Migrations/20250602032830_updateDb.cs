using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SpaceY.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updateDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblRoles",
                keyColumn: "Id",
                keyValue: "2b86cd29-e8e2-4f10-952c-ec737be4dc00");

            migrationBuilder.DeleteData(
                table: "tblRoles",
                keyColumn: "Id",
                keyValue: "89676630-ecfd-4245-a098-c05e8a8a1369");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "tblReviews",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "tblImage",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "tblRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "3881a357-1b58-4138-8c87-ec0c62834ee5", null, "Admin", "ADMIN" },
                    { "945928df-9e03-4dbe-bc49-05f65216a6d0", null, "Customer", "CUSTOMER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblRoles",
                keyColumn: "Id",
                keyValue: "3881a357-1b58-4138-8c87-ec0c62834ee5");

            migrationBuilder.DeleteData(
                table: "tblRoles",
                keyColumn: "Id",
                keyValue: "945928df-9e03-4dbe-bc49-05f65216a6d0");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "tblReviews");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "tblImage");

            migrationBuilder.InsertData(
                table: "tblRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "2b86cd29-e8e2-4f10-952c-ec737be4dc00", null, "Customer", "CUSTOMER" },
                    { "89676630-ecfd-4245-a098-c05e8a8a1369", null, "Admin", "ADMIN" }
                });
        }
    }
}
