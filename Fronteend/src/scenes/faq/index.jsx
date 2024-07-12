import React, { useState, useEffect } from "react";
import { Box, Button, Grid, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Header } from "../../components";
import axios from "axios";

const FAQ = () => {
  const [usuariosConPermisos, setUsuariosConPermisos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [idUsuarioSeleccionado, setIdUsuarioSeleccionado] = useState("");
  const [idPermisoSeleccionado, setIdPermisoSeleccionado] = useState("");

  // Función para cargar usuarios con permisos desde la API
  const loadUsuariosConPermisos = async () => {
    try {
      const response = await axios.get("https://localhost:7163/api/Usuario_Permiso");
      setUsuariosConPermisos(response.data);
    } catch (error) {
      console.error("Error al cargar usuarios con permisos:", error);
    }
  };

  // Función para cargar usuarios desde la API
  const loadUsuarios = async () => {
    try {
      const response = await axios.get("https://localhost:7163/api/Usuario");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  // Función para cargar permisos desde la API
  const loadPermisos = async () => {
    try {
      const response = await axios.get("https://localhost:7163/api/Permiso");
      setPermisos(response.data);
    } catch (error) {
      console.error("Error al cargar permisos:", error);
    }
  };

  useEffect(() => {
    loadUsuariosConPermisos();
    loadUsuarios();
    loadPermisos();
  }, []);

  // Función para manejar el cambio de usuario seleccionado
  const handleUsuarioChange = (event) => {
    setIdUsuarioSeleccionado(event.target.value);
  };

  // Función para manejar el cambio de permiso seleccionado
  const handlePermisoChange = (event) => {
    setIdPermisoSeleccionado(event.target.value);
  };

  // Función para manejar el envío del formulario de asignación de permiso a usuario
  const handleSubmitAsignarPermiso = async () => {
    try {
      const usuarioSeleccionado = usuarios.find((usuario) => usuario.idusuario === idUsuarioSeleccionado);
      const permisoSeleccionado = permisos.find((permiso) => permiso.idpermiso === idPermisoSeleccionado);

      // Verificar si el usuario ya tiene un permiso asignado
      const usuarioYaTienePermiso = usuariosConPermisos.some((up) => up.idusuario === usuarioSeleccionado.idusuario);

      if (usuarioSeleccionado && permisoSeleccionado) {
        if (usuarioYaTienePermiso) {
          console.error("El usuario ya tiene asignado un permiso.");
          // Mostrar mensaje de error al usuario
          alert("El usuario ya tiene asignado un permiso. No se puede asignar otro.");
        } else {
          const data = {
            idusuario_permiso: 0,
            idusuario: usuarioSeleccionado.idusuario,
            usuario: {
              ...usuarioSeleccionado
            },
            idpermiso: permisoSeleccionado.idpermiso,
            permiso: {
              ...permisoSeleccionado
            }
          };
          await axios.post("https://localhost:7163/api/Usuario_Permiso", data);

          // Limpiar selecciones después de guardar exitosamente
          setIdUsuarioSeleccionado("");
          setIdPermisoSeleccionado("");
          loadUsuariosConPermisos(); // Recargar la lista de usuarios con permisos
        }
      } else {
        console.error("Usuario o permiso seleccionado no encontrado.");
      }
    } catch (error) {
      console.error("Error al asignar permiso a usuario:", error);
    }
  };

  // Función para manejar la eliminación de permiso asignado
  const handleEliminarPermiso = async (idUsuarioPermiso) => {
    try {
      await axios.delete(`https://localhost:7163/api/Usuario_Permiso/${idUsuarioPermiso}`);
      loadUsuariosConPermisos(); // Recargar la lista de usuarios con permisos después de eliminar
    } catch (error) {
      console.error("Error al eliminar permiso asignado:", error);
    }
  };

  // Función para manejar la edición de permiso asignado (opcional)
  const handleEditarPermiso = async (idUsuarioPermiso) => {
    try {
      // Implementa lógica para editar el permiso asignado si es necesario
      console.log("Editar permiso asignado con ID:", idUsuarioPermiso);
      // Puedes abrir un modal o formulario para editar los datos y luego enviar una solicitud PUT al backend
    } catch (error) {
      console.error("Error al editar permiso asignado:", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="Asignar Permisos a Usuarios" subtitle="Seleccione un usuario y un permiso para asignar" />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: "20px" }}>
            <Typography variant="h6" gutterBottom>
              Asignar Permiso a Usuario
            </Typography>
            <FormControl fullWidth variant="outlined" style={{ marginBottom: "10px" }}>
              <InputLabel id="usuario-label">Usuario</InputLabel>
              <Select
                labelId="usuario-label"
                value={idUsuarioSeleccionado}
                onChange={handleUsuarioChange}
                label="Usuario"
              >
                {usuarios.map((usuario) => (
                  <MenuItem key={usuario.idusuario} value={usuario.idusuario}>
                    {usuario.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="permiso-label">Permiso</InputLabel>
              <Select
                labelId="permiso-label"
                value={idPermisoSeleccionado}
                onChange={handlePermisoChange}
                label="Permiso"
              >
                {permisos.map((permiso) => (
                  <MenuItem key={permiso.idpermiso} value={permiso.idpermiso}>
                    {permiso.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
              onClick={handleSubmitAsignarPermiso}
            >
              Asignar Permiso
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabla de usuarios con permisos */}
      <Box mt="20px">
        <Typography variant="h6" gutterBottom>
          Usuarios con Permisos Asignados
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell>Permiso Asignado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuariosConPermisos.map((usuarioConPermiso) => (
                <TableRow key={usuarioConPermiso.idusuario_permiso}>
                  <TableCell>{usuarioConPermiso.usuario.nombre}</TableCell>
                  <TableCell>{usuarioConPermiso.usuario.cargo}</TableCell>
                  <TableCell>{usuarioConPermiso.permiso.nombre}</TableCell>
                  <TableCell>
                    {/* <Button
                      variant="outlined"
                      color="primary"
                      style={{ marginRight: "10px" }}
                      onClick={() => handleEditarPermiso(usuarioConPermiso.idusuario_permiso)}
                    >
                      Editar
                    </Button> */}
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleEliminarPermiso(usuarioConPermiso.idusuario_permiso)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default FAQ;
