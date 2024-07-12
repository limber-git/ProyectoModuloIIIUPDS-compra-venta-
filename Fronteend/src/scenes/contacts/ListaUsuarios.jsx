import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles"; 
import { Header } from "../../components";

const ListUsers = () => {
  const [rows, setRows] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const [editedUserData, setEditedUserData] = useState({
    idusuario: "",
    nombre: "",
    tipo_documento: "",
    num_documento: "",
    direccion: "",
    telefono: "",
    email: "",
    cargo: "",
    login: "",
    clave: "",
    condicion: false,
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "nombre", headerName: "Nombre", width: 180, flex: 1.5 },
    { field: "tipo_documento", headerName: "Tipo de Documento", width: 180, flex: 1.5 },
    { field: "num_documento", headerName: "Número de Documento", width: 180, flex: 1.5 },
    { field: "direccion", headerName: "Dirección", width: 180, flex: 1.5 },
    { field: "telefono", headerName: "Teléfono", width: 120, flex: 1 },
    { field: "email", headerName: "Email", width: 180, flex: 1.5 },
    { field: "cargo", headerName: "Cargo", width: 150, flex: 1 },
    { field: "login", headerName: "Login", width: 150, flex: 1 },
    { field: "condicion", headerName: "Condición", width: 100, flex: 0.5, type: "boolean" },
    {
      field: "actions",
      headerName: "Acciones",
      width: 200,
      flex: 2,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" justifyContent="center">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleEditUser(params.row.idusuario)}
            style={{ marginRight: 5 }}
            startIcon={<EditIcon />}
          />
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setDeleteUserId(params.row.idusuario);
              setDeleteConfirmationOpen(true);
            }}
            startIcon={<DeleteIcon />}
          />
        </Box>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("https://localhost:7163/api/Usuario")
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => {
        console.error("Error fetching ListUsers:", error);
      });
  };

  const handleEditUser = (id) => {
    setEditingUserId(id);
    const userToEdit = rows.find((user) => user.idusuario === id);
    setEditedUserData(userToEdit);
  };

  const handleSaveEditUser = async () => {
    try {
      await axios.put(`https://localhost:7163/api/Usuario/${editedUserData.idusuario}`, editedUserData);
      const updatedRows = rows.map((user) => (user.idusuario === editedUserData.idusuario ? editedUserData : user));
      setRows(updatedRows);
      setEditingUserId(null);
      fetchData(); // Actualizar la lista después de editar
    } catch (error) {
      console.error("Error al guardar la edición del usuario:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`https://localhost:7163/api/Usuario/${deleteUserId}`);
      const updatedRows = rows.filter((user) => user.idusuario !== deleteUserId);
      setRows(updatedRows);
      setDeleteConfirmationOpen(false);
      setDeleteUserId(null);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setDeleteUserId(null);
  };

  const handleChangeEditedUserData = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedUserData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <Box m="20px">
      <Header title="USUARIOS" subtitle="Lista de Usuarios" />
      <Box
        mt="40px"
        height="75vh"
        maxWidth="100%"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            border: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-iconSeparator": {
            color: colors.primary[100],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.gray[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.idusuario}
          pageSize={10}
          checkboxSelection
        />
      </Box>

      {/* Modal para editar usuario */}
      <Dialog open={editingUserId !== null} onClose={() => setEditingUserId(null)}>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre"
            name="nombre"
            value={editedUserData.nombre}
            onChange={handleChangeEditedUserData}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Tipo de Documento"
            name="tipo_documento"
            value={editedUserData.tipo_documento}
            onChange={handleChangeEditedUserData}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Número de Documento"
            name="num_documento"
            value={editedUserData.num_documento}
            onChange={handleChangeEditedUserData}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Dirección"
            name="direccion"
            value={editedUserData.direccion}
            onChange={handleChangeEditedUserData}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Teléfono"
            name="telefono"
            value={editedUserData.telefono}
            onChange={handleChangeEditedUserData}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={editedUserData.email}
            onChange={handleChangeEditedUserData}
          />

          {/* ComboBox para seleccionar el cargo */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="cargo-label">Cargo</InputLabel>
            <Select
              labelId="cargo-label"
              id="cargo"
              value={editedUserData.cargo}
              name="cargo"
              onChange={handleChangeEditedUserData}
              fullWidth
            >
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="vendedor">Vendedor</MenuItem>
              <MenuItem value="almacen">Almacenero</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Login"
            name="login"
            value={editedUserData.login}
            onChange={handleChangeEditedUserData}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Clave"
            name="clave"
            type="password"
            value={editedUserData.clave}
            onChange={handleChangeEditedUserData}
          />
          <Box display="flex" alignItems="center" justifyContent="space-between" marginTop="10px">
            <label htmlFor="condicion">Condición</label>
            <input
              type="checkbox"
              id="condicion"
              name="condicion"
              checked={editedUserData.condicion}
              onChange={handleChangeEditedUserData}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingUserId(null)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSaveEditUser} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para confirmar eliminación */}
      <Dialog open={deleteConfirmationOpen} onClose={handleCloseDeleteConfirmation}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>¿Estás seguro de que deseas eliminar este usuario?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteUser} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListUsers;
