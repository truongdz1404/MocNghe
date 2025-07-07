using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpaceY.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updateDB_V5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Country",
                table: "tblAddress");

            migrationBuilder.RenameColumn(
                name: "Zip",
                table: "tblAddress",
                newName: "PhoneNumber");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "tblAddress",
                newName: "Zip");

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "tblAddress",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
