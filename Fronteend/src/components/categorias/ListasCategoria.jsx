import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditCategoria from './EditarCategoria';
import InsertCategoria from './RegistrarCategoria';
import './tabla.css';

const ListCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [editFormData, setEditFormData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInsertForm, setShowInsertForm] = useState(false);
  const [insertSuccess, setInsertSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('https://localhost:7163/api/Categoria')
      .then(response => {
        setCategorias(response.data);
        
        applySearchFilter(response.data, searchTerm);
      })
      .catch(error => {
        console.error('Hubo un error al obtener los datos!', error);
      });
  };

  const applySearchFilter = (categoriasList, searchTerm) => {
    const filtered = categoriasList.filter(categoria =>
      categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategorias(filtered);
  };

  const handleEdit = (categoria) => {
    setEditFormData(categoria);
  };

  const handleDelete = (idcategoria) => {
    axios.delete(`https://localhost:7163/api/Categoria/${idcategoria}`)
      .then(response => {
        setCategorias(categorias.filter(categoria => categoria.idcategoria !== idcategoria));
        setFilteredCategorias(filteredCategorias.filter(categoria => categoria.idcategoria !== idcategoria));
        alert('Categoría eliminada exitosamente');
      })
      .catch(error => {
        console.error('Hubo un error al eliminar los datos!', error);
      });
  };

  const handleUpdate = (updatedCategoria) => {
    setCategorias(categorias.map(categoria =>
      categoria.idcategoria === updatedCategoria.idcategoria ? updatedCategoria : categoria
    ));
    setFilteredCategorias(filteredCategorias.map(categoria =>
      categoria.idcategoria === updatedCategoria.idcategoria ? updatedCategoria : categoria
    ));
    setEditFormData(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInsertFormToggle = () => {
    setShowInsertForm(!showInsertForm);
  };

  const handleInsertCategoria = (newCategoria) => {
    axios.post('https://localhost:7163/api/Categoria', newCategoria)
      .then(response => {
       
        fetchData();
        setInsertSuccess(true);
        setShowInsertForm(false);
      })
      .catch(error => {
        console.error('Hubo un error al insertar los datos!', error);
      });
  };

  useEffect(() => {
    applySearchFilter(categorias, searchTerm);
  }, [categorias, searchTerm]);

  return (
    <div>
      <button onClick={handleInsertFormToggle}>
                  {showInsertForm ? 'Ocultar Formulario de Inserción' : 'Registrar Categoría'}
                </button>
      <h2>Buscar Categoría</h2>
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={handleSearch}
      />
      <h2>Lista de Categorías</h2>
      {insertSuccess && <p style={{ color: 'green' }}>¡Categoría insertada exitosamente!</p>}
                
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Condición</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategorias.map(categoria => (
            <tr key={categoria.idcategoria}>
              <td>{categoria.idcategoria}</td>
              <td>{categoria.nombre}</td>
              <td>{categoria.descripcion}</td>
              <td>{categoria.condicion ? 'True' : 'False'}</td>
              <td>
                <button onClick={() => handleEdit(categoria)}>Editar</button>
                <button onClick={() => handleDelete(categoria.idcategoria)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="insert-form-container">
        {showInsertForm && <InsertCategoria onInsert={handleInsertCategoria} />}
      </div>
      {editFormData && (
        <EditCategoria
          categoria={editFormData}
          onUpdate={handleUpdate}
          onCancel={() => setEditFormData(null)}
        />
      )}
    </div>
  );
};

export default ListCategorias;
