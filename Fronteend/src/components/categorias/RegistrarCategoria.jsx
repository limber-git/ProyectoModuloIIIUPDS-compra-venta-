import React, { useState } from 'react';
import axios from 'axios';

const InsertCategoria = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    condicion: false
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

    
    axios.post('https://localhost:7163/api/Usuario', formData)
      .then(response => {
        console.log(response.data);
        alert('Usua insertado');
        setErrors({});
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setErrors(error.response.data.errors);
        } else {
          console.error('no se inserto', error);
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
      <button type="submit">Insertar</button>
    </form>
  );
};

export default InsertCategoria;
