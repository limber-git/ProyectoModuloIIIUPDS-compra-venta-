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
    public class Usuario_PermisoController : ControllerBase
    {
        private readonly PracticaContext _context;
        public Usuario_PermisoController(PracticaContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario_Permiso>>> Get()
        {
            var usuarioPermiso = await _context.usuario_permisos.Include(c => c.Usuario).Include(x => x.Permiso).ToListAsync();
            return Ok(usuarioPermiso);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario_Permiso>> Get(int id)
        {
            var usuarioPermiso = await _context.usuario_permisos.FindAsync(id);
            if (usuarioPermiso == null)
            {
                return NotFound();
            }
            var usuario = await _context.usuarios.FindAsync(usuarioPermiso.idusuario);
            var permiso = await _context.permisos.FindAsync(usuarioPermiso.idpermiso);
            usuarioPermiso.Usuario = usuario;
            usuarioPermiso.Permiso = permiso;
            return Ok(usuarioPermiso);
        }
        [HttpPost]
        public async Task<ActionResult<Usuario_Permiso>> Post(Usuario_Permiso usuarioPermiso)
        {
            if (usuarioPermiso == null)
            {
                return NotFound();
            }
            var usuario = await _context.usuarios.FindAsync(usuarioPermiso.idusuario);
            if (usuario == null)
            {
                return NotFound();
            }
            var permiso = await _context.permisos.FindAsync(usuarioPermiso.idpermiso);
            if (permiso == null)
            {
                return NotFound();
            }
            usuarioPermiso.Usuario = usuario;
            usuarioPermiso.Permiso = permiso;

            _context.usuario_permisos.Add(usuarioPermiso);
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new { id = usuarioPermiso.idusuario_permiso }, usuarioPermiso);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Usuario_Permiso>> Put(int id, Usuario_Permiso usuarioPermiso)
        {
            if (id != usuarioPermiso.idusuario_permiso)
            {
                return BadRequest();
            }
            var usuario = await _context.usuarios.FindAsync(usuarioPermiso.idusuario);
            if (usuario == null)
            {
                return NotFound();
            }
            var permiso = await _context.permisos.FindAsync(usuarioPermiso.idpermiso);
            if (permiso == null)
            {
                return NotFound();
            }
            usuarioPermiso.Usuario = usuario;
            usuarioPermiso.Permiso = permiso;

            _context.Entry(usuarioPermiso).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(usuarioPermiso);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var usuarioPermiso = await _context.usuario_permisos.FindAsync(id);
            if(usuarioPermiso == null)
            {
                return NotFound();
            }
            _context.usuario_permisos.Remove(usuarioPermiso);
            await _context.SaveChangesAsync();
            return Ok(usuarioPermiso);
        }
    }
}
