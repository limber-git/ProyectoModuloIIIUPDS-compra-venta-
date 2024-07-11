import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  Team,
  Invoices,
  Contacts,
  Form,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
  Permisos,
  AgregarPersona,
  Login,
  ResetPassword,
  ListUsers
} from "./scenes";
import PrivateRoute from "./PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import { jwtDecode } from 'jwt-decode';
// Asegúrate de tener jwt-decode instalado

const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          //const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            // Si el token ha expirado, eliminarlo del localStorage
            localStorage.removeItem("token");
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.log("Error decoding token:", error);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/resetPassword" element={<ResetPassword />} />

        <Route
          path="/"
          element={isAuthenticated ? <App /> : <Navigate to="/login" />}
        >
          <Route
            path="/"
            element={
              <PrivateRoute allowedRoles={["admin", "vendedor", "almacenero"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          {/* <Route
            path="/team"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Team />
              </PrivateRoute>
            }
          /> */}
          <Route
            path="/ventas"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Team />
              </PrivateRoute>
            }
          />
          <Route
            path="/ingresos"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Team />
              </PrivateRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Contacts />
              </PrivateRoute>
            }
          />
          <Route
            path="/addpersona"
            element={
              <PrivateRoute allowedRoles={["admin", "vendedor", "almacenero"]}>
                <AgregarPersona />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Invoices />
              </PrivateRoute>
            }
          />
          <Route
            path="/form"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Form />
              </PrivateRoute>
            }
          />
          <Route
            path="/listusers"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <ListUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/formPermiso"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Permisos />
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Calendar />
              </PrivateRoute>
            }
          />
          <Route
            path="/bar"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Bar />
              </PrivateRoute>
            }
          />
          <Route
            path="/pie"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Pie />
              </PrivateRoute>
            }
          />
          <Route
            path="/stream"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Stream />
              </PrivateRoute>
            }
          />
          <Route
            path="/line"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Line />
              </PrivateRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <FAQ />
              </PrivateRoute>
            }
          />
          <Route
            path="/geography"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Geography />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default AppRouter;
