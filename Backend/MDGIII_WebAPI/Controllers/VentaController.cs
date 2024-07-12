using MDGIII_WebAPI.Custom;
using MDGIII_WebAPI.Data;
using MDGIII_WebAPI.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Security.Cryptography.Xml;

namespace MDGIII_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("Cors")]
    public class VentaController : ControllerBase
    {
        private readonly PracticaContext _context;
        private readonly Utilidades _utilidades;
        public VentaController(PracticaContext context, Utilidades utilidades)
        {
            _context = context;
            _utilidades = utilidades;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Venta>>> Get()
        {
            var ventas = await _context.ventas.Include(c=>c.Persona).Include(x=>x.Usuario).ToListAsync();
            return Ok(ventas);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Venta>> Get(int id)
        {
            var venta = await _context.ventas.FindAsync(id);
            if(venta == null)
            {
                return NotFound();
            }
            var cliente = await _context.personas.FindAsync(venta.idcliente);
            var usuario = await _context.usuarios.FindAsync(venta.idusuario);
            venta.Persona = cliente;
            venta.Usuario = usuario;

            return Ok(venta);
        }
        [HttpPost]
        public async Task<ActionResult<Venta>> Post(Venta venta)
        {
            var cliente = await _context.personas.FindAsync(venta.idcliente);
            if(cliente == null)
            {
                return NotFound();
            }
            var usuario = await _context.usuarios.FindAsync(venta.idusuario);
            if(usuario == null)
            {
                return NotFound();
            }

            venta.Persona = cliente;
            venta.Usuario = usuario;

            _context.ventas.Add(venta);
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new {id = venta.idventa}, venta);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var venta = await _context.ventas.FindAsync(id);
            if(venta == null)
            {
                return NotFound();
            }
            venta.estado = "Anulado";
            _context.ventas.Update(venta);
            await _context.SaveChangesAsync();
            return Ok(venta);
        }
        [HttpGet("PorFecha")]
        public async Task<ActionResult<IEnumerable<Venta>>> GetVentasPorFecha(string periodo, DateTime referencia)
        {
            try
            {
                var (fechaInicio, fechaFin) = _utilidades.ObtenerFechasPorPeriodo(periodo, referencia);
                var ventas = await _context.ventas
                    .Where(c => c.fecha_hora >= fechaInicio && c.fecha_hora <= fechaFin)
                    .ToListAsync();

                return Ok(ventas);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
