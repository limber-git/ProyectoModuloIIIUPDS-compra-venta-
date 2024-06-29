using System.ComponentModel.DataAnnotations;

namespace MDGIII_WebAPI.Models
{
    public class Usuario
    {
        [Key]
        public int idusuario { get; set; }
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(100, MinimumLength = 3)]
        public string nombre { get; set; }
        [Required(ErrorMessage = "El tipoDocumento es obligatorio")]
        [StringLength(20, MinimumLength = 5)]
        public string tipo_documento { get; set; }
        [Required(ErrorMessage = "El numDocumento es obligatorio")]
        [StringLength(20, MinimumLength = 5)]
        public string num_documento { get; set; }
        [Required(ErrorMessage = "La direccion es obligatoria")]
        [StringLength(70, MinimumLength = 20)]
        public string direccion { get; set; }
        [Required(ErrorMessage = "El telefono es obligatorio")]
        [StringLength(20, MinimumLength = 8)]
        public string telefono { get; set; }
        [Required(ErrorMessage = "El email es obligatorio")]
        [StringLength(50, MinimumLength = 10)]
        public string email { get; set; }
        [Required(ErrorMessage = "El cargo es obligatorio")]
        [StringLength(20, MinimumLength = 5)]
        public string cargo { get; set; }
        [Required(ErrorMessage = "El login es obligatorio")]
        [StringLength(20, MinimumLength = 5)]
        [RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "El login solo puede contener letras y números")]
        public string login { get; set; }
        [Required(ErrorMessage = "La clave es obligatoria")]
        [StringLength(64, MinimumLength = 8)]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$", ErrorMessage = "La clave debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial")]
        public string clave { get; set; }
        [Required(ErrorMessage = "La condicion es obligatoria")]
        public bool condicion { get; set; }
    }
}
