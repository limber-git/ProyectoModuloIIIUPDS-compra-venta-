using System.ComponentModel.DataAnnotations;

namespace MDGIII_WebAPI.Models
{
    public class Permiso
    {
        [Key]
        public int idpermiso { get; set; }
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(30, MinimumLength = 5)]
        public string nombre { get; set; }
    }
}
