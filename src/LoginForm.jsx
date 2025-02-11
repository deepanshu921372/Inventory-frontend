import React, { useState } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { API_BASE_URL } from './config'; // Import the base URL

const LoginForm = ({ darkMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email) && password) {
      try {
        const response = await axios.post(`${API_BASE_URL}/users/login`, { // Use the base URL
          email,
          password
        });
        const { token } = response.data;
        localStorage.setItem('token', token); // Store the token in local storage
        toast.success("Successfully signed in!", {
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
          navigate("/");
        }, 1000);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Login failed.";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: darkMode ? "dark" : "light",
        });
      }
    } else {
      toast.error("Please enter a valid email and password.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light",
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          bgcolor: darkMode ? "#333" : "background.paper",
          boxShadow: 3,
          borderRadius: 3,
          p: 4,
          textAlign: "center",
          width: "100%",
          maxWidth: { xs: "100%", sm: 400 },
          mx: "auto",
          mt: 5,
          background: "linear-gradient(135deg, #ffe4e1, #f8cdda)",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <HomeIcon sx={{ color: "deeppink", mr: 1 }} />
          <Typography
            variant="h5"
            sx={{
              color: "deeppink",
              fontWeight: "bold",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            HomeStock
          </Typography>
        </Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontFamily: "Roboto, sans-serif",
            color: "black",
            fontWeight: "bold",
          }}
        >
          Welcome back!
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          gutterBottom
          sx={{ fontFamily: "Roboto, sans-serif", color: "gray" }}
        >
          Enter your credentials to access your account
        </Typography>
        <form noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "deeppink" },
                "&:hover fieldset": { borderColor: "hotpink" },
              },
            }}
          />
          <Box sx={{ position: "relative", mt: 2 }}>
            <TextField
              fullWidth
              label="Password"
              margin="normal"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                bgcolor: "white",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "deeppink" },
                  "&:hover fieldset": { borderColor: "hotpink" },
                },
              }}
            />
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              sx={{
                position: "absolute",
                right: 10,
                top: 25,
                color: "deeppink",
                "&:focus": { outline: "none" },
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </IconButton>
          </Box>
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              bgcolor: "deeppink",
              "&:hover": {
                bgcolor: "hotpink",
                color: "black",
                transition: "0.3s",
              },
              color: "white",
              fontWeight: "bold",
              boxShadow: "none",
              "&:focus": { outline: "none" },
            }}
            onClick={handleSignIn}
          >
            Sign In
          </Button>
        </form>
        <Typography
          variant="body2"
          sx={{ mt: 2, fontFamily: "Roboto, sans-serif", color: "gray" }}
        >
          Don't have an account?{" "}
          <Button
            onClick={() => navigate("/signup")}
            sx={{
              color: "deeppink",
              fontWeight: "bold",
              boxShadow: "none",
              "&:focus": { outline: "none" },
            }}
          >
            Sign up
          </Button>
        </Typography>
      </Box>
    </>
  );
};

export default LoginForm;
