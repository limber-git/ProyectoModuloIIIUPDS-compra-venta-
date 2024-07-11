using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using MDGIII_WebAPI.Models;
using System.Numerics;
using System.Buffers.Text;

namespace MDGIII_WebAPI.Custom
{
    public class Utilidades
    {
        private readonly IConfiguration _configuracion;
        public Utilidades(IConfiguration configuracion)
        {
            _configuracion = configuracion;
        }
        public string encriptarSHA256(string texto)
        {
            SHA256 sha256Hash = SHA256.Create();
            byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(texto));
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }
            return builder.ToString();
        }
        public string generarJwtToken(Usuario usuario)
        {
            var userClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.idusuario.ToString()),
                new Claim(ClaimTypes.Name, usuario.nombre),
                new Claim(ClaimTypes.Email, usuario.email),
                new Claim("Telefono", usuario.telefono),
                new Claim("Login", usuario.login),
                new Claim("id", Convert.ToString(usuario.idusuario)),
                new Claim("Cargo", usuario.cargo)
            };
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuracion["Jwt:SecretKey"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(_configuracion["Jwt:ExpiresInDays"]));
            //CREAR DETALLE DEL TOKEN
            var token = new JwtSecurityToken(
                _configuracion["Jwt:Issuer"],
                _configuracion["Jwt:Audience"],
                claims: userClaims,
                expires: expires,
                signingCredentials: credentials
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
