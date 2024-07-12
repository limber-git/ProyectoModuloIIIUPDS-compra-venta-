import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ModalVentaInfo.css';

const DetalleVenta = ({ isOpen, onRequestClose, venta }) => {
  const [detallesVenta, setDetallesVenta] = useState([]);

  useEffect(() => {
    const fetchDetallesVenta = async () => {
      try {
        if (venta && venta.idventa) {
          const response = await axios.get(`https://localhost:7163/api/Detalle_Venta/GetByVentaId/${venta.idventa}`);
          setDetallesVenta(response.data);
        }
      } catch (error) {
        console.error('Error al obtener los detalles de la venta:', error);
      }
    };

    fetchDetallesVenta();
  }, [isOpen, venta]);

  return (
    <div className={`modal-venta-info ${isOpen ? 'open' : ''}`}>
      <div className="modal-header">
        <h2>Detalles de Venta</h2>
        <button onClick={onRequestClose} className="close-button">Cerrar</button>
      </div>
      <div className="modal-body">
        <div className="venta-info-item">
          <label>Cliente:</label>
          <span>{venta.persona ? venta.persona.nombre : 'N/A'}</span>
        </div>
        <div className="venta-info-item">
          <label>Usuario:</label>
          <span>{venta.usuario ? venta.usuario.nombre : 'N/A'}</span>
        </div>
        <div className="venta-info-item">
          <label>Tipo de Comprobante:</label>
          <span>{venta.tipo_comprobante}</span>
        </div>
        <div className="venta-info-item">
          <label>Serie de Comprobante:</label>
          <span>{venta.serie_comprobante}</span>
        </div>
        <div className="venta-info-item">
          <label>Número de Comprobante:</label>
          <span>{venta.num_comprobante}</span>
        </div>
        <div className="venta-info-item">
          <label>Fecha y Hora:</label>
          <span>{new Date(venta.fecha_hora).toLocaleString()}</span>
        </div>
        <div className="venta-info-item">
          <label>Impuesto (%):</label>
          <span>{venta.impuesto}</span>
        </div>
        <div className="venta-info-item">
          <label>Total Venta:</label>
          <span>{venta.total_venta}</span>
        </div>
        <div className="venta-info-item">
          <label>Estado:</label>
          <span>{venta.estado}</span>
        </div>
        <h3>Detalles de la Venta</h3>
        <div className="detalle-venta-list">
          {detallesVenta.map((detalle, index) => (
            <div key={index} className="detalle-venta">
              <div>
                <label>Artículo:</label>
                <span>{detalle.articulo ? detalle.articulo.nombre : 'N/A'}</span>
              </div>
              <div>
                <label>Cantidad:</label>
                <span>{detalle.cantidad}</span>
              </div>
              <div>
                <label>Precio Venta:</label>
                <span>{detalle.precio_venta}</span>
              </div>
              <div>
                <label>Descuento:</label>
                <span>{detalle.descuento}</span>
              </div>
              <div>
                <label>Subtotal:</label>
                <span>{(detalle.cantidad * detalle.precio_venta).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetalleVenta;
