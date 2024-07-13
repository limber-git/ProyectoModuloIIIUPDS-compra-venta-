import React, { useState, useEffect, useContext } from 'react';
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';
import { Avatar, Box, IconButton, Typography, useTheme } from '@mui/material';
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
} from '@mui/icons-material';
import avatar from '../../../assets/images/avatar.png';
import logo from '../../../assets/images/logo.png';
import Item from './Item';
import { ToggledContext } from '../../../App';
import { tokens } from '../../../theme';

const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decodedToken = JSON.parse(jsonPayload);
    console.log('Decoded Token:', decodedToken);
    return decodedToken;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const getRoleLabel = (cargo) => {
  switch (cargo) {
    case 'admin':
      return 'Administrador';
    case 'vendedor':
      return 'Vendedor';
    case 'almacen':
      return 'Almacenero';
    default:
      return 'Usuario';
  }
};

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeJWT(token);
      if (decodedToken) {
        setUserData(decodedToken);
      }
    }
  }, []);

  const hasRole = (roles) => {
    return roles.includes(userData?.cargo);
  };

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        border: 0,
        height: '100%',
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu
        menuItemStyles={{
          button: { ':hover': { background: 'transparent' } },
        }}
      >
        <MenuItem
          rootStyles={{
            margin: '10px 0 20px 0',
            color: colors.gray[100],
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
                sx={{ transition: '.3s ease' }}
              >
                <img
                  style={{ width: '30px', height: '30px', borderRadius: '8px' }}
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            mb: '25px',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[100]}>
              <h1 style={{ textTransform: 'uppercase' }}>{userData ? userData.Login : ''}</h1>
            </Typography>
            <Typography
              variant="h6"
              fontWeight="500"
              color={colors.greenAccent[500]}
            >
              Nivel de acceso: {userData ? getRoleLabel(userData.cargo) : ''}
            </Typography>
          </Box>
        </Box>
      )}

      <Box mb={5} pl={collapsed ? undefined : '5%'}>
        <Menu
          menuItemStyles={{
            button: {
              ':hover': {
                color: '#868dfb',
                background: 'transparent',
                transition: '.4s ease',
              },
            },
          }}
        >
          <Item title="Inicio" path="/" colors={colors} icon={<DashboardOutlined />} />
        </Menu>
        {hasRole(['admin', 'vendedor', 'almacen']) && (
          <>
            <Typography
              variant="h6"
              color={colors.gray[300]}
              sx={{ m: '15px 0 5px 20px' }}
            >
              {!collapsed ? 'Productos' : ' '}
            </Typography>
            <Menu
              menuItemStyles={{
                button: {
                  ':hover': {
                    color: '#868dfb',
                    background: 'transparent',
                    transition: '.4s ease',
                  },
                },
              }}
            >
              {hasRole(['admin', 'almacen']) && (
                <>
                  <Item title="Categorias" path="/" colors={colors} icon={<DashboardOutlined />} />
                  <Item title="Articulos" path="/articulos" colors={colors} icon={<ReceiptOutlined />} />
                </>
              )}
              {hasRole(['admin', 'vendedor']) && (
                <>
                  <Item title="Venta" path="/ventas" colors={colors} icon={<ShoppingCartOutlined />} />
                  <Item title="Ingresos" path="/invoices" colors={colors} icon={<AttachMoneyOutlined />} />
                </>
              )}
              {hasRole(['admin', 'vendedor', 'almacen']) && (
                <Item title="Agregar persona" path="/addpersona" colors={colors} icon={<ContactsOutlined />} />
              )}
            </Menu>
          </>
        )}
        {hasRole(['admin']) && (
          <>
            <Typography
              variant="h6"
              color={colors.gray[300]}
              sx={{ m: '15px 0 5px 20px' }}
            >
              {!collapsed ? 'Usuario' : ' '}
            </Typography>
            <Menu
              menuItemStyles={{
                button: {
                  ':hover': {
                    color: '#868dfb',
                    background: 'transparent',
                    transition: '.4s ease',
                  },
                },
              }}
            >
              <Item title="Agregar Usuario" path="/form" colors={colors} icon={<PersonOutlined />} />
              <Item title="Tabla usuarios" path="/listusers" colors={colors} icon={<WavesOutlined />} />
              <Item title="Agregar Permiso" path="/formPermiso" colors={colors} icon={<CalendarTodayOutlined />} />
              <Item title="Asignar permisos" path="/faq" colors={colors} icon={<HelpOutlineOutlined />} />
            </Menu>
          </>
        )}
      </Box>
    </Sidebar>
  );
};

export default SideBar;
