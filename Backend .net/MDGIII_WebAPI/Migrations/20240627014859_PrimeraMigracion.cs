using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MDGIII_WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class PrimeraMigracion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "categorias",
                columns: table => new
                {
                    idcategoria = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    condicion = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categorias", x => x.idcategoria);
                });

            migrationBuilder.CreateTable(
                name: "permisos",
                columns: table => new
                {
                    idpermiso = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_permisos", x => x.idpermiso);
                });

            migrationBuilder.CreateTable(
                name: "personas",
                columns: table => new
                {
                    idpersona = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tipo_persona = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    tipo_documento = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    num_documento = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    direccion = table.Column<string>(type: "nvarchar(70)", maxLength: 70, nullable: false),
                    telefono = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    email = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_personas", x => x.idpersona);
                });

            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    idusuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    tipo_documento = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    num_documento = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    direccion = table.Column<string>(type: "nvarchar(70)", maxLength: 70, nullable: false),
                    telefono = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    email = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    cargo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    login = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    clave = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    condicion = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usuarios", x => x.idusuario);
                });

            migrationBuilder.CreateTable(
                name: "articulos",
                columns: table => new
                {
                    idarticulo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idcategoria = table.Column<int>(type: "int", nullable: false),
                    codigo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    stock = table.Column<int>(type: "int", nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: false),
                    imagen = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    condicion = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_articulos", x => x.idarticulo);
                    table.ForeignKey(
                        name: "FK_articulos_categorias_idcategoria",
                        column: x => x.idcategoria,
                        principalTable: "categorias",
                        principalColumn: "idcategoria",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ingresos",
                columns: table => new
                {
                    idingreso = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idproveedor = table.Column<int>(type: "int", nullable: false),
                    idusuario = table.Column<int>(type: "int", nullable: false),
                    tipo_comprobante = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    serie_comprobante = table.Column<string>(type: "nvarchar(7)", maxLength: 7, nullable: false),
                    num_comprobante = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    fecha_hora = table.Column<DateTime>(type: "datetime2", nullable: false),
                    impuesto = table.Column<decimal>(type: "decimal(4,2)", nullable: false),
                    total_compra = table.Column<decimal>(type: "decimal(11,2)", nullable: false),
                    estado = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ingresos", x => x.idingreso);
                    table.ForeignKey(
                        name: "FK_ingresos_personas_idproveedor",
                        column: x => x.idproveedor,
                        principalTable: "personas",
                        principalColumn: "idpersona",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ingresos_usuarios_idusuario",
                        column: x => x.idusuario,
                        principalTable: "usuarios",
                        principalColumn: "idusuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "usuario_permisos",
                columns: table => new
                {
                    idusuario_permiso = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idusuario = table.Column<int>(type: "int", nullable: false),
                    idpermiso = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usuario_permisos", x => x.idusuario_permiso);
                    table.ForeignKey(
                        name: "FK_usuario_permisos_permisos_idpermiso",
                        column: x => x.idpermiso,
                        principalTable: "permisos",
                        principalColumn: "idpermiso",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_usuario_permisos_usuarios_idusuario",
                        column: x => x.idusuario,
                        principalTable: "usuarios",
                        principalColumn: "idusuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ventas",
                columns: table => new
                {
                    idventa = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idcliente = table.Column<int>(type: "int", nullable: false),
                    idusuario = table.Column<int>(type: "int", nullable: false),
                    tipo_comprobante = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    serie_comprobante = table.Column<string>(type: "nvarchar(7)", maxLength: 7, nullable: false),
                    num_comprobante = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    fecha_hora = table.Column<DateTime>(type: "datetime2", nullable: false),
                    impuesto = table.Column<decimal>(type: "decimal(4,2)", nullable: false),
                    total_venta = table.Column<decimal>(type: "decimal(11,2)", nullable: false),
                    estado = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ventas", x => x.idventa);
                    table.ForeignKey(
                        name: "FK_ventas_personas_idcliente",
                        column: x => x.idcliente,
                        principalTable: "personas",
                        principalColumn: "idpersona",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ventas_usuarios_idusuario",
                        column: x => x.idusuario,
                        principalTable: "usuarios",
                        principalColumn: "idusuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "detalle_ingresos",
                columns: table => new
                {
                    iddetalle_ingreso = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idingreso = table.Column<int>(type: "int", nullable: false),
                    idarticulo = table.Column<int>(type: "int", nullable: false),
                    cantidad = table.Column<int>(type: "int", nullable: false),
                    precio_compra = table.Column<decimal>(type: "decimal(11,2)", nullable: false),
                    precio_venta = table.Column<decimal>(type: "decimal(11,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_detalle_ingresos", x => x.iddetalle_ingreso);
                    table.ForeignKey(
                        name: "FK_detalle_ingresos_articulos_idarticulo",
                        column: x => x.idarticulo,
                        principalTable: "articulos",
                        principalColumn: "idarticulo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_detalle_ingresos_ingresos_idingreso",
                        column: x => x.idingreso,
                        principalTable: "ingresos",
                        principalColumn: "idingreso",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "detalle_ventas",
                columns: table => new
                {
                    iddetalle_venta = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idarticulo = table.Column<int>(type: "int", nullable: false),
                    idventa = table.Column<int>(type: "int", nullable: false),
                    cantidad = table.Column<int>(type: "int", nullable: false),
                    precio_venta = table.Column<decimal>(type: "decimal(11,2)", nullable: false),
                    descuento = table.Column<decimal>(type: "decimal(11,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_detalle_ventas", x => x.iddetalle_venta);
                    table.ForeignKey(
                        name: "FK_detalle_ventas_articulos_idarticulo",
                        column: x => x.idarticulo,
                        principalTable: "articulos",
                        principalColumn: "idarticulo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_detalle_ventas_ventas_idventa",
                        column: x => x.idventa,
                        principalTable: "ventas",
                        principalColumn: "idventa",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_articulos_idcategoria",
                table: "articulos",
                column: "idcategoria");

            migrationBuilder.CreateIndex(
                name: "IX_detalle_ingresos_idarticulo",
                table: "detalle_ingresos",
                column: "idarticulo");

            migrationBuilder.CreateIndex(
                name: "IX_detalle_ingresos_idingreso",
                table: "detalle_ingresos",
                column: "idingreso");

            migrationBuilder.CreateIndex(
                name: "IX_detalle_ventas_idarticulo",
                table: "detalle_ventas",
                column: "idarticulo");

            migrationBuilder.CreateIndex(
                name: "IX_detalle_ventas_idventa",
                table: "detalle_ventas",
                column: "idventa");

            migrationBuilder.CreateIndex(
                name: "IX_ingresos_idproveedor",
                table: "ingresos",
                column: "idproveedor");

            migrationBuilder.CreateIndex(
                name: "IX_ingresos_idusuario",
                table: "ingresos",
                column: "idusuario");

            migrationBuilder.CreateIndex(
                name: "IX_usuario_permisos_idpermiso",
                table: "usuario_permisos",
                column: "idpermiso");

            migrationBuilder.CreateIndex(
                name: "IX_usuario_permisos_idusuario",
                table: "usuario_permisos",
                column: "idusuario");

            migrationBuilder.CreateIndex(
                name: "IX_ventas_idcliente",
                table: "ventas",
                column: "idcliente");

            migrationBuilder.CreateIndex(
                name: "IX_ventas_idusuario",
                table: "ventas",
                column: "idusuario");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "detalle_ingresos");

            migrationBuilder.DropTable(
                name: "detalle_ventas");

            migrationBuilder.DropTable(
                name: "usuario_permisos");

            migrationBuilder.DropTable(
                name: "ingresos");

            migrationBuilder.DropTable(
                name: "articulos");

            migrationBuilder.DropTable(
                name: "ventas");

            migrationBuilder.DropTable(
                name: "permisos");

            migrationBuilder.DropTable(
                name: "categorias");

            migrationBuilder.DropTable(
                name: "personas");

            migrationBuilder.DropTable(
                name: "usuarios");
        }
    }
}
