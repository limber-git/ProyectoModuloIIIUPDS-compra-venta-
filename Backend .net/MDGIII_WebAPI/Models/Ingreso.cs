using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MDGIII_WebAPI.Models
{
    public class Ingreso
    {
        [Key]
        public int idingreso { get; set; }
        [Required(ErrorMessage = "El idproveedor es obligatorio")]
        public int idproveedor { get; set; }
        [Required(ErrorMessage = "El idusuario es obligatorio")]
        public int idusuario { get; set; }
        [Required(ErrorMessage = "El tipoComprobante es obligatorio")]
        [StringLength(20, MinimumLength = 5)]
        public string tipo_comprobante { get; set; }
        [Required(ErrorMessage = "La serieComprobante es obligatorio")]
        [StringLength(7, MinimumLength = 4)]
        public string serie_comprobante { get; set; }
        [Required(ErrorMessage = "El numComprobante es obligatorio")]
        [StringLength(10, MinimumLength = 5)]
        public string num_comprobante { get; set; }
        [Required(ErrorMessage = "La fechaHora es obligatorio")]
        [DataType(DataType.DateTime)]
        public DateTime fecha_hora { get; set; }
        [Required(ErrorMessage = "El impuesto es obligatorio")]
        [Column(TypeName = "decimal(4,2)")]
        public decimal impuesto { get; set; }
        [Required(ErrorMessage = "El totalCompra es obligatorio")]
        [Column(TypeName = "decimal(11,2)")]
        public decimal total_compra { get; set; }
        [Required(ErrorMessage = "El estado es obligatorio")]
        [StringLength(20, MinimumLength = 5)]
        public string estado { get; set; }
        [ForeignKey(nameof(idproveedor))]
        public Persona Persona { get; set; }
        [ForeignKey(nameof(idusuario))]
        public Usuario Usuario { get; set; }
    }
}
