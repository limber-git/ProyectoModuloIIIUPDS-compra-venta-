using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace MDGIII_WebAPI.Models
{
    public class Articulo
    {
        [Key]
        public int idarticulo { get; set; }
        [Required(ErrorMessage = "El idcategoria es obligatorio")]
        public int idcategoria { get; set; }
        [Required(ErrorMessage = "El codigo es obligatorio")]
        [StringLength(50, MinimumLength = 5)]
        public string codigo { get; set; }
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(100, MinimumLength = 5)]
        public string nombre { get; set; }
        [Required(ErrorMessage = "El stock es obligatorio")]
        public int stock { get; set; }
        [Required(ErrorMessage = "La descripcion es obligatoria")]
        [StringLength(512, MinimumLength = 10)]
        public string descripcion { get; set; }
        [Required(ErrorMessage = "La imagen es obligatoria")]
        [StringLength(50, MinimumLength = 45)]
        public string imagen { get; set; }
        [Required(ErrorMessage = "La condicion es obligatoria")]
        public bool condicion { get; set; }
        [ForeignKey(nameof(idcategoria))]
        public Categoria categorias { get; set; }
    }
}
