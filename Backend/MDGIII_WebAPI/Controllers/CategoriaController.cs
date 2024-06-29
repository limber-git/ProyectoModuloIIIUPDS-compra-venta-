using MDGIII_WebAPI.Data;
using MDGIII_WebAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MDGIII_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        private readonly PracticaContext _context;
        public CategoriaController(PracticaContext context) 
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> Get()
        {
            var categoria = await _context.categorias.ToListAsync();
            return Ok(categoria);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> Get(int id)
        {
            var categoria = await _context.categorias.FindAsync(id);
            if (categoria == null)
            {
                return NotFound();
            }
            return Ok(categoria);
        }
        [HttpPost]
        public async Task<ActionResult<Categoria>> Post(Categoria categoria)
        {
            if(categoria == null)
            {
                return NotFound();
            }
            _context.categorias.Add(categoria);
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new {id = categoria.idcategoria}, categoria);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Categoria>> Put(int id, Categoria categoria)
        {
            if (id != categoria.idcategoria)
            {
                return BadRequest();
            }
            _context.Entry(categoria).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(categoria);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var categoria = await _context.categorias.FindAsync(id);
            if(categoria == null)
            {
                return NotFound();
            }
            _context.categorias.Remove(categoria);
            await _context.SaveChangesAsync();
            return Ok(categoria);
        }
    }
}
