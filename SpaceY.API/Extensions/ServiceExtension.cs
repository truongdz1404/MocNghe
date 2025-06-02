

using SpaceY.Application.Interfaces.Repositories;
using SpaceY.Application.Interfaces.Services;
using SpaceY.Application.Services;
using SpaceY.Domain.Interfaces;
using SpaceY.Domain.Interfaces.IRepositories;
using SpaceY.Infrastructure.Repositories;
using SpaceY.Infrastructure.Service;
using SpaceY.Infrastructure.Services;

namespace SpaceY.API;

public static class ServiceExtension
{
    public static IServiceCollection RegisterService(this IServiceCollection services)
    {

        #region Services
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IProductService, ProductService>();
        #endregion

        #region Repositories
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddTransient<IUserRepository, UserRepository>();
        #endregion



        return services;
    }
}