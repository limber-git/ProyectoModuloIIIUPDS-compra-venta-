using MDGIII_WebAPI.Data;
using MDGIII_WebAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Runtime.InteropServices;

namespace MDGIII_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly PracticaContext _context;
        public UsuarioController(PracticaContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> Get()
        {
            var usuario = await _context.usuarios.ToListAsync();
            return Ok(usuario);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> Get(int id)
        {
            var usuario = await _context.usuarios.FindAsync(id);
            if(usuario == null)
            {
                return NotFound();
            }
            return Ok(usuario);
        }
        [HttpPost]
        public async Task<ActionResult<Usuario>> Post(Usuario usuario)
        {
            if (usuario == null)
            {
                return NotFound();
            }
            _context.usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new {id = usuario.idusuario}, usuario);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Usuario>> Put(int id, Usuario usuario)
        {
            if(id != usuario.idusuario)
            {
                return BadRequest();
            }
            _context.Entry(usuario).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(usuario);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var usuario = await _context.usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }
            _context.usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return Ok(usuario);
        }


        ///este es un comentario de prueba para verrificar el correcto funcionamiento de git
        ///
    }
}
