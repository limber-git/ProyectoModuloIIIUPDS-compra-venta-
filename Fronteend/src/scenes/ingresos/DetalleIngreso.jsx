import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ModalIngresoInfo.css';

const DetalleIngreso = ({ isOpen, onRequestClose, ingreso }) => {
  const [detallesIngreso, setDetallesIngreso] = useState([]);

  useEffect(() => {
    const fetchDetallesIngreso = async () => {
      try {
        if (ingreso && ingreso.idingreso) {
          const response = await axios.get(`https://localhost:7163/api/Detalle_Ingreso/GetByIngresoId/${ingreso.idingreso}`);
          setDetallesIngreso(response.data);
        }
      } catch (error) {
        console.error('Error al obtener los detalles del ingreso:', error);
      }
    };

    fetchDetallesIngreso();
  }, [isOpen, ingreso]);

  return (
    <div className={`modal-ingreso-info ${isOpen ? 'open' : ''}`}>
      <div className="modal-header">
        <h2>Detalles de Ingreso</h2>
        <button onClick={onRequestClose} className="close-button">Cerrar</button>
      </div>
      <div className="modal-body">
        <div className="ingreso-info-item">
          <label>Proveedor:</label>
          <span>{ingreso.persona ? ingreso.persona.nombre : 'N/A'}</span>
        </div>
        <div className="ingreso-info-item">
          <label>Usuario:</label>
          <span>{ingreso.usuario ? ingreso.usuario.nombre : 'N/A'}</span>
        </div>
        <div className="ingreso-info-item">
          <label>Tipo de Comprobante:</label>
          <span>{ingreso.tipo_comprobante}</span>
        </div>
        <div className="ingreso-info-item">
          <label>Serie de Comprobante:</label>
          <span>{ingreso.serie_comprobante}</span>
        </div>
        <div className="ingreso-info-item">
          <label>Número de Comprobante:</label>
          <span>{ingreso.num_comprobante}</span>
        </div>
        <div className="ingreso-info-item">
          <label>Fecha y Hora:</label>
          <span>{new Date(ingreso.fecha_hora).toLocaleString()}</span>
        </div>
        <div className="ingreso-info-item">
          <label>Impuesto (%):</label>
          <span>{ingreso.impuesto}</span>
        </div>
        <div className="ingreso-info-item">
          <label>Total Compra:</label>
          <span>{ingreso.total_compra}</span>
        </div>
        <div className="ingreso-info-item">
          <label>Estado:</label>
          <span>{ingreso.estado}</span>
        </div>
        <h3>Detalles del Ingreso</h3>
        <div className="detalle-ingreso-list">
          {detallesIngreso.map((detalle, index) => (
            <div key={index} className="detalle-ingreso">
              <div>
                <label>Artículo:</label>
                <span>{detalle.articulo ? detalle.articulo.nombre : 'N/A'}</span>
              </div>
              <div>
                <label>Cantidad:</label>
                <span>{detalle.cantidad}</span>
              </div>
              <div>
                <label>Precio Compra:</label>
                <span>{detalle.precio_compra}</span>
              </div>
              <div>
                <label>Precio Venta:</label>
                <span>{detalle.precio_venta}</span>
              </div>
              <div>
                <label>Subtotal:</label>
                <span>{(detalle.cantidad * detalle.precio_compra).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetalleIngreso;
