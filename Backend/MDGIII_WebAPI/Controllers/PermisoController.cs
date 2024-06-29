using MDGIII_WebAPI.Data;
using MDGIII_WebAPI.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace MDGIII_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("Cors")]
    public class PermisoController : ControllerBase
    {
        private readonly PracticaContext _context;
        public PermisoController(PracticaContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Permiso>>> Get()
        {
            var permiso = await _context.permisos.ToListAsync();
            return Ok(permiso);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Permiso>> Get(int id)
        {
            var permiso = await _context.permisos.FindAsync(id);
            if (permiso == null)
            {
                return NotFound();
            }
            return Ok(permiso);
        }
        [HttpPost]
        public async Task<ActionResult<Permiso>> Post(Permiso permiso)
        {
            if(permiso == null)
            {
                return NotFound();
            }
            _context.permisos.Add(permiso);
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new {id = permiso.idpermiso}, permiso);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Permiso>> Put(int id, Permiso permiso)
        {
            if (id != permiso.idpermiso)
            {
                return BadRequest();
            }
            _context.Entry(permiso).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(permiso);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var permiso = await _context.permisos.FindAsync(id);
            if(permiso == null)
            {
                return NotFound();
            }
            _context.permisos.Remove(permiso);
            await _context.SaveChangesAsync();
            return Ok(permiso);
        }
    }
}
