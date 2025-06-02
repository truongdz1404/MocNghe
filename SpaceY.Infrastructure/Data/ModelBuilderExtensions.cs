using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SpaceY.Domain.Enums;

namespace SpaceY.Infrastructure.Data
{
    public static class ModelBuilderExtensions
    {
        public static void SeedDatabase(this ModelBuilder builder)
        {
            var roles = new List<IdentityRole>();
            foreach (var role in Enum.GetValues(typeof(UserRole)))
            {
                roles.Add(new IdentityRole
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = role.ToString(),
                    NormalizedName = role.ToString()!.ToUpper()
                });
            }
         
            builder.Entity<IdentityRole>().HasData(roles);
        }
    }
}