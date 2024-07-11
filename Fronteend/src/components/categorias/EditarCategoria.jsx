import React, { useState } from 'react';
import axios from 'axios';

const EditCategoria = ({ categoria, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    idcategoria: categoria.idcategoria,
    nombre: categoria.nombre,
    descripcion: categoria.descripcion,
    condicion: categoria.condicion
  });

  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.put(`https://localhost:7163/api/Categoria/${formData.idcategoria}`, formData)
      .then(response => {
        onUpdate(response.data);
        alert('Dato cambiados');
        setErrors({});
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setErrors(error.response.data.errors);
        } else {
          console.error('Error no se cambio', error);
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre:</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
        {errors.nombre && <span>{errors.nombre[0]}</span>}
      </div>
      <div>
        <label>Descripción:</label>
        <input type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} required />
        {errors.descripcion && <span>{errors.descripcion[0]}</span>}
      </div>
      <div>
        <label>Condición:</label>
        <input type="checkbox" name="condicion" checked={formData.condicion} onChange={handleChange} />
        {errors.condicion && <span>{errors.condicion[0]}</span>}
      </div>
      <button type="submit">Actualizar</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default EditCategoria;
