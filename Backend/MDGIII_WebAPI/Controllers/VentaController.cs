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
            var ventas = await _context.ventas.Include(c=>c.Persona).Include(x=>x.Usuario).OrderByDescending(i => i.idventa).ToListAsync();
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

            // Lógica para determinar el siguiente número y serie de comprobante
            string tipoComprobante = char.ToUpper(venta.tipo_comprobante[0]) + venta.tipo_comprobante.Substring(1).ToLowerInvariant();
            string serieComprobante = ObtenerSerieComprobante(tipoComprobante); // Lógica para obtener la serie
            int numeroComprobante = ObtenerSiguienteNumeroComprobante(tipoComprobante); // Lógica para obtener el próximo número

            // Asignar serie y número al ingreso
            venta.tipo_comprobante = tipoComprobante;
            venta.serie_comprobante = serieComprobante;
            venta.num_comprobante = numeroComprobante.ToString();

            _context.ventas.Add(venta);
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new {id = venta.idventa}, venta);
        }

        private string ObtenerSerieComprobante(string tipoComprobante)
        {
            // Lógica para determinar la serie según el tipo de comprobante
            // Consultar el último número utilizado para este tipo de comprobante
            var ultimoNumero = _context.ventas
                .Where(i => i.tipo_comprobante == tipoComprobante)
                .OrderByDescending(i => i.idventa)
                .Select(i => i.serie_comprobante)
                .FirstOrDefault();

            // Si no hay registros anteriores para este tipo de comprobante, comenzar desde 1
            if (string.IsNullOrEmpty(ultimoNumero))
            {
                return $"{tipoComprobante.Substring(0, 1).ToUpper()}001";
            }

            // Extraer el número de la serie actual
            var numeroSerieActual = int.Parse(ultimoNumero.Substring(1)); // Ignorar la letra inicial

            // Generar el siguiente número de serie
            var siguienteNumero = numeroSerieActual + 1;

            // Construir la serie completa (ejemplo: F002, B003, etc.)
            return $"{tipoComprobante.Substring(0, 1).ToUpper()}{siguienteNumero.ToString("000")}";
        }

        private int ObtenerSiguienteNumeroComprobante(string tipoComprobante)
        {
            // Lógica para obtener el siguiente número de comprobante
            // Consultar último número usado para el tipo de comprobante
            var ultimoIngreso = _context.ventas
                .Where(i => i.tipo_comprobante == tipoComprobante)
                .OrderByDescending(i => i.idventa)
                .FirstOrDefault();

            int ultimoNumero = ultimoIngreso != null ? int.Parse(ultimoIngreso.num_comprobante) : 0;
            return ultimoNumero + 1;
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
