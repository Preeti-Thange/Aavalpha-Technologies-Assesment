using AvalphaTechnologies.CommissionCalculator.Middlewares;
using AvalphaTechnologies.CommissionCalculator.Services;

namespace AvalphaTechnologies.CommissionCalculator
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Register custom application services
            builder.Services.AddScoped<ICommissionService, CommissionService>();

            var corsPolicy = "_allowFrontend";

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(corsPolicy, policy =>
                {
                    policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            app.UseMiddleware<ExceptionHandlingMiddleware>();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors(corsPolicy);
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
