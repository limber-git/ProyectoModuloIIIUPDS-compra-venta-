import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import NuevaVenta from './RegistrarVenta'; 
// import EditVenta from './EditarVenta'; 
import DetalleVenta from './DetalleVenta'; // Componente para mostrar detalles de venta
import './ListaVentas.css';

Modal.setAppElement('#root'); // Asegura que el elemento modal esté accesible para herramientas de asistencia

const ListaVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewVentaModal, setShowNewVentaModal] = useState(false);
  const [showEditVentaModal, setShowEditVentaModal] = useState(false);
  const [showDetailVentaModal, setShowDetailVentaModal] = useState(false);
  const [editVenta, setEditVenta] = useState(null);
  const [detailVenta, setDetailVenta] = useState(null); // Estado para almacenar los detalles de venta
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchVentas();
    fetchUsuarios();
    fetchClientes();
  }, []);

  const fetchVentas = () => {
    axios.get('https://localhost:7163/api/Venta')
      .then(response => setVentas(response.data))
      .catch(error => console.error('Error al obtener las ventas:', error));
  };

  const fetchUsuarios = () => {
    axios.get('https://localhost:7163/api/Usuario')
      .then(response => setUsuarios(response.data))
      .catch(error => console.error('Error al obtener los usuarios:', error));
  };

  const fetchClientes = () => {
    axios.get('https://localhost:7163/api/Persona')
      .then(response => setClientes(response.data))
      .catch(error => console.error('Error al obtener los clientes:', error));
  };

  const handleInsert = (venta) => {
    axios.post('https://localhost:7163/api/Venta', venta)
      .then(response => {
        setVentas([...ventas, response.data]);
        setShowNewVentaModal(false); // Cierra el modal después de insertar la venta
      })
      .catch(error => console.error('Error al insertar la venta:', error));
  };

  const handleEdit = (venta) => {
    axios.put(`https://localhost:7163/api/Venta/${venta.idventa}`, venta)
      .then(response => {
        setVentas(ventas.map(v => (v.idventa === venta.idventa ? response.data : v)));
        setShowEditVentaModal(false); // Cierra el modal después de editar la venta
        setEditVenta(null);
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setErrors(error.response.data.errors);
        } else {
          console.error('Error al editar la venta:', error);
        }
      });
  };

  const handleDelete = (idventa) => {
    axios.delete(`https://localhost:7163/api/Venta/${idventa}`)
      .then(() => {
        setVentas(ventas.filter(v => v.idventa !== idventa));
      })
      .catch(error => {
        console.error('Error al eliminar la venta:', error);
      });
  };

  const handleDetailVenta = (venta) => {
    setDetailVenta(venta); // Establece los detalles de la venta seleccionada
    setShowDetailVentaModal(true); // Abre el modal para mostrar los detalles de la venta
  };

  const filteredVentas = ventas.filter(venta =>
    venta.tipo_comprobante.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.serie_comprobante.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.num_comprobante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getNombreUsuario = (idusuario) => {
    const usuario = usuarios.find(u => u.idusuario === idusuario);
    return usuario ? usuario.nombre : 'N/A';
  };

  const getNombreCliente = (idcliente) => {
    const cliente = clientes.find(c => c.idpersona === idcliente);
    return cliente ? cliente.nombre : 'N/A';
  };

  return (
    <div className="lista-ventas">
      <h1>Lista de Ventas</h1>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <button onClick={() => setShowNewVentaModal(true)}>Nueva Venta</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo Comprobante</th>
            <th>Serie</th>
            <th>Número</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Usuario</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredVentas.map(venta => (
            <tr key={venta.idventa}>
              <td>{venta.idventa}</td>
              <td>{venta.tipo_comprobante}</td>
              <td>{venta.serie_comprobante}</td>
              <td>{venta.num_comprobante}</td>
              <td>{new Date(venta.fecha_hora).toLocaleString()}</td>
              <td>{venta.total_venta}</td>
              <td>{getNombreUsuario(venta.idusuario)}</td>
              <td>{getNombreCliente(venta.idcliente)}</td>
              <td>{venta.estado}</td>
              <td>
                <button onClick={() => handleDetailVenta(venta)}>Detalle</button>
                {/* <button onClick={() => { setEditVenta(venta); setShowEditVentaModal(true); }}>Editar</button> */}
                <button onClick={() => handleDelete(venta.idventa)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={showNewVentaModal}
        onRequestClose={() => setShowNewVentaModal(false)}
        contentLabel="Modal Nueva Venta"
        className="modal-nueva-venta"
        overlayClassName="modal-overlay"
      >
        <NuevaVenta onInsert={handleInsert} onClose={() => setShowNewVentaModal(false)} />
      </Modal>

      <Modal
        isOpen={showEditVentaModal}
        onRequestClose={() => setShowEditVentaModal(false)}
        contentLabel="Modal Editar Venta"
        className="modal-editar-venta"
        overlayClassName="modal-overlay"
      >
        {editVenta && (
          <EditVenta venta={editVenta} onUpdate={handleEdit} />
        )}
      </Modal>

      {/* Modal para mostrar detalles de la venta */}
      <Modal
        isOpen={showDetailVentaModal}
        onRequestClose={() => setShowDetailVentaModal(false)}
        contentLabel="Detalles de Venta"
        className="modal-detalle-venta"
        overlayClassName="modal-overlay"
      >
        {detailVenta && (
          <DetalleVenta venta={detailVenta} onClose={() => setShowDetailVentaModal(false)} />
        )}
      </Modal>

    </div>
  );
};

export default ListaVentas;
