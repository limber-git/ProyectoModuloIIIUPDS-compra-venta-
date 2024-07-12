import { Box, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "idpersona", headerName: "ID", width: 80, flex: 0.5 },
    { field: "tipo_persona", headerName: "Tipo de Persona", width: 150, flex: 1 },
    { field: "nombre", headerName: "Nombre", width: 180, flex: 1.5 },
    { field: "tipo_documento", headerName: "Tipo de Documento", width: 180, flex: 1.5 },
    { field: "num_documento", headerName: "Número de Documento", width: 180, flex: 1.5 },
    { field: "direccion", headerName: "Dirección", width: 180, flex: 1.5 },
    { field: "telefono", headerName: "Teléfono", width: 120, flex: 1 },
    { field: "email", headerName: "Email", width: 180, flex: 1.5 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 160,
      flex: 2,
      renderCell: (params) => (
        <>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleEditarPersona(params.row.idpersona)}
              style={{ marginRight: 5 }}
              startIcon={<EditIcon />}
            >
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setDeletePersonId(params.row.idpersona);
                setDeleteConfirmationOpen(true);
              }}
              startIcon={<DeleteIcon />}
            >
            </Button>
          </Box>
        </>
      ),
    },
  ];

  const [rows, setRows] = useState([]);
  const [editingPersonId, setEditingPersonId] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deletePersonId, setDeletePersonId] = useState(null);

  const [editedPersonData, setEditedPersonData] = useState({
    idpersona: "",
    tipo_persona: "",
    nombre: "",
    tipo_documento: "",
    num_documento: "",
    direccion: "",
    telefono: "",
    email: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get("https://localhost:7163/api/Persona")
      .then(response => {
        const personasWithId = response.data.map((persona) => ({
          ...persona,
          idpersona: persona.idpersona, // Usar idpersona como el identificador único
        }));
        setRows(personasWithId);
      })
      .catch(error => {
        console.error('Error fetching personas:', error);
      });
  };

  const handleEditarPersona = (id) => {
    setEditingPersonId(id);
    const personaToEdit = rows.find(persona => persona.idpersona === id);
    setEditedPersonData({
      idpersona: personaToEdit.idpersona,
      tipo_persona: personaToEdit.tipo_persona,
      nombre: personaToEdit.nombre,
      tipo_documento: personaToEdit.tipo_documento,
      num_documento: personaToEdit.num_documento,
      direccion: personaToEdit.direccion,
      telefono: personaToEdit.telefono,
      email: personaToEdit.email,
    });
  };

  const handleGuardarEdicionPersona = async () => {
    try {
      await axios.put(`https://localhost:7163/api/Persona/${editedPersonData.idpersona}`, editedPersonData);
      const updatedRows = rows.map(persona => {
        if (persona.idpersona === editedPersonData.idpersona) {
          return editedPersonData; // Usar datos editados
        }
        return persona;
      });
      setRows(updatedRows);
      setEditingPersonId(null);
    } catch (error) {
      console.error('Error al guardar la edición de la persona:', error);
    }
  };

  const handleEliminarPersona = async () => {
    try {
      await axios.delete(`https://localhost:7163/api/Persona/${deletePersonId}`);
      const updatedRows = rows.filter(persona => persona.idpersona !== deletePersonId);
      setRows(updatedRows);
      setDeleteConfirmationOpen(false);
      setDeletePersonId(null);
    } catch (error) {
      console.error("Error al eliminar persona:", error);
    }
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setDeletePersonId(null);
  };

  const handleChangeEditedPersonData = (e) => {
    const { name, value } = e.target;
    setEditedPersonData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Box m="20px">
      <Header
        title="PERSONAS"
        subtitle="Lista de Personas"
      />
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
          getRowId={(row) => row.idpersona} // Utiliza idpersona como el identificador único
          pageSize={10}
          checkboxSelection
        />
      </Box>

      {/* Modal para editar persona */}
      <Dialog open={editingPersonId !== null} onClose={() => setEditingPersonId(null)}>
        <DialogTitle>Editar Persona</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Tipo de Persona"
            name="tipo_persona"
            value={editedPersonData.tipo_persona}
            onChange={handleChangeEditedPersonData}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Nombre"
            name="nombre"
            value={editedPersonData.nombre}
            onChange={handleChangeEditedPersonData}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Tipo de Documento"
            name="tipo_documento"
            value={editedPersonData.tipo_documento}
            onChange={handleChangeEditedPersonData}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Número de Documento"
            name="num_documento"
            value={editedPersonData.num_documento}
            onChange={handleChangeEditedPersonData}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Dirección"
            name="direccion"
            value={editedPersonData.direccion}
            onChange={handleChangeEditedPersonData}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Teléfono"
            name="telefono"
            value={editedPersonData.telefono}
            onChange={handleChangeEditedPersonData}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={editedPersonData.email}
            onChange={handleChangeEditedPersonData}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingPersonId(null)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleGuardarEdicionPersona} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para confirmar eliminación */}
      <Dialog open={deleteConfirmationOpen} onClose={handleCloseDeleteConfirmation}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de que quieres eliminar esta persona?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleEliminarPersona} color="secondary" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Contacts;
