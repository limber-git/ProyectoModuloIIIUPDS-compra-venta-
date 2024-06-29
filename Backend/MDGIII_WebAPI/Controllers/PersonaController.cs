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
    public class PersonaController : ControllerBase
    {
        private readonly PracticaContext _context;
        public PersonaController(PracticaContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Persona>>> Get()
        {
            var persona = await _context.personas.ToListAsync();
            return Ok(persona);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Persona>> Get(int id)
        {
            var persona = await _context.personas.FindAsync(id);
            if(persona == null)
            {
                return NotFound();
            }
            return Ok(persona);
        }
        [HttpPost]
        public async Task<ActionResult<Persona>> Post(Persona persona)
        {
            if(persona == null)
            {
                return NotFound();
            }
            _context.personas.Add(persona);
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new {id = persona.idpersona}, persona);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Persona>> Put(int id, Persona persona)
        {
            if (id != persona.idpersona)
            {
                return BadRequest();
            }
            _context.Entry(persona).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(persona);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var persona = await _context.personas.FindAsync(id);
            if (persona == null)
            {
                return NotFound();
            }
            _context.personas.Remove(persona);
            await _context.SaveChangesAsync();
            return Ok(persona);
        }
    }
}
