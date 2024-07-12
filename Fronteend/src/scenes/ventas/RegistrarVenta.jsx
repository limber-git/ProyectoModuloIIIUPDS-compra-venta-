import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NuevaVenta.css';

const NuevoVenta = ({ onInsert, onClose }) => {
  const [venta, setVenta] = useState({
    idcliente: 0,
    idusuario: 0,
    tipo_comprobante: '',
    serie_comprobante: '',
    num_comprobante: '',
    fecha_hora: '',
    impuesto: 0,
    total_venta: 0,
    estado: '',
    persona: null,
    usuario: null
  });

  const [articulos, setArticulos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [detallesIngreso, setDetallesIngreso] = useState([]);
  const [ultimoPrecioVentas, setUltimoPrecioVentas] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClientes();
    fetchUsuarios();
    fetchArticulos();
    fetchDetallesIngreso();
    actualizarTotalVenta(detalles);
  }, []);

  useEffect(() => {
    // Función para obtener el último precio de venta de un artículo específico
    const obtenerUltimoPrecioVenta = async (idarticulo) => {
      try {
        const response = await axios.get(`https://localhost:7163/api/Detalle_Ingreso/ultimoprecioventa/${idarticulo}`);
        return response.data || 0; // Devuelve 0 si no hay último precio
      } catch (error) {
        console.error('Error al obtener el último precio de venta:', error);
        return 0;
      }
    };
  
    // Función para actualizar los últimos precios de venta de todos los artículos
    const actualizarUltimosPreciosVentas = async () => {
      const nuevosUltimosPrecios = {};
      await Promise.all(
        articulos.map(async (articulo) => {
          const ultimoPrecio = await obtenerUltimoPrecioVenta(articulo.idarticulo);
          nuevosUltimosPrecios[articulo.idarticulo] = ultimoPrecio;
        })
      );
      setUltimoPrecioVentas(nuevosUltimosPrecios);
    };
  
    // Llamar a la función para actualizar los últimos precios de venta cuando se cargue la página
    actualizarUltimosPreciosVentas();
  }, [articulos]); // Asegúrate de que la dependencia esté configurada correctamente
  
  useEffect(() => {
    actualizarTotalVenta(detalles);
  }, [detalles, venta.impuesto]);

  const fetchClientes = () => {
    axios.get('https://localhost:7163/api/Persona')
      .then(response => setClientes(response.data))
      .catch(error => console.error('Error al obtener los clientes:', error));
  };

  const fetchUsuarios = () => {
    axios.get('https://localhost:7163/api/Usuario')
      .then(response => setUsuarios(response.data))
      .catch(error => console.error('Error al obtener los usuarios:', error));
  };

  const fetchArticulos = () => {
    axios.get('https://localhost:7163/api/Articulo')
      .then(response => setArticulos(response.data))
      .catch(error => console.error('Error al obtener los artículos:', error));
  };

  const fetchDetallesIngreso = () => {
    axios.get('https://localhost:7163/api/Detalle_Ingreso')
      .then(response => setDetallesIngreso(response.data))
      .catch(error => console.error('Error al obtener los detalles de ingreso:', error));
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVenta(prevVenta => ({
      ...prevVenta,
      [name]: value,
    }));
  };

  const handleDetalleChange = (index, e) => {
    const { name, value } = e.target;
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index][name] = value;

  // No modificar el precio_venta si ya está establecido manualmente
  if (!nuevosDetalles[index].precio_venta) {
    if (name === 'idarticulo') {
      const idarticulo = value;
      const detalleIngreso = detallesIngreso.find(detalle => detalle.idarticulo === parseInt(idarticulo, 10));
      if (detalleIngreso) {
        nuevosDetalles[index].precio_venta = detalleIngreso.precio_venta;
      }
    }
  }
  
    setDetalles(nuevosDetalles);
    actualizarTotalVenta(nuevosDetalles);
  };

  const actualizarTotalVenta = (detallesActualizados) => {
    const subtotal = detallesActualizados.reduce((total, detalle) => {
      const precioConDescuento = detalle.precio_venta * (1 - (detalle.descuento / 100));
      return total + (parseInt(detalle.cantidad) * precioConDescuento);
    }, 0);
    const totalConImpuesto = subtotal * (1 + parseFloat(venta.impuesto) / 100);
    setVenta(prevVenta => ({
      ...prevVenta,
      total_venta: totalConImpuesto
    }));
  };

  const addDetalle = () => {
    setDetalles([...detalles, { idarticulo: '', cantidad: 0, precio_venta: 0, descuento: 0 }]);
  };

  const removeDetalle = (index) => {
    const nuevosDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(nuevosDetalles);
    actualizarTotalVenta(nuevosDetalles);
  };

  const handleArticuloChange = (index, e) => {
    const { value } = e.target;
    const articuloSeleccionado = articulos.find(articulo => articulo.idarticulo === parseInt(value, 10));
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index].idarticulo = value;
    nuevosDetalles[index].stock = articuloSeleccionado ? articuloSeleccionado.stock : 0;
  
    // Actualizar el precio de venta según el artículo seleccionado
    nuevosDetalles[index].precio_venta = ultimoPrecioVentas[value] || 0;
  
    setDetalles(nuevosDetalles);
    actualizarTotalVenta(nuevosDetalles); // Asegúrate de que se actualice el total de la venta aquí si es necesario
  };
  
  
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica para asegurarse de que los campos obligatorios estén completos
    if (!venta.idcliente || !venta.idusuario || !venta.tipo_comprobante || !venta.serie_comprobante
      || !venta.num_comprobante || !venta.fecha_hora || !venta.impuesto || !venta.total_venta || !venta.estado) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const nuevaVenta = {
      ...venta,
      idcliente: parseInt(venta.idcliente, 10),
      idusuario: parseInt(venta.idusuario, 10),
      impuesto: parseFloat(venta.impuesto),
      total_venta: parseFloat(venta.total_venta),
      fecha_hora: new Date(venta.fecha_hora).toISOString(),
      persona: {
        idpersona: parseInt(venta.idcliente, 10),
        tipo_persona: clientes.find(cliente => cliente.idpersona === parseInt(venta.idcliente, 10)).tipo_persona,
        nombre: clientes.find(cliente => cliente.idpersona === parseInt(venta.idcliente, 10)).nombre,
        tipo_documento: clientes.find(cliente => cliente.idpersona === parseInt(venta.idcliente, 10)).tipo_documento,
        num_documento: clientes.find(cliente => cliente.idpersona === parseInt(venta.idcliente, 10)).num_documento,
        direccion: clientes.find(cliente => cliente.idpersona === parseInt(venta.idcliente, 10)).direccion,
        telefono: clientes.find(cliente => cliente.idpersona === parseInt(venta.idcliente, 10)).telefono,
        email: clientes.find(cliente => cliente.idpersona === parseInt(venta.idcliente, 10)).email,
      },
      usuario: {
        idusuario: parseInt(venta.idusuario, 10),
        nombre: usuarios.find(usuario => usuario.idusuario === parseInt(venta.idusuario, 10)).nombre,
        tipo_documento: usuarios.find(usuario => usuario.idusuario === parseInt(venta.idusuario, 10)).tipo_documento,
        num_documento: usuarios.find(usuario => usuario.idusuario === parseInt(venta.idusuario, 10)).num_documento,
        direccion: usuarios.find(usuario => usuario.idusuario === parseInt(venta.idusuario, 10)).direccion,
        telefono: usuarios.find(usuario => usuario.idusuario === parseInt(venta.idusuario, 10)).telefono,
        email: usuarios.find(usuario => usuario.idusuario === parseInt(venta.idusuario, 10)).email,
        cargo: usuarios.find(usuario => usuario.idusuario === parseInt(venta.idusuario, 10)).cargo,
        login: usuarios.find(usuario => usuario.idusuario === parseInt(venta.idusuario, 10)).login,
        clave: usuarios.find(usuario => usuario.idusuario === parseInt(venta.idusuario, 10)).clave,
        condicion: usuarios.find(usuario => usuario.idusuario === parseInt(venta.idusuario, 10)).condicion,
      }
    };

    axios.post('https://localhost:7163/api/Venta', nuevaVenta)
      .then(response => {
        const idVenta = response.data.idventa;
        console.log(nuevaVenta);
        // Insertar los detalles de la venta
        const detallesConIdVenta = detalles.map(detalle => {
          const ventaCliente = clientes.find(cliente => cliente.idpersona === parseInt(venta.idcliente, 10));
          const ventaUsuario = usuarios.find(usuario => usuario.idusuario === parseInt(venta.idusuario, 10));
          const articulo = articulos.find(articulo => articulo.idarticulo === parseInt(detalle.idarticulo, 10));

          return {
            ...detalle,
            idventa: idVenta,
            idarticulo: parseInt(detalle.idarticulo, 10),
            cantidad: parseInt(detalle.cantidad, 10),
            precio_venta: parseFloat(detalle.precio_venta),
            descuento: parseFloat(detalle.descuento),
            venta: {
              idventa: idVenta,
              idcliente: parseInt(venta.idcliente, 10),
              idusuario: parseInt(venta.idusuario, 10),
              tipo_comprobante: venta.tipo_comprobante,
              serie_comprobante: venta.serie_comprobante,
              num_comprobante: venta.num_comprobante,
              fecha_hora: venta.fecha_hora,
              impuesto: parseFloat(venta.impuesto),
              total_venta: parseFloat(venta.total_venta),
              estado: venta.estado,
              persona: {
                idpersona: parseInt(venta.idcliente, 10),
                tipo_persona: ventaCliente.tipo_persona,
                nombre: ventaCliente.nombre,
                tipo_documento: ventaCliente.tipo_documento,
                num_documento: ventaCliente.num_documento,
                direccion: ventaCliente.direccion,
                telefono: ventaCliente.telefono,
                email: ventaCliente.email,
              },
              usuario: {
                idusuario: parseInt(venta.idusuario, 10),
                nombre: ventaUsuario.nombre,
                tipo_documento: ventaUsuario.tipo_documento,
                num_documento: ventaUsuario.num_documento,
                direccion: ventaUsuario.direccion,
                telefono: ventaUsuario.telefono,
                email: ventaUsuario.email,
                cargo: ventaUsuario.cargo,
                login: ventaUsuario.login,
                clave: ventaUsuario.clave,
                condicion: ventaUsuario.condicion,
              }
            },
            articulo: {
              idarticulo: parseInt(detalle.idarticulo),
              idcategoria: articulo.idcategoria,
              codigo: articulo.codigo,
              nombre: articulo.nombre,
              stock: articulo.stock,
              descripcion: articulo.descripcion,
              imagen: articulo.imagen,
              condicion: articulo.condicion,
              categorias: {
                idcategoria: articulo.categorias.idcategoria,
                nombre: articulo.categorias.nombre,
                descripcion: articulo.categorias.descripcion,
                condicion: articulo.categorias.condicion
              }
            }
          };
        });

        axios.post('https://localhost:7163/api/Detalle_Venta', detallesConIdVenta)
          .then(resDetalle => {
            onInsert(response.data);
            alert('Venta y detalles insertados exitosamente');
            console.log(detallesConIdVenta);
          })
          .catch(errorDetalle => {
            console.log(detallesConIdVenta);
            console.error('Error al insertar los detalles de la venta:', errorDetalle.response ? errorDetalle.response.data : errorDetalle.message);
            setError('Hubo un error al insertar los detalles de la venta');
            setError(errorDetalle.response ? errorDetalle.response.data : errorDetalle.message);
          });
      })
      .catch(error => {
        console.log(nuevaVenta);
        console.error('Error al insertar la venta:', error.response ? error.response.data : error.message);
        setError('Hubo un error al insertar la venta');
      });
  };

  return (
    <div className="nuevo-venta-modal">
      <div className="nuevo-venta-content">
        <h2>Nueva Venta</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label>
              Cliente:
              <select
                className="form-control"
                name="idcliente"
                value={venta.idcliente}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.idpersona} value={cliente.idpersona}>{cliente.nombre}</option>
                ))}
              </select>
            </label>
            <label>
              Usuario:
              <select
                className="form-control"
                name="idusuario"
                value={venta.idusuario}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar usuario</option>
                {usuarios.map(usuario => (
                  <option key={usuario.idusuario} value={usuario.idusuario}>{usuario.nombre}</option>
                ))}
              </select>
            </label>
            <label>
              Tipo de Comprobante:
              <input
                type="text"
                className="form-control"
                name="tipo_comprobante"
                value={venta.tipo_comprobante}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Serie de Comprobante:
              <input
                type="text"
                className="form-control"
                name="serie_comprobante"
                value={venta.serie_comprobante}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div className="form-section">
            <label>
              Número de Comprobante:
              <input
                type="text"
                className="form-control"
                name="num_comprobante"
                value={venta.num_comprobante}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Fecha y Hora:
              <input
                type="datetime-local"
                className="form-control"
                name="fecha_hora"
                value={venta.fecha_hora}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Impuesto (%):
              <input
                type="number"
                step="0.01"
                className="form-control"
                name="impuesto"
                value={venta.impuesto}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Total Venta:
              <input
                type="number"
                step="0.01"
                className="form-control"
                name="total_venta"
                value={venta.total_venta}
                readOnly
              />
            </label>
            <label>
              Estado:
              <input
                type="text"
                className="form-control"
                name="estado"
                value={venta.estado}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <h3>Detalles de Venta</h3>
          {detalles.map((detalle, index) => (
            <div key={index} className="detalle-venta">
              <label>
                Artículo:
                <select
                  className="form-control"
                  name="idarticulo"
                  value={detalle.idarticulo}
                  onChange={(e) => handleArticuloChange(index, e)}
                  required
                >
                  <option value="">Seleccionar artículo</option>
                  {articulos.map(articulo => (
                    <option key={articulo.idarticulo} value={articulo.idarticulo}>{articulo.nombre}</option>
                  ))}
                </select>
              </label>
              <label>Stock:
                <input
                  type="number"
                  value={detalle.stock}
                  readOnly
                />
              </label>
              <label>
                Cantidad:
                <input
                  type="number"
                  className="form-control"
                  name="cantidad"
                  value={detalle.cantidad}
                  onChange={(e) => handleDetalleChange(index, e)}
                  required
                />
              </label>
              <label>
                Precio Venta:
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  name="precio_venta"
                  value={detalle.precio_venta || ultimoPrecioVentas[detalle.idarticulo] || 0}
                  onChange={(e) => handleDetalleChange(index, e)}
                  required
                  readOnly
                />
              </label>
              <label>
                Descuento:
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  name="descuento"
                  value={detalle.descuento}
                  onChange={(e) => handleDetalleChange(index, e)}
                  required
                />
              </label>
              <label>
                Subtotal:
                <input type="number" step="0.01" value={(detalle.cantidad * detalle.precio_venta).toFixed(2)} readOnly />
              </label>
              <button type="button" onClick={() => removeDetalle(index)}>Eliminar</button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={addDetalle}>Agregar Detalle</button>

          {error && <p className="error">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-success">Guardar</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoVenta;
