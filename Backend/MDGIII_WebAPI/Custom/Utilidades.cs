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
        public (DateTime fechaInicio, DateTime fechaFin) ObtenerFechasPorPeriodo(string periodo, DateTime referencia)
        {
            DateTime fechaInicio, fechaFin;

            switch (periodo.ToLower())
            {
                case "diario":
                    fechaInicio = referencia.Date;
                    fechaFin = fechaInicio.AddDays(1).AddSeconds(-1);
                    break;

                case "semanal":
                    fechaInicio = referencia.Date.AddDays(-(int)referencia.DayOfWeek);
                    fechaFin = fechaInicio.AddDays(7).AddSeconds(-1);
                    break;

                case "mensual":
                    fechaInicio = new DateTime(referencia.Year, referencia.Month, 1);
                    fechaFin = fechaInicio.AddMonths(1).AddSeconds(-1);
                    break;

                case "anual":
                    fechaInicio = new DateTime(referencia.Year, 1, 1);
                    fechaFin = fechaInicio.AddYears(1).AddSeconds(-1);
                    break;

                default:
                    throw new ArgumentException("Periodo no válido");
            }

            return (fechaInicio, fechaFin);
        }
    }
}
