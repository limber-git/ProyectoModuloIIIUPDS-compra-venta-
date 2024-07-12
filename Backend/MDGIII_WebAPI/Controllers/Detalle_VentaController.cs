using MDGIII_WebAPI.Data;
using MDGIII_WebAPI.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MDGIII_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("Cors")]
    public class Detalle_VentaController : ControllerBase
    {
        private readonly PracticaContext _context;
        public Detalle_VentaController(PracticaContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Detalle_Venta>>> Get()
        {
            var DVentas = await _context.detalle_ventas.Include(c=>c.Articulo).Include(x=>x.Venta).ToListAsync();
            return Ok(DVentas);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Detalle_Venta>> Get(int id)
        {
            var DVenta = await _context.detalle_ventas.FindAsync(id);
            if(DVenta == null)
            {
                return NotFound();
            }
            var articulo = await _context.articulos.FindAsync(DVenta.idarticulo);
            var venta = await _context.ventas.FindAsync(DVenta.idventa);
            DVenta.Articulo = articulo;
            DVenta.Venta = venta;

            return Ok(DVenta);
        }
        [HttpPost]
        public async Task<ActionResult<IEnumerable<Detalle_Venta>>> Post(List<Detalle_Venta> detalleVentas)
        {
            if (detalleVentas == null || !detalleVentas.Any())
            {
                return BadRequest("La lista de detalles de ventas está vacía o es nula.");
            }
            foreach (var DVenta in detalleVentas)
            {
                var articulo = await _context.articulos.FindAsync(DVenta.idarticulo);
                if(articulo == null)
                {
                    return NotFound();
                }
                var venta = await _context.ventas.FindAsync(DVenta.idventa);
                if(venta == null)
                {
                    return NotFound();
                }
                DVenta.Articulo = articulo;
                DVenta.Venta = venta;

                _context.detalle_ventas.Add(DVenta);

                if(articulo.stock >= DVenta.cantidad)
                {
                    articulo.stock -= DVenta.cantidad;
                    _context.articulos.Update(articulo);
                }
                else
                {
                    return NotFound("La cantidad ingresada excedio los limites del STOCK");
                }
            }
            await _context.SaveChangesAsync();
            return Ok(detalleVentas);
        }
    }
}
