using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MDGIII_WebAPI.Models
{
    public class Detalle_Ingreso
    {
        [Key]
        public int iddetalle_ingreso { get; set; }
        [Required(ErrorMessage = "El idingreso es obligatorio")]
        public int idingreso { get; set; }
        [Required(ErrorMessage = "El idarticulo es obligatorio")]
        public int idarticulo { get; set; }
        [Required(ErrorMessage = "La cantidad es obligatoria")]
        public int cantidad { get; set; }
        [Required(ErrorMessage = "El precio compra es obligatorio")]
        [Column(TypeName = "decimal(11,2)")]
        public decimal precio_compra { get; set; }
        [Required(ErrorMessage = "El precioVenta es obligatorio")]
        [Column(TypeName = "decimal(11,2)")]
        public decimal precio_venta { get; set; }
        [ForeignKey(nameof(idingreso))]
        public Ingreso Ingreso { get; set; }
        [ForeignKey(nameof(idarticulo))]
        public Articulo Articulo { get; set; }
    }
}
