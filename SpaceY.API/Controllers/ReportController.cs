using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpaceY.Infrastructure.Data;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace SpaceY.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public ReportController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("orders/monthly")]
        public IActionResult GetOrderReportByMonth(int year, int month)
        {
            var query = _db.Orders
                .Where(o => o.CreatedAt.Year == year && o.CreatedAt.Month == month);

            var orderStats = new
            {
                TotalOrders = query.Count(),
                TotalRevenue = query.Sum(o => o.TotalPrice),
                AverageOrderValue = query.Average(o => o.TotalPrice),
                TopProducts = _db.OrderDetails
                    .Where(od => od.Order.CreatedAt.Year == year && od.Order.CreatedAt.Month == month)
                    .GroupBy(od => new { od.ProductId, od.Product.Title })
                    .Select(g => new
                    {
                        ProductId = g.Key.ProductId,
                        ProductName = g.Key.Title,
                        TotalQuantity = g.Sum(od => od.Quantity),
                        TotalRevenue = g.Sum(od => od.TotalPrice)
                    })
                    .OrderByDescending(x => x.TotalRevenue)
                    .Take(5)
                    .ToList(),
                DailyStats = query
                    .GroupBy(o => o.CreatedAt.Day)
                    .Select(g => new
                    {
                        Day = g.Key,
                        OrderCount = g.Count(),
                        Revenue = g.Sum(o => o.TotalPrice)
                    })
                    .OrderBy(x => x.Day)
                    .ToList()
            };

            return Ok(orderStats);
        }

        [HttpGet("orders/yearly")]
        public IActionResult GetOrderReportByYear(int year)
        {
            var query = _db.Orders
                .Where(o => o.CreatedAt.Year == year);
            var orderStats = new
            {
                TotalOrders = query.Count(),
                TotalRevenue = query.Sum(o => o.TotalPrice),
                AverageOrderValue = query.Average(o => o.TotalPrice),
                MonthlyStats = query
                    .GroupBy(o => o.CreatedAt.Month)
                    .Select(g => new
                    {
                        Month = g.Key,
                        OrderCount = g.Count(),
                        Revenue = g.Sum(o => o.TotalPrice),
                        AverageOrderValue = g.Average(o => o.TotalPrice)
                    })
                    .OrderBy(x => x.Month)
                    .ToList(),
                TopProducts = _db.OrderDetails
                    .Where(od => od.Order.CreatedAt.Year == year)
                    .GroupBy(od => new { od.ProductId, od.Product.Title })
                    .Select(g => new
                    {
                        ProductId = g.Key.ProductId,
                        ProductName = g.Key.Title,
                        TotalQuantity = g.Sum(od => od.Quantity),
                        TotalRevenue = g.Sum(od => od.TotalPrice)
                    })
                    .OrderByDescending(x => x.TotalRevenue)
                    .Take(10)
                    .ToList(),
            };

            return Ok(orderStats);
        }

        [HttpGet("orders/weekly")]
        public IActionResult GetOrderReportByWeek(int year, int weekNumber)
        {
            // Calculate start and end date of the week
            var jan1 = new DateTime(year, 1, 1);
            var daysOffset = DayOfWeek.Monday - jan1.DayOfWeek;
            var firstMonday = jan1.AddDays(daysOffset);
            var weekStart = firstMonday.AddDays(weekNumber * 7);
            var weekEnd = weekStart.AddDays(7);

            var query = _db.Orders
                .Where(o => o.CreatedAt >= weekStart && o.CreatedAt < weekEnd);

            var orderStats = new
            {
                WeekStart = weekStart,
                WeekEnd = weekEnd,
                TotalOrders = query.Count(),
                TotalRevenue = query.Sum(o => o.TotalPrice),
                AverageOrderValue = query.Average(o => o.TotalPrice),
                DailyStats = query
                    .GroupBy(o => o.CreatedAt.Date)
                    .Select(g => new
                    {
                        Date = g.Key,
                        OrderCount = g.Count(),
                        Revenue = g.Sum(o => o.TotalPrice),
                        AverageOrderValue = g.Average(o => o.TotalPrice)
                    })
                    .OrderBy(x => x.Date)
                    .ToList(),
                TopProducts = _db.OrderDetails
                    .Where(od => od.Order.CreatedAt >= weekStart && od.Order.CreatedAt < weekEnd)
                    .GroupBy(od => new { od.ProductId, od.Product.Title })
                    .Select(g => new
                    {
                        ProductId = g.Key.ProductId,
                        ProductName = g.Key.Title,
                        TotalQuantity = g.Sum(od => od.Quantity),
                        TotalRevenue = g.Sum(od => od.TotalPrice)
                    })
                    .OrderByDescending(x => x.TotalRevenue)
                    .Take(5)
                    .ToList()
            };

            return Ok(orderStats);
        }

    }
}
