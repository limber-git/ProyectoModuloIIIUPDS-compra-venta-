using MDGIII_WebAPI.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("Cors", builder =>
    {
        builder.WithOrigins("")
                .AllowAnyHeader()
                .AllowAnyMethod();
    });
});

// Add services to the container.
var db = builder.Configuration.GetConnectionString("conexionBD");
builder.Services.AddDbContext<PracticaContext>(options => options.UseSqlServer(db));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("Cors");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
