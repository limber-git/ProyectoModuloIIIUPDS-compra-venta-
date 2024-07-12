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
    public class ArticuloController : ControllerBase
    {
        private readonly PracticaContext _context;
        public ArticuloController(PracticaContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Articulo>>> Get()
        {
            var articulo = await _context.articulos.Include(c=>c.categorias).ToListAsync();
            return Ok(articulo);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Articulo>> Get(int id)
        {
            var articulo = await _context.articulos.FindAsync(id);
            if (articulo == null)
            {
                return NotFound();
            }
            var categoria = await _context.categorias.FindAsync(articulo.idcategoria);
            articulo.categorias = categoria;
            return Ok(articulo);
        }
        [HttpPost]
        public async Task<ActionResult<Articulo>> Post(Articulo articulo)
        {
            var categoria = await _context.categorias.FindAsync(articulo.idcategoria);
            if (categoria == null)
            {
                return NotFound();
            }
            articulo.categorias = categoria;
            _context.articulos.Add(articulo);
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new { id = articulo.idarticulo }, articulo);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Articulo>> Put(int id, Articulo articulo)
        {
            if(id != articulo.idarticulo)
            {
                return BadRequest();
            }
            var categoria = await _context.categorias.FindAsync(articulo.idcategoria);
            if (categoria == null)
            {
                return NotFound();
            }
            articulo.categorias = categoria;

            _context.Entry(articulo).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(articulo);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var articulo = await _context.articulos.FindAsync(id);
            if(articulo == null)
            {
                return NotFound();
            }
            _context.articulos.Remove(articulo);
            await _context.SaveChangesAsync();
            return Ok(articulo);
        }
    }
}
