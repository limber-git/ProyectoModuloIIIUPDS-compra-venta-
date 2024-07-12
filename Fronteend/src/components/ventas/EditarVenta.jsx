import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditVenta = ({ venta, onUpdate }) => {
  const [formData, setFormData] = useState({
    idventa: venta.idventa,
    idcliente: venta.idcliente,
    idusuario: venta.idusuario,
    tipo_comprobante: venta.tipo_comprobante,
    serie_comprobante: venta.serie_comprobante,
    num_comprobante: venta.num_comprobante,
    fecha_hora: new Date(venta.fecha_hora).toISOString().slice(0, 16),
    impuesto: venta.impuesto,
    total_venta: venta.total_venta,
    estado: venta.estado,
    persona: {
      idpersona: venta.persona.idpersona,
      tipo_persona: '',
      nombre: '',
      tipo_documento: '',
      num_documento: '',
      direccion: '',
      telefono: '',
      email: ''
    },
    usuario: {
      idusuario: venta.usuario.idusuario,
      nombre: '',
      tipo_documento: '',
      num_documento: '',
      direccion: '',
      telefono: '',
      email: '',
      cargo: '',
      login: '',
      clave: '',
      condicion: true
    }
  });

  const [errors, setErrors] = useState({});
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetchCliente();
    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (clientes.length > 0 && formData.idcliente) {
      const selectedCliente = clientes.find(cli => cli.idpersona === formData.idcliente);
      if (selectedCliente) {
        setFormData(prevData => ({
          ...prevData,
          persona: {
            idpersona: selectedCliente.idpersona,
            tipo_persona: selectedCliente.tipo_persona,
            nombre: selectedCliente.nombre,
            tipo_documento: selectedCliente.tipo_documento,
            num_documento: selectedCliente.num_documento,
            direccion: selectedCliente.direccion,
            telefono: selectedCliente.telefono,
            email: selectedCliente.email
          }
        }));
      }
    }
  }, [clientes, formData.idcliente]);

  useEffect(() => {
    if (usuarios.length > 0 && formData.idusuario) {
      const selectedUsuario = usuarios.find(usr => usr.idusuario === formData.idusuario);
      if (selectedUsuario) {
        setFormData(prevData => ({
          ...prevData,
          usuario: {
            idusuario: selectedUsuario.idusuario,
            nombre: selectedUsuario.nombre,
            tipo_documento: selectedUsuario.tipo_documento,
            num_documento: selectedUsuario.num_documento,
            direccion: selectedUsuario.direccion,
            telefono: selectedUsuario.telefono,
            email: selectedUsuario.email,
            cargo: selectedUsuario.cargo,
            login: selectedUsuario.login,
            clave: selectedUsuario.clave,
            condicion: selectedUsuario.condicion
          }
        }));
      }
    }
  }, [usuarios, formData.idusuario]);

  const fetchCliente = () => {
    axios.get('https://localhost:7163/api/Persona')
      .then(response => {
        setClientes(response.data);
      })
      .catch(error => {
        console.error('Error fetching clientes:', error);
      });
  };

  const fetchUsuarios = () => {
    axios.get('https://localhost:7163/api/Usuario')
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        console.error('Error fetching usuarios:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put(`https://localhost:7163/api/Venta/${formData.idventa}`, formData)
      .then(response => {
        onUpdate(response.data);
        alert('Venta actualizada correctamente');
        setErrors({});
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setErrors(error.response.data.errors);
        } else {
          console.error('Error al actualizar la venta:', error);
        }
      });
  };

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Editar Venta</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Tipo de Comprobante:</label>
              <input type="text" className="form-control" name="tipo_comprobante" value={formData.tipo_comprobante} onChange={handleChange} />
              {errors.tipo_comprobante && <span className="text-danger">{errors.tipo_comprobante[0]}</span>}
            </div>
            <div className="mb-3">
              <label className="form-label">Serie de Comprobante:</label>
              <input type="text" className="form-control" name="serie_comprobante" value={formData.serie_comprobante} onChange={handleChange} />
              {errors.serie_comprobante && <span className="text-danger">{errors.serie_comprobante[0]}</span>}
            </div>
            <div className="mb-3">
              <label className="form-label">Número de Comprobante:</label>
              <input type="text" className="form-control" name="num_comprobante" value={formData.num_comprobante} onChange={handleChange} />
              {errors.num_comprobante && <span className="text-danger">{errors.num_comprobante[0]}</span>}
            </div>
            <div className="mb-3">
              <label className="form-label">Fecha y Hora:</label>
              <input type="datetime-local" className="form-control" name="fecha_hora" value={formData.fecha_hora} onChange={handleChange} />
              {errors.fecha_hora && <span className="text-danger">{errors.fecha_hora[0]}</span>}
            </div>
            <div className="mb-3">
              <label className="form-label">Impuesto:</label>
              <input type="number" className="form-control" name="impuesto" value={formData.impuesto} onChange={handleChange} />
              {errors.impuesto && <span className="text-danger">{errors.impuesto[0]}</span>}
            </div>
            <div className="mb-3">
              <label className="form-label">Total Venta:</label>
              <input type="number" className="form-control" name="total_venta" value={formData.total_venta} onChange={handleChange} />
              {errors.total_venta && <span className="text-danger">{errors.total_venta[0]}</span>}
            </div>
            <div className="mb-3">
              <label className="form-label">Estado:</label>
              <input type="text" className="form-control" name="estado" value={formData.estado} onChange={handleChange} />
              {errors.estado && <span className="text-danger">{errors.estado[0]}</span>}
            </div>
            <div className="mb-3">
              <label className="form-label">Cliente:</label>
              <select className="form-select" name="idcliente" value={formData.idcliente} onChange={handleChange}>
                <option value="">Seleccione un cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.idpersona} value={cliente.idpersona}>{cliente.nombre}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Usuario:</label>
              <select className="form-select" name="idusuario" value={formData.idusuario} onChange={handleChange}>
                <option value="">Seleccione un usuario</option>
                {usuarios.map(usuario => (
                  <option key={usuario.idusuario} value={usuario.idusuario}>{usuario.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">Actualizar</button>
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVenta;
