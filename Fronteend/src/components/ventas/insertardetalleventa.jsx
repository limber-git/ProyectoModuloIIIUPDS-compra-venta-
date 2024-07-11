import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Asegura que el elemento modal esté accesible para herramientas de asistencia

const DetailVentaModal = ({ detalleVenta, onClose }) => {
  const { iddetalle_venta, articulo, venta, cantidad, precio_venta, descuento } = detalleVenta;
  const { nombre: nombreArticulo } = articulo;
  const { usuario, persona } = venta;
  const { nombre: nombreUsuario } = usuario;
  const { nombre: nombreCliente } = persona;

  return (
    <Modal
      isOpen={true} // Abre el modal cuando se muestra
      onRequestClose={onClose} // Cierra el modal cuando se hace clic fuera de él o se presiona Escape
      contentLabel="Detalle de Venta" // Etiqueta de contenido para accesibilidad
      className="modal-dialog modal-dialog-centered"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Detalle de Venta</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <p><strong>ID Detalle Venta:</strong> {iddetalle_venta}</p>
          <p><strong>Artículo:</strong> {nombreArticulo}</p>
          <p><strong>Cantidad:</strong> {cantidad}</p>
          <p><strong>Precio Venta:</strong> {precio_venta}</p>
          <p><strong>Descuento:</strong> {descuento}</p>
          <p><strong>Cliente:</strong> {nombreCliente}</p>
          <p><strong>Usuario:</strong> {nombreUsuario}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </Modal>
  );
};

export default DetailVentaModal;

