import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "./config";
import { useTheme } from "@mui/material/styles";

const CustomAppBar = ({ darkMode, toggleDarkMode }) => {
  const [userInitials, setUserInitials] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const { name } = response.data;
          const initials = name
            .split(" ")
            .map((n) => n[0])
            .join("");
          setUserInitials(initials);
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
      };
      fetchUserDetails();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Successfully logged out!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: darkMode ? "dark" : "light",
    });
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ToastContainer />
      <AppBar
        position="static"
        style={{
          backgroundColor: darkMode ? "#1e1e1e" : "#8a2be2",
          padding: isSmallScreen ? "10px 0px" : "0",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            style={{
              flexGrow: 1,
              fontWeight: "bold",
              fontSize: "24px",
              cursor: "pointer",
              color: "white",
            }}
            component={Link}
            to="/"
          >
            HomeStock
          </Typography>
          {isLoggedIn && location.pathname === "/" && !isSmallScreen ? (
            <Button
              onClick={handleLogout}
              color="inherit"
              style={{
                outline: "none",
                boxShadow: "none",
                color: "white",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              Logout
            </Button>
          ) : (
            !isSmallScreen &&
            location.pathname !== "/" && (
              <>
                {location.pathname !== "/scan" && (
                  <Button
                    component={Link}
                    to="/scan"
                    color="inherit"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      color: location.pathname === "/scan" ? "yellow" : "white",
                      fontWeight: "bold",
                      marginRight: "10px",
                    }}
                  >
                    Add Items
                  </Button>
                )}
                {location.pathname !== "/inventory" && (
                  <Button
                    component={Link}
                    to="/inventory"
                    color="inherit"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      color:
                        location.pathname === "/inventory" ? "yellow" : "white",
                      fontWeight: "bold",
                      marginRight: "10px",
                    }}
                  >
                    Inventory List
                  </Button>
                )}
                {location.pathname !== "/family" && (
                  <Button
                    component={Link}
                    to="/family"
                    color="inherit"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      color:
                        location.pathname === "/family" ? "yellow" : "white",
                      fontWeight: "bold",
                      marginRight: "10px",
                    }}
                  >
                    Family Details
                  </Button>
                )}
                {location.pathname !== "/logout" && (
                <Button
                  component={Link}
                  to="/"
                  color="inherit"
                  style={{
                    outline: "none",
                    boxShadow: "none",
                    color: location.pathname === "/logout" ? "yellow" : "white",
                    fontWeight: "bold",
                    marginRight: "10px",
                  }}
                  onClick={handleLogout}
                  >
                    Logout
                  </Button>
                )}
              </>
            )
          )}
          {isLoggedIn && (
            <IconButton
              onClick={isSmallScreen ? handleMenuOpen : null}
              color="inherit"
              style={{
                outline: "none",
                boxShadow: "none",
                color: "white",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              <Avatar sx={{ bgcolor: "deeppink", color: "white" }}>
                {userInitials}
              </Avatar>
            </IconButton>
          )}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                backgroundColor: darkMode ? "#333" : "#fff",
                color: darkMode ? "#fff" : "#000",
              },
            }}
          >
            <MenuItem component={Link} to="/scan" onClick={handleMenuClose}>
              Add Items
            </MenuItem>
            <MenuItem
              component={Link}
              to="/inventory"
              onClick={handleMenuClose}
            >
              Inventory List
            </MenuItem>
            <MenuItem component={Link} to="/family" onClick={handleMenuClose}>
              Family Details
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
          {!isLoggedIn && (
            <>
              <Button
                component={Link}
                to="/login"
                color="inherit"
                style={{
                  outline: "none",
                  boxShadow: "none",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                color="inherit"
                style={{
                  outline: "none",
                  boxShadow: "none",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Sign Up
              </Button>
            </>
          )}
          <Button
            onClick={toggleDarkMode}
            color="inherit"
            style={{
              outline: "none",
              boxShadow: "none",
            }}
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default CustomAppBar;
