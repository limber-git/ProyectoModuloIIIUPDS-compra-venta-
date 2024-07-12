import React, { useState, useEffect } from "react";
import { Box, Button, Grid, Paper, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Header } from "../../components";
import axios from "axios";

const Permisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nuevoPermiso, setNuevoPermiso] = useState("");
  const [permisoSeleccionado, setPermisoSeleccionado] = useState(null);
  const [editarPermisoDialogOpen, setEditarPermisoDialogOpen] = useState(false);

  // Función para cargar los permisos desde la API
  const loadPermisos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://localhost:7163/api/Permiso");
      setPermisos(response.data);
    } catch (error) {
      console.error("Error al cargar permisos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los permisos al montar el componente
  useEffect(() => {
    loadPermisos();
  }, []);

  // Función para manejar el cambio en el campo de nuevo permiso
  const handleNuevoPermisoChange = (event) => {
    setNuevoPermiso(event.target.value);
  };

  // Función para manejar el envío del formulario de nuevo permiso
  const handleSubmitNuevoPermiso = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await axios.post("https://localhost:7163/api/Permiso", {
        nombre: nuevoPermiso,
      });
      setNuevoPermiso(""); // Limpiar el campo después de agregar
      loadPermisos(); // Recargar la lista de permisos
    } catch (error) {
      console.error("Error al agregar permiso:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un permiso
  const handleEliminarPermiso = async (idPermiso) => {
    try {
      setLoading(true);
      await axios.delete(`https://localhost:7163/api/Permiso/${idPermiso}`);
      loadPermisos(); // Recargar la lista de permisos después de eliminar
    } catch (error) {
      console.error("Error al eliminar permiso:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir el diálogo de edición de permiso
  const abrirEditarPermisoDialog = (permiso) => {
    setPermisoSeleccionado(permiso);
    setEditarPermisoDialogOpen(true);
  };

  // Función para cerrar el diálogo de edición de permiso
  const cerrarEditarPermisoDialog = () => {
    setPermisoSeleccionado(null);
    setEditarPermisoDialogOpen(false);
  };

  // Función para manejar el envío del formulario de edición de permiso
  const handleSubmitEditarPermiso = async () => {
    try {
      setLoading(true);
      await axios.put(`https://localhost:7163/api/Permiso/${permisoSeleccionado.idpermiso}`, {
        idpermiso: permisoSeleccionado.idpermiso,
        nombre: permisoSeleccionado.nombre,
        // otros campos necesarios según tu API
      });
      cerrarEditarPermisoDialog(); // Cerrar el diálogo después de editar
      loadPermisos(); // Recargar la lista de permisos después de editar
    } catch (error) {
      console.error("Error al editar permiso:", error);
    } finally {
      setLoading(false);
    }
  };


  // Función para manejar el cambio en el nombre del permiso seleccionado
  const handlePermisoSeleccionadoChange = (event) => {
    setPermisoSeleccionado({
      ...permisoSeleccionado,
      nombre: event.target.value,
    });
  };

  return (
    <Box m="20px">
      <Header title="Permisos" subtitle="Agregar, editar y eliminar permisos" />
      <Grid container spacing={3}>
        {/* Formulario para agregar permisos */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: "20px" }}>
            <Typography variant="h6" gutterBottom>
              Agregar Permiso
            </Typography>
            <form onSubmit={handleSubmitNuevoPermiso}>
              <TextField
                label="Nombre del Permiso"
                variant="outlined"
                fullWidth
                value={nuevoPermiso}
                onChange={handleNuevoPermisoChange}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: "10px" }}
                disabled={loading}
              >
                Agregar Permiso
              </Button>
            </form>
          </Paper>
        </Grid>
        {/* Lista de permisos */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: "20px", maxHeight: "400px", overflow: "auto" }}>
            <Typography variant="h6" gutterBottom>
              Lista de Permisos
            </Typography>
            {loading ? (
              <Typography variant="body1">Cargando permisos...</Typography>
            ) : (
              <ul>
                {permisos.map((permiso) => (
                  <li key={permiso.idpermiso}>
                    {permiso.nombre}
                    <Button
                      variant="outlined"
                      color="primary"
                      style={{ marginLeft: "10px" }}
                      onClick={() => abrirEditarPermisoDialog(permiso)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      style={{ marginLeft: "10px" }}
                      onClick={() => handleEliminarPermiso(permiso.idpermiso)}
                    >
                      Eliminar
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Diálogo de edición de permiso */}
      <Dialog open={editarPermisoDialogOpen} onClose={cerrarEditarPermisoDialog}>
        <DialogTitle>Editar Permiso</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre del Permiso"
            variant="outlined"
            fullWidth
            value={permisoSeleccionado ? permisoSeleccionado.nombre : ""}
            onChange={handlePermisoSeleccionadoChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarEditarPermisoDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmitEditarPermiso} color="primary" variant="contained">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Permisos;
