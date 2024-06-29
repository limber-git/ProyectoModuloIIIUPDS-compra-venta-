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
        [HttpGet("Cors")]
        public async Task<ActionResult<Detalle_Ingreso>> Get(int id)
        {
            var DIngreso = await _context.detalle_ingresos.FindAsync(id);
            if(DIngreso == null)
            {
                return NotFound();
            }
            return Ok(DIngreso);
        }
        [HttpPost]
        public async Task<ActionResult<Detalle_Ingreso>> Post(Detalle_Ingreso DIngreso)
        {
            var ingreso = await _context.ingresos.FindAsync(DIngreso.idingreso);
            if(ingreso == null)
            {
                return NotFound();
            }
            var articulo = await _context.articulos.FindAsync(DIngreso.idarticulo);
            if(articulo == null)
            {
                return NotFound();
            }
            DIngreso.Ingreso = ingreso;
            DIngreso.Articulo = articulo;

            _context.detalle_ingresos.Add(DIngreso);
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new { id = DIngreso.iddetalle_ingreso }, DIngreso);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Detalle_Ingreso>> Put(int id, Detalle_Ingreso DIngreso)
        {
            if(id != DIngreso.iddetalle_ingreso)
            {
                return BadRequest();
            }
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
    }
}
