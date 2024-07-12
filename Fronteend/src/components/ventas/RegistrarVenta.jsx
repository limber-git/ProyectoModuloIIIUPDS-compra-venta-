import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NuevaVenta.css';

const NuevaVenta = ({ onInsert, onClose }) => {
  const [venta, setVenta] = useState({
    idcliente: 0,
    persona: {
      idpersona: 0,
      tipo_persona: '',
      nombre: '',
      tipo_documento: '',
      num_documento: '',
      direccion: '',
      telefono: '',
      email: '',
    },
    idusuario: 0,
    usuario: {
      idusuario: 0,
      nombre: '',
      tipo_documento: '',
      num_documento: '',
      direccion: '',
      telefono: '',
      email: '',
      cargo: '',
      login: '',
      clave: '',
      condicion: true,
    },
    tipo_comprobante: '',
    serie_comprobante: '',
    num_comprobante: '',
    fecha_hora: '',
    impuesto: 0,
    total_venta: 0,
    estado: ''
     
  });
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClientes();
    fetchUsuarios();
  }, []);

  const fetchClientes = () => {
    axios.get('https://localhost:7163/api/Persona')
      .then(response => setClientes(response.data))
      .catch(error => console.error('Error al obtener los clientes:', error));
  };

  const fetchUsuarios = () => {
    axios.get('https://localhost:7163/api/Usuario')
      .then(response => setUsuarios(response.data))
      .catch(error => console.error('Error al obtener los usuarios:', error));
  };x

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVenta(prevVenta => ({
      ...prevVenta,
      [name]: value,
    }));
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

    console.log('Datos de la venta antes de enviar:', nuevaVenta);

    axios.post('https://localhost:7163/api/Venta', nuevaVenta)
    .then(response => {
      console.log('Venta insertada:', response.data);
      onInsert(response.data);
      alert('Venta insertada exitosamente');
    })
      .catch(error => {
        console.log(NuevaVenta);
        console.error('Error al insertar la venta:', error.response ? error.response.data : error.message);
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
          setError('Hubo un error al insertar la venta. Por favor, inténtelo de nuevo.');
        }
      });
  };

  return (
    <div className="nueva-venta-modal">
      <div className="nueva-venta-content">
        <h2>Nueva Venta</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Cliente:
            <select name="idcliente" value={venta.idcliente} onChange={handleInputChange} required>
              <option value="">Seleccione un cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.idpersona} value={cliente.idpersona}>{cliente.nombre}</option>
              ))}
            </select>
          </label>
          <label>
            Usuario:
            <select name="idusuario" value={venta.idusuario} onChange={handleInputChange} required>
              <option value="">Seleccione un usuario</option>
              {usuarios.map(usuario => (
                <option key={usuario.idusuario} value={usuario.idusuario}>{usuario.nombre}</option>
              ))}
            </select>
          </label>
          <label>
            Tipo de Comprobante:
            <input type="text" name="tipo_comprobante" value={venta.tipo_comprobante} onChange={handleInputChange} required />
          </label>
          <label>
            Serie de Comprobante:
            <input type="text" name="serie_comprobante" value={venta.serie_comprobante} onChange={handleInputChange} required />
          </label>
          <label>
            Número de Comprobante:
            <input type="text" name="num_comprobante" value={venta.num_comprobante} onChange={handleInputChange} required />
          </label>
          <label>
            Fecha y Hora:
            <input type="datetime-local" name="fecha_hora" value={venta.fecha_hora} onChange={handleInputChange} required />
          </label>
          <label>
            Impuesto:
            <input type="number" step="0.01" name="impuesto" value={venta.impuesto} onChange={handleInputChange} required />
          </label>
          <label>
            Total Venta:
            <input type="number" step="0.01" name="total_venta" value={venta.total_venta} onChange={handleInputChange} required />
          </label>
          <label>
            Estado:
            <input type="text" name="estado" value={venta.estado} onChange={handleInputChange} required />
          </label>

          <button type="submit">Guardar Venta</button>
          <button type="button" onClick={onClose}>Cancelar</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default NuevaVenta;
