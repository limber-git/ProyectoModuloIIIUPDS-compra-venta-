// Router.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import App from './App';
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
} from './scenes';
import PrivateRoute from './PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext';

const AppRouter = () => {
  const { isAuthenticated, handleLogin } = useContext(AuthContext);

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
            index
            element={
              <PrivateRoute allowedRoles={['admin', 'vendedor', 'almacen']}>
                <Dashboard />
              </PrivateRoute>
            }
          />
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
            element={<PrivateRoute allowedRoles={['admin', 'vendedor']}> <Team /> </PrivateRoute>}
          />
          <Route
            path="/contacts"
            element={<PrivateRoute allowedRoles={['admin', 'vendedor']}> <Contacts /> </PrivateRoute>}
          />
          <Route
            path="/addpersona"
            element={<PrivateRoute allowedRoles={['admin', 'vendedor', 'almacen']}> <AgregarPersona /> </PrivateRoute>}
          />
          <Route
            path="/invoices"
            element={<PrivateRoute allowedRoles={['admin']}> <Invoices /> </PrivateRoute>}
          />
          <Route
            path="/form"
            element={<PrivateRoute allowedRoles={['admin']}> <Form /> </PrivateRoute>}
          />
          <Route
            path="/listusers"
            element={<PrivateRoute allowedRoles={['admin']}> <ListUsers /> </PrivateRoute>}
          />
          <Route
            path="/formPermiso"
            element={<PrivateRoute allowedRoles={['admin']}> <Permisos /> </PrivateRoute>}
          />
          <Route
            path="/calendar"
            element={<PrivateRoute allowedRoles={['admin']}> <Calendar /> </PrivateRoute>}
          />
          <Route
            path="/bar"
            element={<PrivateRoute allowedRoles={['admin']}> <Bar /> </PrivateRoute>}
          />
          <Route
            path="/pie"
            element={<PrivateRoute allowedRoles={['admin']}> <Pie /> </PrivateRoute>}
          />
          <Route
            path="/stream"
            element={<PrivateRoute allowedRoles={['admin']}> <Stream /> </PrivateRoute>}
          />
          <Route
            path="/line"
            element={<PrivateRoute allowedRoles={['admin']}> <Line /> </PrivateRoute>}
          />
          <Route
            path="/faq"
            element={<PrivateRoute allowedRoles={['admin']}> <FAQ /> </PrivateRoute>}
          />
          <Route
            path="/geography"
            element={<PrivateRoute allowedRoles={['admin']}> <Geography /> </PrivateRoute>}
          />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default AppRouter;
