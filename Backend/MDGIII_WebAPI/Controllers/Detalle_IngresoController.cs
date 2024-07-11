using MDGIII_WebAPI.Data;
using MDGIII_WebAPI.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace MDGIII_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("Cors")]
    public class Detalle_IngresoController : ControllerBase
    {
        private readonly PracticaContext _context;
        public Detalle_IngresoController(PracticaContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Detalle_Ingreso>>> Get()
        {
            var DIngreso = await _context.detalle_ingresos.Include(c=>c.Ingreso).Include(x=>x.Articulo).ToListAsync();
            return Ok(DIngreso);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Detalle_Ingreso>> Get(int id)
        {
            var DIngreso = await _context.detalle_ingresos.FindAsync(id);
            if(DIngreso == null)
            {
                return NotFound();
            }
            var ingreso = await _context.ingresos.FindAsync(DIngreso.idingreso);
            var articulo = await _context.articulos.FindAsync(DIngreso.idarticulo);
            DIngreso.Ingreso = ingreso;
            DIngreso.Articulo = articulo;

            return Ok(DIngreso);
        }
        [HttpPost]
        public async Task<ActionResult<IEnumerable<Detalle_Ingreso>>> Post(List<Detalle_Ingreso> detallesIngresos)
        {
            if (detallesIngresos == null || !detallesIngresos.Any())
            {
                return BadRequest("La lista de detalles de ingresos está vacía o es nula.");
            }

            foreach (var DIngreso in detallesIngresos)
            {
                var ingreso = await _context.ingresos.FindAsync(DIngreso.idingreso);
                if (ingreso == null)
                {
                    return NotFound($"Ingreso con id {DIngreso.idingreso} no encontrado.");
                }

                var articulo = await _context.articulos.FindAsync(DIngreso.idarticulo);
                if (articulo == null)
                {
                    return NotFound($"Artículo con id {DIngreso.idarticulo} no encontrado.");
                }

                DIngreso.Ingreso = ingreso;
                DIngreso.Articulo = articulo;
                _context.detalle_ingresos.Add(DIngreso);

                //ACTUALIZA EL STOCK DE ARTICULOS
                articulo.stock += DIngreso.cantidad;
                _context.articulos.Update(articulo);
            }

            await _context.SaveChangesAsync();
            return Ok(detallesIngresos);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Detalle_Ingreso>> Put(int id, Detalle_Ingreso DIngreso)
        {
            if(id != DIngreso.iddetalle_ingreso)
            {
                return BadRequest();
            }
            var ingreso = await _context.ingresos.FindAsync(DIngreso.idingreso);
            if (ingreso == null)
            {
                return NotFound();
            }
            var articulo = await _context.articulos.FindAsync(DIngreso.idarticulo);
            if (articulo == null)
            {
                return NotFound();
            }
            DIngreso.Ingreso = ingreso;
            DIngreso.Articulo = articulo;

            _context.Entry(DIngreso).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(DIngreso);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> Detele(int id)
        {
            var DIngreso = await _context.detalle_ingresos.FindAsync(id);
            if(DIngreso == null)
            {
                return NotFound();
            }
            _context.detalle_ingresos.Remove(DIngreso);
            await _context.SaveChangesAsync();
            return Ok(DIngreso);
        }
        [HttpGet("ultimoprecioventa/{idarticulo}")]
        public async Task<ActionResult<decimal>> GetUltimoPrecioVenta(int idarticulo)
        {
            try
            {
                // Obtener el último detalle de ingreso para el artículo específico
                var ultimoDetalle = await _context.detalle_ingresos
                    .Where(di => di.idarticulo == idarticulo)
                    .OrderByDescending(di => di.Ingreso.fecha_hora) // Ordenar por fecha de ingreso descendente para obtener el último registro
                    .FirstOrDefaultAsync();

                if (ultimoDetalle != null)
                {
                    return Ok(ultimoDetalle.precio_venta);
                }

                // Puedes devolver un valor predeterminado o manejar el caso donde no hay registros
                return NotFound("No se encontró ningún detalle de ingreso para el artículo especificado.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al obtener el último precio de venta: {ex.Message}");
            }
        }
    }
}
