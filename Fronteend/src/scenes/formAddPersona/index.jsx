import React, { useState } from "react";
import { Box, Button, Grid, Paper, Typography, TextField } from "@mui/material";
import { Header } from "../../components";
import axios from "axios";

const AgregarPersona = () => {
  const [formData, setFormData] = useState({
    tipo_persona: "",
    nombre: "",
    tipo_documento: "",
    num_documento: "",
    direccion: "",
    telefono: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:7163/api/Persona", formData);
      // Limpiar formulario después de enviar exitosamente
      setFormData({
        tipo_persona: "",
        nombre: "",
        tipo_documento: "",
        num_documento: "",
        direccion: "",
        telefono: "",
        email: "",
      });
      alert("Persona agregada exitosamente.");
    } catch (error) {
      console.error("Error al agregar persona:", error);
      alert("Hubo un error al agregar la persona.");
    }
  };

  return (
    <Box m="20px">
      <Header title="Agregar Persona" subtitle="Complete los datos para agregar una persona" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: "20px" }}>
            <form onSubmit={handleSubmit}>
              <TextField
                name="tipo_persona"
                label="Tipo de Persona"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.tipo_persona}
                onChange={handleChange}
                required
              />
              <TextField
                name="nombre"
                label="Nombre"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              <TextField
                name="tipo_documento"
                label="Tipo de Documento"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.tipo_documento}
                onChange={handleChange}
                required
              />
              <TextField
                name="num_documento"
                label="Número de Documento"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.num_documento}
                onChange={handleChange}
                required
              />
              <TextField
                name="direccion"
                label="Dirección"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.direccion}
                onChange={handleChange}
              />
              <TextField
                name="telefono"
                label="Teléfono"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.telefono}
                onChange={handleChange}
              />
              <TextField
                name="email"
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={handleChange}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: "10px" }}
              >
                Agregar Persona
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgregarPersona;
