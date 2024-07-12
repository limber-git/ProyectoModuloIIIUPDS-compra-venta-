using MDGIII_WebAPI.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MDGIII_WebAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Microsoft.AspNetCore.Cors;
using MDGIII_WebAPI.Custom;

namespace MDGIII_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("Cors")]
    public class IngresoController : ControllerBase
    {
        private readonly PracticaContext _context;
        private readonly Utilidades _utilidades;
        public IngresoController(PracticaContext context, Utilidades utilidades)
        {
            _context = context;
            _utilidades = utilidades;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ingreso>>> Get()
        {
            var ingreso = await _context.ingresos.Include(c=>c.Persona).Include(x=>x.Usuario).OrderByDescending(i=>i.idingreso).ToListAsync();
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

            // Lógica para determinar el siguiente número y serie de comprobante
            string tipoComprobante = char.ToUpper(ingreso.tipo_comprobante[0]) + ingreso.tipo_comprobante.Substring(1).ToLowerInvariant();
            string serieComprobante = ObtenerSerieComprobante(tipoComprobante); // Lógica para obtener la serie
            int numeroComprobante = ObtenerSiguienteNumeroComprobante(tipoComprobante); // Lógica para obtener el próximo número

            // Asignar serie y número al ingreso
            ingreso.tipo_comprobante = tipoComprobante;
            ingreso.serie_comprobante = serieComprobante;
            ingreso.num_comprobante = numeroComprobante.ToString();

            _context.ingresos.Add(ingreso);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Get", new { id = ingreso.idingreso }, ingreso);
        }

        private string ObtenerSerieComprobante(string tipoComprobante)
        {
            // Lógica para determinar la serie según el tipo de comprobante
            // Consultar el último número utilizado para este tipo de comprobante
            var ultimoNumero = _context.ingresos
                .Where(i => i.tipo_comprobante == tipoComprobante)
                .OrderByDescending(i => i.idingreso)
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
            var ultimoIngreso = _context.ingresos
                .Where(i => i.tipo_comprobante == tipoComprobante)
                .OrderByDescending(i => i.idingreso)
                .FirstOrDefault();

            int ultimoNumero = ultimoIngreso != null ? int.Parse(ultimoIngreso.num_comprobante) : 0;
            return ultimoNumero + 1;
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var ingreso = await _context.ingresos.FindAsync(id);
            if (ingreso == null)
            {
                return NotFound();
            }

            ingreso.estado = "Anulado";

            _context.ingresos.Update(ingreso);
            await _context.SaveChangesAsync();
            return Ok(ingreso);
        }
        [HttpGet("PorFecha")]
        public async Task<ActionResult<IEnumerable<Ingreso>>> GetIngresosPorFecha(string periodo, DateTime referencia)
        {
            try
            {
                var (fechaInicio, fechaFin) = _utilidades.ObtenerFechasPorPeriodo(periodo, referencia);
                var ingresos = await _context.ingresos
                    .Where(c => c.fecha_hora >= fechaInicio && c.fecha_hora <= fechaFin)
                    .ToListAsync();

                return Ok(ingresos);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
