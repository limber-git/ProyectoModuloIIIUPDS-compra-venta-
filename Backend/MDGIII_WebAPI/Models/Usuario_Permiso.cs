using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MDGIII_WebAPI.Models
{
    public class Usuario_Permiso
    {
        [Key]
        public int idusuario_permiso { get; set; }
        [Required(ErrorMessage = "El isuduario es obligatorio")]
        public int idusuario { get; set; }
        [ForeignKey(nameof(idusuario))]
        public Usuario Usuario { get; set; }
        [Required(ErrorMessage = "El idpermiso es obligatorio")]
        public int idpermiso { get; set; }
        [ForeignKey(nameof(idpermiso))]
        public Permiso Permiso { get; set; }
    }
}
