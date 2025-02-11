// src/SignUpPage.jsx
import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from "react-router-dom";
import SignUpForm from "./SignUpForm";
import CustomAppBar from "./CustomAppBar";

const SignUpPage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <>
            <Container
                maxWidth={false}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    bgcolor: darkMode ? "#121212" : "#ffe4e1",
                    width: "100vw",
                    overflow: "hidden",
                }}
            >
                <SignUpForm darkMode={darkMode} />
            </Container>
        </>
    );
};

export default SignUpPage;