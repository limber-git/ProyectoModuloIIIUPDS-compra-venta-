import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  IconButton,
  InputBase,
  useMediaQuery,
  useTheme,
  Modal,
  Typography,
  Avatar,
  Grid,
  Button,
  Divider,
  Badge,
} from "@mui/material";
import { tokens, ColorModeContext } from "../../../theme";
import {
  DarkModeOutlined,
  LightModeOutlined,
  MenuOutlined,
  NotificationsOutlined,
  PersonOutlined,
  SearchOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { ToggledContext } from "../../../App";

const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { toggled, setToggled } = useContext(ToggledContext);
  const isMdDevices = useMediaQuery("(max-width:768px)");
  const isXsDevices = useMediaQuery("(max-width:466px)");
  const colors = tokens(theme.palette.mode);

  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const decodedToken = JSON.parse(jsonPayload);
        setUserData(decodedToken);
      } catch (error) {
        console.log("Error decoding token:", error);
      }
    }
  }, []);

  const handleOpenProfile = () => setOpen(true);
  const handleOpenSettings = () => {
    if (userData && userData.cargo === "admin") {
      setOpen(true);
    } else {
      alert("¡Lo siento! No puedes configurar nada porque no eres el creador.");
    }
  };

  const handleClose = () => setOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null); // Limpiar el estado de userData
    setOpen(false); // Cerrar el modal
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            sx={{ display: `${isMdDevices ? "flex" : "none"}` }}
            onClick={() => setToggled(!toggled)}
          >
            <MenuOutlined />
          </IconButton>
          <Box
            display="flex"
            alignItems="center"
            bgcolor={colors.primary[400]}
            borderRadius="3px"
            sx={{ display: `${isXsDevices ? "none" : "flex"}` }}
          >
            <InputBase placeholder="Search" sx={{ ml: 2, flex: 1 }} />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchOutlined />
            </IconButton>
          </Box>
        </Box>

        <Box>
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <LightModeOutlined />
            ) : (
              <DarkModeOutlined />
            )}
          </IconButton>
          <IconButton>
            <Badge badgeContent={4} color="error">
              <NotificationsOutlined />
            </Badge>
          </IconButton>
          <IconButton onClick={handleOpenSettings}>
            <SettingsOutlined />
          </IconButton>
          <IconButton onClick={handleOpenProfile}>
            <PersonOutlined />
          </IconButton>
        </Box>
      </Box>

      {/* Profile Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="user-profile-modal"
        aria-describedby="user-profile-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 400,
            bgcolor: theme.palette.background.paper,
            boxShadow: 24,
            p: 4,
            borderRadius: 8,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} textAlign="center">
              <Avatar
                sx={{ width: 64, height: 64, mb: 2, mx: "auto" }}
                alt="User Avatar"
              >
                {userData && userData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ? userData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"].charAt(0) : "U"}
              </Avatar>
              <Typography variant="h6">{userData && userData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]}</Typography>
              <Typography variant="body2" color="text.secondary">
                {userData && userData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Teléfono: {userData && userData.Telefono}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cargo: {userData && userData.cargo}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Button variant="contained" onClick={handleLogout}>Cerrar Sesión</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default Navbar;
