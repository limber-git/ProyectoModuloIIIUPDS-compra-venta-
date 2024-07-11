import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditArticulo = ({ articulo, onUpdate }) => {
  const [formData, setFormData] = useState({
    idarticulo: articulo.idarticulo,
    idcategoria: articulo.idcategoria,
    codigo: articulo.codigo,
    nombre: articulo.nombre,
    stock: articulo.stock,
    descripcion: articulo.descripcion,
    imagen: articulo.imagen,
    condicion: articulo.condicion,
    categorias: {
      idcategoria: articulo.idcategoria,
      nombre: '',
      descripcion: '',
      condicion: true
    }
  });

  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (categorias.length > 0 && formData.idcategoria) {
      const selectedCategoria = categorias.find(cat => cat.idcategoria === formData.idcategoria);
      if (selectedCategoria) {
        setFormData(prevData => ({
          ...prevData,
          categorias: {
            idcategoria: selectedCategoria.idcategoria,
            nombre: selectedCategoria.nombre,
            descripcion: selectedCategoria.descripcion,
            condicion: selectedCategoria.condicion
          }
        }));
      }
    }
  }, [categorias, formData.idcategoria]);

  const fetchCategorias = () => {
    axios.get('https://localhost:7163/api/Categoria')
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener las categorías!', error);
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

    axios.put(`https://localhost:7163/api/Articulo/${dataToSend.idarticulo}`, dataToSend)
      .then(response => {
        onUpdate(response.data);
        alert('Artículo actualizado exitosamente');
        setErrors({});
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setErrors(error.response.data.errors);
        } else {
          console.error('Hubo un error al actualizar los datos!', error);
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
        {errors.idcategoria && <span>{errors.idcategoria[0]}</span>}
      </div>
      <div>
        <label>Código:</label>
        <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} required />
        {errors.codigo && <span>{errors.codigo[0]}</span>}
      </div>
      <div>
        <label>Nombre:</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
        {errors.nombre && <span>{errors.nombre[0]}</span>}
      </div>
      <div>
        <label>Stock:</label>
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
        {errors.stock && <span>{errors.stock[0]}</span>}
      </div>
      <div>
        <label>Descripción:</label>
        <input type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} required />
        {errors.descripcion && <span>{errors.descripcion[0]}</span>}
      </div>
      <div>
        <label>Imagen:</label>
        <input type="text" name="imagen" value={formData.imagen} onChange={handleChange} required />
        {errors.imagen && <span>{errors.imagen[0]}</span>}
      </div>
      <div>
        <label>Condición:</label>
        <input type="checkbox" name="condicion" checked={formData.condicion} onChange={handleChange} />
        {errors.condicion && <span>{errors.condicion[0]}</span>}
      </div>
      <button type="submit">Actualizar</button>
    </form>
  );
};

export default EditArticulo;
