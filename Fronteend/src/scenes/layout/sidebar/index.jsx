// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import App from "../../../App";
// import { ToggledContext } from "../../../App";
// import {
//   Dashboard,
//   Team,
//   Invoices,
//   Contacts,
//   Form,
//   Bar,
//   Line,
//   Pie,
//   FAQ,
//   Geography,
//   Calendar,
//   Stream,
//   Permisos,
//   AgregarPersona,
//   Login,
//   ResetPassword,
//   ListUsers
// } from "../../../scenes";
// import PrivateRoute from "../../../PrivateRoute";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { jwtDecode } from 'jwt-decode'; // Asegúrate de tener jwt-decode instalado

// const AppRouter = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem("token");
//       console.log(token)
//       if (token) {
//         try {
//           const decodedToken = jwtDecode(token);
//           console.log(decodedToken);
//           const currentTime = Date.now() / 1000;
//           if (decodedToken.exp < currentTime) {
//             // Si el token ha expirado, eliminarlo del localStorage
//             localStorage.removeItem("token");
//             setIsAuthenticated(false);
//           } else {
//             setIsAuthenticated(true);
//           }
//         } catch (error) {
//           console.log("Error decoding token:", error);
//           localStorage.removeItem("token");
//           setIsAuthenticated(false);
//         }
//       } else {
//         setIsAuthenticated(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const handleLogin = (token) => {
//     localStorage.setItem("token", token);
//     setIsAuthenticated(true);
//   };

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login onLogin={handleLogin} />} />
//         <Route path="/resetPassword" element={<ResetPassword />} />

//         <Route
//           path="/"
//           element={isAuthenticated ? <App /> : <Navigate to="/login" />}
//         >
//           <Route
//             path="/"
//             element={
//               <PrivateRoute allowedRoles={["admin", "vendedor", "almacenero"]}>
//                 <Dashboard />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/team"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <Team />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/contacts"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <Contacts />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/addpersona"
//             element={
//               <PrivateRoute allowedRoles={["admin", "vendedor", "almacenero"]}>
//                 <AgregarPersona />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/invoices"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <Invoices />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/form"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <Form />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/listusers"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <ListUsers />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/formPermiso"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <Permisos />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/calendar"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <Calendar />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/bar"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <Bar />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/pie"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <Pie />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/stream"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <Stream />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/line"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <Line />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/faq"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <FAQ />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/geography"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <Geography />
//               </PrivateRoute>
//             }
//           />
//         </Route>
//       </Routes>
//       <ToastContainer />
//     </Router>
//   );
// };

// export default AppRouter;



/* eslint-disable react/prop-types */
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  BarChartOutlined,
  CalendarTodayOutlined,
  ContactsOutlined,
  DashboardOutlined,
  DonutLargeOutlined,
  HelpOutlineOutlined,
  MapOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutline,
  PersonOutlined,
  ReceiptOutlined,
  TimelineOutlined,
  WavesOutlined,
  AttachMoneyOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import avatar from "../../../assets/images/avatar.png";
import logo from "../../../assets/images/logo.png";
import Item from "./Item";
import { ToggledContext } from "../../../App";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        border: 0,
        height: "100%",
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu
        menuItemStyles={{
          button: { ":hover": { background: "transparent" } },
        }}
      >
        <MenuItem
          rootStyles={{
            margin: "10px 0 20px 0",
            color: colors.gray[100],
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
                sx={{ transition: ".3s ease" }}
              >
                <img
                  style={{ width: "30px", height: "30px", borderRadius: "8px" }}
                  src={logo}
                  alt="Argon"
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textTransform="capitalize"
                  color={colors.greenAccent[500]}
                >
                  AHICITO
                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>
      {!collapsed && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            mb: "25px",
          }}
        >
          {/* <Avatar
            alt="avatar"
            src={avatar}
            sx={{ width: "100px", height: "100px" }}
          /> */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[100]}>
              Colocar nombre del usuario
            </Typography>
            <Typography
              variant="h6"
              fontWeight="500"
              color={colors.greenAccent[500]}
            >
              Nivel de acceso
            </Typography>
          </Box>
        </Box>
      )}

      <Box mb={5} pl={collapsed ? undefined : "5%"}>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Inicio"
            path="/"
            colors={colors}
            icon={<DashboardOutlined />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Productos" : " "}
        </Typography>{" "}
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Categorias"
            path="/"
            colors={colors}
            icon={<DashboardOutlined />}
          />
          {/* <Item
            title="Venta00000"
            path="/team"
            colors={colors}
            icon={<PeopleAltOutlined />}
          /> */}
          <Item
            title="Venta"
            path="/ventas"
            colors={colors}
            icon={<ShoppingCartOutlined />}
          />
          <Item
            title="Ingresos"
            path="/ingresos"
            colors={colors}
            icon={<AttachMoneyOutlined />}
          />
          
          <Item
            title="Agregar persona"
            path="/addpersona"
            colors={colors}
            icon={<ContactsOutlined />}
          />
          <Item
            title="Contacts Information"
            path="/contacts"
            colors={colors}
            icon={<ContactsOutlined />}
          />
          <Item
            title="Articulos"
            path="/invoices"
            colors={colors}
            icon={<ReceiptOutlined />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Usuario" : " "}
        </Typography>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Agregar Usuario"
            path="/form"
            colors={colors}
            icon={<PersonOutlined />}
          />
          <Item
            title="Tabla usuarios"
            path="/ListUsers"
            colors={colors}
            icon={<WavesOutlined />}
          />
          <Item
            title="Agregar Permiso"
            path="/formPermiso"
            colors={colors}
            icon={<CalendarTodayOutlined />}
          />
          <Item
            title="Asignar permisos"
            path="/faq"
            colors={colors}
            icon={<HelpOutlineOutlined />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Charts" : " "}
        </Typography>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
           <Item
            title="LOGIN"
            path="/login"
            colors={colors}
            icon={<BarChartOutlined />}
          />
          <Item
            title="Restaurar clave"
            path="/resetPassword"
            colors={colors}
            icon={<DonutLargeOutlined />}
          />{/*
          <Item
            title="Line Chart"
            path="/line"
            colors={colors}
            icon={<TimelineOutlined />}
          />
          <Item
            title="Geography Chart"
            path="/geography"
            colors={colors}
            icon={<MapOutlined />}
          />
          <Item
            title="Stream Chart"
            path="/stream"
            colors={colors}
            icon={<WavesOutlined />}
          /> */}
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideBar;
