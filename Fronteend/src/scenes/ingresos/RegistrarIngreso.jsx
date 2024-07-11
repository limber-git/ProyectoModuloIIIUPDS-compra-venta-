import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NuevoIngreso.css';

const NuevoIngreso = ({ onInsert, onClose }) => {
  const [ingreso, setIngreso] = useState({
    idproveedor: 0,
    idusuario: 0,
    tipo_comprobante: '',
    serie_comprobante: '',
    num_comprobante: '',
    fecha_hora: '',
    impuesto: 0,
    total_compra: 0,
    estado: '',
    persona: null,
    usuario: null
  });

  const [articulos, setArticulos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProveedores();
    fetchUsuarios();
    fetchArticulos();
  }, []);

  useEffect(() => {
    actualizarTotalIngreso(detalles);
  }, [detalles, ingreso.impuesto]);

  const fetchProveedores = () => {
    axios.get('https://localhost:7163/api/Persona')
      .then(response => setProveedores(response.data))
      .catch(error => console.error('Error al obtener los proveedores:', error));
  };

  const fetchUsuarios = () => {
    axios.get('https://localhost:7163/api/Usuario')
      .then(response => setUsuarios(response.data))
      .catch(error => console.error('Error al obtener los usuarios:', error));
  };

  const fetchArticulos = () => {
    axios.get('https://localhost:7163/api/Articulo')
      .then(response => setArticulos(response.data))
      .catch(error => console.error('Error al obtener los articulos:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIngreso(prevIngreso => ({
      ...prevIngreso,
      [name]: value,
    }));
  };

  const handleDetalleChange = (index, e) => {
    const { name, value } = e.target;
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index][name] = value;
    setDetalles(nuevosDetalles);
    actualizarTotalIngreso(nuevosDetalles);
  };

  const actualizarTotalIngreso = (detallesActualizados) => {
    const subtotal = detallesActualizados.reduce((total, detalle) => {
      return total + (parseInt(detalle.cantidad) * parseFloat(detalle.precio_compra));
    }, 0);
    const totalConImpuesto = subtotal * (1 + parseFloat(ingreso.impuesto) / 100);
    setIngreso(prevIngreso => ({
      ...prevIngreso,
      total_compra: totalConImpuesto
    }));
  };  

  const addDetalle = () => {
    setDetalles([...detalles, { idarticulo: '', cantidad: 0, precio_compra: 0, precio_venta: 0 }]);
  };

  const removeDetalle = (index) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles.splice(index, 1);
    setDetalles(nuevosDetalles);
    actualizarTotalIngreso(nuevosDetalles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica para asegurarse de que los campos obligatorios estén completos
    if (!ingreso.idproveedor || !ingreso.idusuario || !ingreso.tipo_comprobante || !ingreso.serie_comprobante
      || !ingreso.num_comprobante || !ingreso.fecha_hora || !ingreso.impuesto || !ingreso.total_compra || !ingreso.estado) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const nuevoIngreso = {
      ...ingreso,
      idproveedor: parseInt(ingreso.idproveedor, 10),
      idusuario: parseInt(ingreso.idusuario, 10),
      impuesto: parseFloat(ingreso.impuesto),
      total_compra: parseFloat(ingreso.total_compra),
      fecha_hora: new Date(ingreso.fecha_hora).toISOString(),
      persona: {
        idpersona: parseInt(ingreso.idproveedor, 10),
        tipo_persona: proveedores.find(proveedor => proveedor.idpersona === parseInt(ingreso.idproveedor, 10)).tipo_persona,
        nombre: proveedores.find(proveedor => proveedor.idpersona === parseInt(ingreso.idproveedor, 10)).nombre,
        tipo_documento: proveedores.find(proveedor => proveedor.idpersona === parseInt(ingreso.idproveedor, 10)).tipo_documento,
        num_documento: proveedores.find(proveedor => proveedor.idpersona === parseInt(ingreso.idproveedor, 10)).num_documento,
        direccion: proveedores.find(proveedor => proveedor.idpersona === parseInt(ingreso.idproveedor, 10)).direccion,
        telefono: proveedores.find(proveedor => proveedor.idpersona === parseInt(ingreso.idproveedor, 10)).telefono,
        email: proveedores.find(proveedor => proveedor.idpersona === parseInt(ingreso.idproveedor, 10)).email,
      },
      usuario: {
        idusuario: parseInt(ingreso.idusuario, 10),
        nombre: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).nombre,
        tipo_documento: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).tipo_documento,
        num_documento: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).num_documento,
        direccion: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).direccion,
        telefono: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).telefono,
        email: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).email,
        cargo: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).cargo,
        login: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).login,
        clave: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).clave,
        condicion: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).condicion,
      }
    };

    axios.post('https://localhost:7163/api/Ingreso', nuevoIngreso)
      .then(response => {
        const idIngreso = response.data.idingreso;
        console.log(idIngreso);
        // Insertar los detalles del ingreso
        const detallesConIdIngreso = detalles.map(detalle => {
          const articulo = articulos.find(art => art.idarticulo === parseInt(detalle.idarticulo, 10));
        
          return {
            ...detalle,
            idingreso: idIngreso,
            idarticulo: parseInt(detalle.idarticulo, 10),
            cantidad: parseInt(detalle.cantidad, 10),
            precio_compra: parseFloat(detalle.precio_compra),
            precio_venta: parseFloat(detalle.precio_venta),
            ingreso: {
              idingreso: idIngreso,
              idproveedor: parseInt(ingreso.idproveedor, 10),
              idusuario: parseInt(ingreso.idusuario, 10),
              tipo_comprobante: ingreso.tipo_comprobante,
              serie_comprobante: ingreso.serie_comprobante,
              num_comprobante: ingreso.num_comprobante,
              fecha_hora: ingreso.fecha_hora,
              impuesto: parseFloat(ingreso.impuesto),
              total_compra: parseFloat(ingreso.total_compra),
              estado: ingreso.estado,
              persona: {
                idpersona: parseInt(ingreso.idproveedor, 10),
                tipo_persona: proveedores.find(proveedor => proveedor.idpersona === parseInt(ingreso.idproveedor, 10)).tipo_persona,
                nombre: proveedores.find(proveedor => proveedor.idpersona === parseInt(ingreso.idproveedor, 10)).nombre,
                tipo_documento: proveedores.find(proveedor => proveedor.idpersona === parseInt(ingreso.idproveedor, 10)).tipo_documento,
                num_documento: proveedores.find(proveedor => proveedor.idpersona === parseInt(ingreso.idproveedor, 10)).num_documento,
                direccion: proveedores.find(proveedor => proveedor.idpersona === parseInt(ingreso.idproveedor, 10)).direccion,
                telefono: proveedores.find(proveedor => proveedor.idpersona === parseInt(ingreso.idproveedor, 10)).telefono,
                email: proveedores.find(proveedor => proveedor.idpersona === parseInt(ingreso.idproveedor, 10)).email,
              },
              usuario: {
                idusuario: parseInt(ingreso.idusuario, 10),
                nombre: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).nombre,
                tipo_documento: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).tipo_documento,
                num_documento: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).num_documento,
                direccion: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).direccion,
                telefono: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).telefono,
                email: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).email,
                cargo: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).cargo,
                login: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).login,
                clave: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).clave,
                condicion: usuarios.find(usuario => usuario.idusuario === parseInt(ingreso.idusuario, 10)).condicion,
              }
            },
            articulo: {
              idarticulo: articulo.idarticulo,
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

        axios.post('https://localhost:7163/api/Detalle_Ingreso', detallesConIdIngreso)
          .then(resDetalle => {
            onInsert(response.data);
            alert('Ingreso y detalles insertados exitosamente');
            console.log(detallesConIdIngreso);
          })
          .catch(errorDetalle => {
            console.log(detallesConIdIngreso);
            console.error('Error al insertar los detalles del ingreso:', errorDetalle.response ? errorDetalle.response.data : errorDetalle.message);
            setError('Hubo un error al insertar los detalles del ingreso. Por favor, inténtelo de nuevo.');
          });
      })
      .catch(error => {
        console.error('Error al insertar el ingreso:', error.response ? error.response.data : error.message);
        if (error.response && error.response.data && error.response.data.errors) {
          const errors = error.response.data.errors;
          let errorMessage = 'Errores de validación:';
          for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
              errorMessage += `\n${key}: ${errors[key].join(', ')}`;
            }
          }
          setError(errorMessage);
        } else {
          setError('Hubo un error al insertar el ingreso. Por favor, inténtelo de nuevo.');
        }
      });
  };

  return (
    <div className="nuevo-ingreso-modal">
      <div className="nuevo-ingreso-content">
        <h2>Nuevo Ingreso</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label>
              Proveedor:
              <select name="idproveedor" value={ingreso.idproveedor} onChange={handleInputChange} required>
                <option value="">Seleccione un proveedor</option>
                {proveedores.map(proveedor => (
                  <option key={proveedor.idpersona} value={proveedor.idpersona}>{proveedor.nombre}</option>
                ))}
              </select>
            </label>
            <label>
              Usuario:
              <select name="idusuario" value={ingreso.idusuario} onChange={handleInputChange} required>
                <option value="">Seleccione un usuario</option>
                {usuarios.map(usuario => (
                  <option key={usuario.idusuario} value={usuario.idusuario}>{usuario.nombre}</option>
                ))}
              </select>
            </label>
            <label>
              Tipo de Comprobante:
              <input type="text" name="tipo_comprobante" value={ingreso.tipo_comprobante} onChange={handleInputChange} required />
            </label>
            <label>
              Serie de Comprobante:
              <input type="text" name="serie_comprobante" value={ingreso.serie_comprobante} onChange={handleInputChange} required />
            </label>
          </div>
          <div className="form-section">
            <label>
              Número de Comprobante:
              <input type="text" name="num_comprobante" value={ingreso.num_comprobante} onChange={handleInputChange} required />
            </label>
            <label>
              Fecha y Hora:
              <input type="datetime-local" name="fecha_hora" value={ingreso.fecha_hora} onChange={handleInputChange} required />
            </label>
            <label>
              Impuesto:
              <input type="number" step="0.01" name="impuesto" value={ingreso.impuesto} onChange={handleInputChange} required />
            </label>
            <label>
              Total Ingreso:
              <input type="number" step="0.01" name="total_compra" value={ingreso.total_compra} onChange={handleInputChange} required readOnly />
            </label>
            <label>
              Estado:
              <input type="text" name="estado" value={ingreso.estado} onChange={handleInputChange} required />
            </label>
          </div>

          <h3>Detalles del Ingreso</h3>
          {detalles.map((detalle, index) => (
            <div key={index} className="detalle-ingreso">
              <label>
                Artículo:
                <select name="idarticulo" value={detalle.idarticulo} onChange={(e) => handleDetalleChange(index, e)} required>
                  <option value="">Seleccione un artículo</option>
                  {articulos.map(articulo => (
                    <option key={articulo.idarticulo} value={articulo.idarticulo}>{articulo.nombre}</option>
                  ))}
                </select>
              </label>
              <label>
                Cantidad:
                <input type="number" name="cantidad" value={detalle.cantidad} onChange={(e) => handleDetalleChange(index, e)} required />
              </label>
              <label>
                Precio de Compra:
                <input type="number" step="0.01" name="precio_compra" value={detalle.precio_compra} onChange={(e) => handleDetalleChange(index, e)} required />
              </label>
              <label>
                Precio de Venta:
                <input type="number" step="0.01" name="precio_venta" value={detalle.precio_venta} onChange={(e) => handleDetalleChange(index, e)} required />
              </label>
              <label>
                Subtotal:
                <input type="number" step="0.01" value={(detalle.cantidad * detalle.precio_compra).toFixed(2)} readOnly />
              </label>
              <button type="button" className="btn btn-danger" onClick={() => removeDetalle(index)}>Eliminar</button>
            </div>
          ))}
          <button type="button" onClick={addDetalle}>Agregar Detalle</button>
          {error && <p className="error">{error}</p>}
          <div className="form-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoIngreso;
