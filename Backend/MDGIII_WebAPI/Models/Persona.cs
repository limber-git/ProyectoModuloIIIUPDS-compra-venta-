using System.ComponentModel.DataAnnotations;

namespace MDGIII_WebAPI.Models
{
    public class Persona
    {
        [Key]
        public int idpersona { get; set; }
        [Required(ErrorMessage = "El tipoPersona es obligatorio")]
        [StringLength(20)]
        public string tipo_persona { get; set; }
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(100)]
        public string nombre { get; set; }
        [Required(ErrorMessage = "El tipoDocumento es obligatorio")]
        [StringLength(20)]
        public string tipo_documento { get; set; }
        [Required(ErrorMessage = "El numDocumento es obligatorio")]
        [StringLength(20)]
        public string num_documento { get; set; }
        [Required(ErrorMessage = "La direccion es obligatoria")]
        [StringLength(70)]
        public string direccion { get; set; }
        [Required(ErrorMessage = "El telefono es obligatorio")]
        [StringLength(20)]
        public string telefono { get; set; }
        [Required(ErrorMessage = "El email es obligatorio")]
        [StringLength(50)]
        public string email { get; set; }
    }
}
