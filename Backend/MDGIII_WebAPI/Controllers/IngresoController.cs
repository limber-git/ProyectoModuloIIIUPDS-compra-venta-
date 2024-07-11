using MDGIII_WebAPI.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MDGIII_WebAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Microsoft.AspNetCore.Cors;

namespace MDGIII_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("Cors")]
    public class IngresoController : ControllerBase
    {
        private readonly PracticaContext _context;
        private readonly ILogger<IngresoController> _logger;
        public IngresoController(PracticaContext context, ILogger<IngresoController> logger)
        {
            _context = context;
            _logger = logger;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ingreso>>> Get()
        {
            var ingreso = await _context.ingresos.Include(c=>c.Persona).Include(x=>x.Usuario).ToListAsync();
            return Ok(ingreso);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Ingreso>> Get(int id)
        {
            var ingreso = await _context.ingresos.FindAsync(id);
            if (ingreso == null)
            {
                return NotFound();
            }
            var proveedor = await _context.personas.FindAsync(ingreso.idproveedor);
            var usuario = await _context.usuarios.FindAsync(ingreso.idusuario);
            ingreso.Persona = proveedor;
            ingreso.Usuario = usuario;

            return Ok(ingreso);
        }
        [HttpPost]
        public async Task<ActionResult<Ingreso>> Post(Ingreso ingreso)
        {
            var proveedor = await _context.personas.FindAsync(ingreso.idproveedor);
            if (proveedor == null)
            {
                return NotFound("Proveedor no encontrado.");
            }
            var usuario = await _context.usuarios.FindAsync(ingreso.idusuario);
            if (usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }
            ingreso.Persona = proveedor;
            ingreso.Usuario = usuario;

            _context.ingresos.Add(ingreso);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Get", new { id = ingreso.idingreso }, ingreso);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Ingreso>> Put(int id, Ingreso ingreso)
        {
            if (id != ingreso.idingreso)
            {
                return BadRequest();
            }

            var proveedor = await _context.personas.FindAsync(ingreso.idproveedor);
            if (proveedor == null)
            {
                return NotFound("Proveedor no encontrado.");
            }
            var usuario = await _context.usuarios.FindAsync(ingreso.idusuario);
            if (usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }
            ingreso.Persona = proveedor;
            ingreso.Usuario = usuario;

            _context.Entry(ingreso).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(ingreso);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var ingreso = await _context.ingresos.FindAsync(id);
            if (ingreso == null)
            {
                return NotFound();
            }

            var proveedor = await _context.personas.FindAsync(ingreso.idproveedor);
            if (proveedor == null)
            {
                return NotFound("Proveedor no encontrado.");
            }
            var usuario = await _context.usuarios.FindAsync(ingreso.idusuario);
            if (usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }
            ingreso.Persona = proveedor;
            ingreso.Usuario = usuario;

            ingreso.estado = "Anulado";

            _context.Entry(ingreso).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(ingreso);
        }
    }
}
