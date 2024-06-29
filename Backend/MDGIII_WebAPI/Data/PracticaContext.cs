using MDGIII_WebAPI.Models;
using Microsoft.EntityFrameworkCore;
namespace MDGIII_WebAPI.Data
{
    public class PracticaContext : DbContext
    {
        public PracticaContext(DbContextOptions<PracticaContext> options) : base(options) { }
        public DbSet<Categoria> categorias { get; set; }
        public DbSet<Articulo> articulos { get; set; }
        public DbSet<Usuario> usuarios { get; set; }
        public DbSet<Permiso> permisos { get; set; }
        public DbSet<Usuario_Permiso> usuario_permisos { get; set; }
        public DbSet<Persona> personas { get; set; }
        public DbSet<Ingreso> ingresos { get; set; }
        public DbSet<Detalle_Ingreso> detalle_ingresos { get; set; }
        public DbSet<Venta> ventas { get; set; }
        public DbSet<Detalle_Venta> detalle_ventas { get; set; }
    }
}
