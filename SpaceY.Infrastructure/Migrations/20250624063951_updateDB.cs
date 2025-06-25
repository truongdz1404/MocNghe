using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SpaceY.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updateDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblRoles",
                keyColumn: "Id",
                keyValue: "2c56a891-f346-41da-b0c9-862e3337866a");

            migrationBuilder.DeleteData(
                table: "tblRoles",
                keyColumn: "Id",
                keyValue: "d7544222-f6c1-4b7c-8acf-06a53446d671");

            migrationBuilder.AddColumn<string>(
                name: "Image2DUrl",
                table: "tblProduct",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Image2DUrl",
                table: "tblProduct");

            migrationBuilder.InsertData(
                table: "tblRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "2c56a891-f346-41da-b0c9-862e3337866a", null, "Admin", "ADMIN" },
                    { "d7544222-f6c1-4b7c-8acf-06a53446d671", null, "Customer", "CUSTOMER" }
                });
        }
    }
}
