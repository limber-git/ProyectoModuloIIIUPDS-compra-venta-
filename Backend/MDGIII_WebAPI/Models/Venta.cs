using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MDGIII_WebAPI.Models
{
    public class Venta
    {
        [Key]
        public int idventa { get; set; }
        [Required(ErrorMessage = "El idCliente es obligatorio")]
        public int idcliente { get; set; }
        [ForeignKey(nameof(idcliente))]
        public Persona Persona { get; set; }
        [Required(ErrorMessage = "El idUsuario es obligatorio")]
        public int idusuario { get; set; }
        [ForeignKey(nameof(idusuario))]
        public Usuario Usuario { get; set; }
        [Required(ErrorMessage = "El tipoComprobante es obligatorio")]
        [StringLength(20)]
        public string tipo_comprobante { get; set; }
        [Required(ErrorMessage = "La serieComprobante es obligatorio")]
        [StringLength(7)]
        public string serie_comprobante { get; set; }
        [Required(ErrorMessage = "El numComprobante es obligatorio")]
        [StringLength(10)]
        public string num_comprobante { get; set; }
        [Required(ErrorMessage = "La fechaHora es obligatorio")]
        [DataType(DataType.DateTime)]
        public DateTime fecha_hora { get; set; }
        [Required(ErrorMessage = "El impuesto es obligatorio")]
        [Column(TypeName = "decimal(4,2)")]
        public decimal impuesto { get; set; }
        [Required(ErrorMessage = "El totalVenta es obligatorio")]
        [Column(TypeName = "decimal(11,2)")]
        public decimal total_venta { get; set; }
        [Required(ErrorMessage = "El estado es obligatorio")]
        [StringLength(20)]
        public string estado { get; set; }
    }
}
