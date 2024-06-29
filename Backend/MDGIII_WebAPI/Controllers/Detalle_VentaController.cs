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
            return Ok(DVenta);
        }
        [HttpPost]
        public async Task<ActionResult<Detalle_Venta>> Post(Detalle_Venta DVenta)
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
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new {id = DVenta.iddetalle_venta}, DVenta);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Detalle_Venta>> Put(int id, Detalle_Venta DVenta)
        {
            if(id != DVenta.iddetalle_venta)
            {
                return BadRequest();
            }
            _context.Entry(DVenta).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(DVenta);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var DVenta = await _context.detalle_ventas.FindAsync(id);
            if(DVenta == null)
            {
                return NotFound();
            }
            _context.detalle_ventas.Remove(DVenta);
            await _context.SaveChangesAsync();
            return Ok(DVenta);
        }
    }
}
