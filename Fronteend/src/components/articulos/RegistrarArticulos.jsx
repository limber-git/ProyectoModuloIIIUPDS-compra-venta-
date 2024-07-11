import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InsertArticulo = ({ onInsert }) => {
  const [formData, setFormData] = useState({
    idarticulo: 0,
    idcategoria: 0,
    codigo: '',
    nombre: '',
    stock: 0,
    descripcion: '',
    imagen: '',
    condicion: true,
    categorias: {
      idcategoria: 0,
      nombre: '',
      descripcion: '',
      condicion: true
    }
  });

  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = () => {
    axios.get('https://localhost:7163/api/Categoria')
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener las categorías!', error);
      });
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.idcategoria) {
      alert('Debe seleccionar una categoría');
      return;
    }

    const dataToSend = {
      ...formData,
      idcategoria: parseInt(formData.idcategoria, 10),
      stock: parseInt(formData.stock, 10),
      categorias: {
        idcategoria: parseInt(formData.idcategoria, 10),
        nombre: categorias.find(cat => cat.idcategoria === parseInt(formData.idcategoria, 10)).nombre,
        descripcion: categorias.find(cat => cat.idcategoria === parseInt(formData.idcategoria, 10)).descripcion,
        condicion: categorias.find(cat => cat.idcategoria === parseInt(formData.idcategoria, 10)).condicion
      }
    };

    axios.post('https://localhost:7163/api/Articulo', dataToSend)
      .then(response => {
        onInsert(response.data);
        alert('Artículo insertado exitosamente');
        setFormData({
          idarticulo: 0,
          idcategoria: 0,
          codigo: '',
          nombre: '',
          stock: 0,
          descripcion: '',
          imagen: '',
          condicion: true,
          categorias: {
            idcategoria: 0,
            nombre: '',
            descripcion: '',
            condicion: true
          }
        });
        setError('');
      })
      .catch(error => {
        console.error('Hubo un error al insertar el artículo!', error);
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
          setError('Hubo un error al insertar el artículo. Por favor, inténtelo de nuevo.');
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Categoría:</label>
        <select name="idcategoria" value={formData.idcategoria} onChange={handleChange} required>
          <option value="">Seleccione una categoría</option>
          {categorias.map(categoria => (
            <option key={categoria.idcategoria} value={categoria.idcategoria}>{categoria.nombre}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Código:</label>
        <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} required />
      </div>
      <div>
        <label>Nombre:</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
      </div>
      <div>
        <label>Stock:</label>
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
      </div>
      <div>
        <label>Descripción:</label>
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required />
      </div>
      <div>
        <label>Imagen:</label>
        <input type="text" name="imagen" value={formData.imagen} onChange={handleChange} required />
      </div>
      <div>
        <label>Condición:</label>
        <input type="checkbox" name="condicion" checked={formData.condicion} onChange={handleChange} />
      </div>
      <button type="submit">Insertar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default InsertArticulo;
