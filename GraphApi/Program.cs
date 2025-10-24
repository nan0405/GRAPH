using GraphApi.Services;

var builder = WebApplication.CreateBuilder(args);

// register service
builder.Services.AddSingleton<DijkstraService>();

builder.Services.AddControllers()
    .AddJsonOptions(opt =>
    {
        opt.JsonSerializerOptions.PropertyNamingPolicy = null; // giữ nguyên PascalCase
    });

var app = builder.Build();

app.UseRouting();
app.UseCors(c => c.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
app.MapControllers();
app.UseStaticFiles();

app.Run();
