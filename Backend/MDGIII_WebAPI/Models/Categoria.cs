using System.ComponentModel.DataAnnotations;

namespace MDGIII_WebAPI.Models
{
    public class Categoria
    {
        [Key]
        public int idcategoria { get; set; }
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(50)]
        public string nombre { get; set; }
        [Required(ErrorMessage = "La descripcion es obligatoria")]
        [StringLength(256)]
        public string descripcion { get; set; }
        [Required(ErrorMessage = "La condicion es obligatoria")]
        public bool condicion { get; set; }
    }
}
