import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import EditArticulo from './EditarArticulos';
import InsertArticulo from './RegistrarArticulos';
import './articulos.css';

Modal.setAppElement('#root');

const ListArticulos = () => {
  const [articulos, setArticulos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filteredArticulos, setFilteredArticulos] = useState([]);
  const [editArticulo, setEditArticulo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInsert, setIsInsert] = useState(false);

  useEffect(() => {
    fetchData();
    fetchCategorias();
  }, []);

  const fetchData = () => {
    axios.get('https://localhost:7163/api/Articulo')
      .then(response => {
        setArticulos(response.data);
        setFilteredArticulos(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener los datos!', error);
      });
  };

  const fetchCategorias = () => {
    axios.get('https://localhost:7163/api/Categoria')
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener las categorías!', error);
      });
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredArticulos(articulos.filter(articulo =>
      articulo.nombre.toLowerCase().includes(term)
    ));
  };

  const handleDelete = (idarticulo) => {
    axios.delete(`https://localhost:7163/api/Articulo/${idarticulo}`)
      .then(response => {
        fetchData();
        alert('Artículo eliminado exitosamente');
      })
      .catch(error => {
        console.error('Hubo un error al eliminar los datos!', error);
      });
  };

  const openModal = (articulo = null) => {
    setEditArticulo(articulo);
    setIsInsert(!articulo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = (updatedArticulo) => {
    fetchData();
    closeModal();
  };

  const handleInsert = (newArticulo) => {
    fetchData();
    closeModal();
  };

  const getCategoriaNombre = (idcategoria) => {
    const categoria = categorias.find(c => c.idcategoria === idcategoria);
    return categoria ? categoria.nombre : 'N/A';
  };

  return (
    <div>
      <button className='estiloboton' onClick={() => openModal(null)}>Registrar Nuevo Artículo</button>
      <h2>Buscar Artículo</h2>
      <input className='input-estilo'
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={handleSearch}
      />
      
      <h2>Lista de Artículos</h2>
      
      <div className="card-container">
        {filteredArticulos.map(articulo => (
          <div className="card"  key={articulo.idarticulo}>
            <img src={articulo.imagen} alt={articulo.nombre} />
            <h1>{articulo.nombre}</h1>
            <p><strong>ID:</strong> {articulo.idarticulo}</p>
            <p><strong>Categoría:</strong> {getCategoriaNombre(articulo.idcategoria)}</p>
            <p><strong>Código:</strong> {articulo.codigo}</p>
            <p><strong>Stock:</strong> {articulo.stock}</p>
            <p><strong>Descripción:</strong> {articulo.descripcion}</p>
            <p><strong>Condición:</strong> {articulo.condicion ? 'True' : 'False'}</p>
            <div className="card-actions">
              <button onClick={() => openModal(articulo)}>Editar</button>
              <button onClick={() => handleDelete(articulo.idarticulo)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2>{isInsert ? 'Registrar Artículo' : 'Editar Artículo'}</h2>
          <button className="modal-close-button" onClick={closeModal}>&times;</button>
        </div>
        <div className="modal-body">
          {isInsert ? (
            <InsertArticulo onInsert={handleInsert} />
          ) : (
            <EditArticulo articulo={editArticulo} onUpdate={handleUpdate} onCancel={closeModal} />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ListArticulos;