using MDGIII_WebAPI.Custom;
using MDGIII_WebAPI.Data;
using MDGIII_WebAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MDGIII_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("Cors")]
    public class AuthController : ControllerBase
    {
        private static readonly List<string> ListaNegraToken = new List<string>();
        private readonly PracticaContext _context;
        private readonly Utilidades _utilidades;
        public AuthController(PracticaContext context, Utilidades utilidades)
        {
            _context = context;
            _utilidades = utilidades;
        }
        [HttpPost("Login")]
        public async Task<ActionResult> Login(Login login)
        {
            var usuario = await _context.usuarios.FirstOrDefaultAsync(u => u.login == login.login && u.clave == _utilidades.encriptarSHA256(login.clave));
            if (usuario == null)
            {
                return Unauthorized();
            }

            var token = _utilidades.generarJwtToken(usuario);
            return Ok(new { Token = token});
        }
        [Authorize]
        [HttpPost("Logout")]
        public ActionResult Logout()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new { message = "No se encontró el token en la solicitud" });
            }

            ListaNegraToken.Add(token);
            return Ok(new { message = "Sesion cerrada exitosamente"});
        }

        [Authorize]
        [HttpGet("ProtectedResource")]
        public ActionResult ProtectedResource()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (ListaNegraToken.Contains(token))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            return Ok(new { message = "Acceso concedido a recurso protegido" });
        }
    }
}
