import { Box, Button, TextField, useMediaQuery, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useState } from "react";

const initialValues = {
  nombre: "",
  tipo_documento: "",
  num_documento: "",
  direccion: "",
  telefono: "",
  email: "",
  cargo: "",
  login: "",
  clave: "",
  condicion: true,
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  nombre: yup.string().max(100, "Must be 100 characters or less").required("El nombre es obligatorio"),
  tipo_documento: yup.string().max(20, "Must be 20 characters or less").required("El tipoDocumento es obligatorio"),
  num_documento: yup.string().max(20, "Must be 20 characters or less").required("El numDocumento es obligatorio"),
  direccion: yup.string().max(70, "Must be 70 characters or less").required("La direccion es obligatoria"),
  telefono: yup.string().max(20, "Must be 20 characters or less").matches(phoneRegExp, "Phone number is not valid").required("El telefono es obligatorio"),
  email: yup.string().max(50, "Must be 50 characters or less").email("Invalid email").required("El email es obligatorio"),
  cargo: yup.string().max(20, "Must be 20 characters or less").required("El cargo es obligatorio"),
  login: yup.string().max(20, "Must be 20 characters or less").matches(/^[a-zA-Z0-9]+$/, "El login solo puede contener letras y números").required("El login es obligatorio"),
  clave: yup.string().max(64, "Must be 64 characters or less").required("La clave es obligatoria"),
  condicion: yup.boolean().required("La condicion es obligatoria"),
});

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleFormSubmit = async (values, actions) => {
    try {
      const response = await axios.post('https://localhost:7163/api/Usuario', values);
      console.log(response.data);
      actions.resetForm({
        values: initialValues,
      });
      setSnackbarMessage("Usuario creado con éxito");
      setSnackbarSeverity("success");
    } catch (error) {
      let errorMessage = "Error al crear el usuario";
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(4, 1fr)"
              sx={{
                "& > div": {
                  gridColumn: isNonMobile ? undefined : "span 4",
                },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nombre"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nombre}
                name="nombre"
                error={touched.nombre && Boolean(errors.nombre)}
                helperText={touched.nombre && errors.nombre}
                sx={{ gridColumn: "span 4" }}
              />
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                <InputLabel>Tipo de Documento</InputLabel>
                <Select
                  label="Tipo de Documento"
                  value={values.tipo_documento}
                  name="tipo_documento"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.tipo_documento && Boolean(errors.tipo_documento)}
                >
                  <MenuItem value="CI">CI</MenuItem>
                  <MenuItem value="NIT">NIT</MenuItem>
                  <MenuItem value="Pasaporte">Pasaporte</MenuItem>
                </Select>
                {touched.tipo_documento && errors.tipo_documento && (
                  <div style={{ color: "red", fontSize: "12px" }}>{errors.tipo_documento}</div>
                )}
              </FormControl>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Número de Documento"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.num_documento}
                name="num_documento"
                error={touched.num_documento && Boolean(errors.num_documento)}
                helperText={touched.num_documento && errors.num_documento}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Dirección"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.direccion}
                name="direccion"
                error={touched.direccion && Boolean(errors.direccion)}
                helperText={touched.direccion && errors.direccion}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Teléfono"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.telefono}
                name="telefono"
                error={touched.telefono && Boolean(errors.telefono)}
                helperText={touched.telefono && errors.telefono}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                <InputLabel>Seleccione un cargo</InputLabel>
                <Select
                  label="Cargo"
                  value={values.cargo}
                  name="cargo"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.cargo && Boolean(errors.cargo)}
                >
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="vendedor">Vendedor</MenuItem>
                  <MenuItem value="almacen">Almacenero</MenuItem>
                </Select>
                {touched.cargo && errors.cargo && (
                  <div style={{ color: "red", fontSize: "12px" }}>{errors.cargo}</div>
                )}
              </FormControl>

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Login"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.login}
                name="login"
                error={touched.login && Boolean(errors.login)}
                helperText={touched.login && errors.login}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Clave"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.clave}
                name="clave"
                error={touched.clave && Boolean(errors.clave)}
                helperText={touched.clave && errors.clave}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="end"
              mt="20px"
            >
              <Button type="submit" color="secondary" variant="contained">
                Crear Nuevo Usuario
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Form;
