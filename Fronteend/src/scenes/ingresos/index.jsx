import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import NuevoIngreso from './RegistrarIngreso';
// import EditIngreso from './EditarIngreso';
import DetalleIngreso from './DetalleIngreso';
import './ListaIngresos.css';

Modal.setAppElement('#root'); // Asegura que el elemento modal esté accesible para herramientas de asistencia

const ListaIngresos = () => {
  const [ingresos, setIngresos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewIngresoModal, setShowNewIngresoModal] = useState(false);
  const [showEditIngresoModal, setShowEditIngresoModal] = useState(false);
  const [showDetailIngresoModal, setShowDetailIngresoModal] = useState(false);
  const [editIngreso, setEditIngreso] = useState(null);
  const [detailIngreso, setDetailIngreso] = useState(null); // Estado para almacenar los detalles de ingreso
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchIngresos();
    fetchUsuarios();
    fetchProveedores();
  }, []);

  const fetchIngresos = () => {
    axios.get('https://localhost:7163/api/Ingreso')
      .then(response => setIngresos(response.data))
      .catch(error => console.error('Error al obtener los ingresos:', error));
  };

  const fetchUsuarios = () => {
    axios.get('https://localhost:7163/api/Usuario')
      .then(response => setUsuarios(response.data))
      .catch(error => console.error('Error al obtener los usuarios:', error));
  };

  const fetchProveedores = () => {
    axios.get('https://localhost:7163/api/Persona')
      .then(response => setProveedores(response.data))
      .catch(error => console.error('Error al obtener los proveedores:', error));
  };

  const handleInsert = (ingreso) => {
    axios.post('https://localhost:7163/api/Ingreso', ingreso)
      .then(response => {
        setIngresos([...ingresos, response.data]);
        setShowNewIngresoModal(false); // Cierra el modal después de insertar el ingreso
      })
      .catch(error => console.error('Error al insertar el ingreso:', error));
  };

  const handleEdit = (ingreso) => {
    axios.put(`https://localhost:7163/api/Ingreso/${ingreso.idingreso}`, ingreso)
      .then(response => {
        setIngresos(ingresos.map(i => (i.idingreso === ingreso.idingreso ? response.data : i)));
        setShowEditIngresoModal(false); // Cierra el modal después de editar el ingreso
        setEditIngreso(null);
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setErrors(error.response.data.errors);
        } else {
          console.error('Error al editar el ingreso:', error);
        }
      });
  };

  const handleDelete = (idingreso) => {
    if (window.confirm('¿Estás seguro que deseas eliminar este ingreso? Esta acción no se puede deshacer.')) {
      axios.delete(`https://localhost:7163/api/Ingreso/${idingreso}`)
        .then(() => {
          setIngresos(ingresos.filter(i => i.idingreso !== idingreso));
        })
        .catch(error => {
          console.error('Error al eliminar el ingreso:', error);
        });
    }
  };

  const handleDetail = (ingreso) => {
    console.log(ingreso);
    setDetailIngreso(ingreso); // Establece los detalles del ingreso seleccionado
    setShowDetailIngresoModal(true); // Abre el modal para mostrar los detalles del ingreso
  };

  const filteredIngresos = ingresos.filter(ingreso =>
    ingreso.tipo_comprobante.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ingreso.serie_comprobante.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ingreso.num_comprobante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getNombreUsuario = (idusuario) => {
    const usuario = usuarios.find(u => u.idusuario === idusuario);
    return usuario ? usuario.nombre : 'N/A';
  };

  const getNombreProveedor = (idproveedor) => {
    const proveedor = proveedores.find(p => p.idpersona === idproveedor);
    return proveedor ? proveedor.nombre : 'N/A';
  };

  return (
    <div className="lista-ingresos">
      <h1>Lista de Ingresos</h1>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <button onClick={() => setShowNewIngresoModal(true)}>Nuevo Ingreso</button>
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
            <th>Proveedor</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredIngresos.map(ingreso => (
            <tr key={ingreso.idingreso}>
              <td>{ingreso.idingreso}</td>
              <td>{ingreso.tipo_comprobante}</td>
              <td>{ingreso.serie_comprobante}</td>
              <td>{ingreso.num_comprobante}</td>
              <td>{new Date(ingreso.fecha_hora).toLocaleString()}</td>
              <td>{ingreso.total_compra}</td>
              <td>{getNombreUsuario(ingreso.idusuario)}</td>
              <td>{getNombreProveedor(ingreso.idproveedor)}</td>
              <td>{ingreso.estado}</td>
              <td>
                <button onClick={() => handleDetail(ingreso)}>Detalle</button>
                <button onClick={() => handleDelete(ingreso.idingreso)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={showNewIngresoModal}
        onRequestClose={() => setShowNewIngresoModal(false)}
        contentLabel="Modal Nuevo Ingreso"
        className="modal-nuevo-ingreso"
        overlayClassName="modal-overlay"
      >
        <NuevoIngreso onInsert={handleInsert} onClose={() => setShowNewIngresoModal(false)} />
      </Modal>

      <Modal
        isOpen={showDetailIngresoModal}
        onRequestClose={() => setShowDetailIngresoModal(false)}
        contentLabel="Detalles de Ingreso"
        className="modal-detalle-Ingreso"
        overlayClassName="modal-overlay"
      >
        {detailIngreso && (
          <DetalleIngreso ingreso={detailIngreso} onClose={() => setShowDetailIngresoModal(false)} />
        )}
      </Modal>

    </div>
  );
};

export default ListaIngresos;
