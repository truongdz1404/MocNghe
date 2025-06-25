using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpaceY.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updateDB_V4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Banner",
                table: "Blogs",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Banner",
                table: "Blogs");
        }
    }
}
