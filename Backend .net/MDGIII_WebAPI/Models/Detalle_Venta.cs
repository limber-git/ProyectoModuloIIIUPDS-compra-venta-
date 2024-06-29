using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MDGIII_WebAPI.Models
{
    public class Detalle_Venta
    {
        [Key]
        public int iddetalle_venta { get; set; }
        [Required(ErrorMessage = "El idArticulo es obligatorio")]
        public int idarticulo { get; set; }
        [ForeignKey(nameof(idarticulo))]
        public Articulo Articulo { get; set; }
        [Required(ErrorMessage = "El idVenta es obligatorio")]
        public int idventa { get; set; }
        [ForeignKey(nameof(idventa))]
        public Venta Venta { get; set; }
        [Required(ErrorMessage = "La cantidad es obligatoria")]
        public int cantidad { get; set; }
        [Required(ErrorMessage = "El precioVenta es obligatorio")]
        [Column(TypeName = "decimal(11,2)")]
        public decimal precio_venta { get; set; }
        [Required(ErrorMessage = "El descuento es obligatorio")]
        [Column(TypeName = "decimal(11,2)")]
        public decimal descuento { get; set; }
    }
}
