// src/FamilyInfo.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Grid, Box, IconButton, Modal, TextField, Button } from '@mui/material';
import CustomAppBar from './CustomAppBar';
import axios from 'axios';
import { API_BASE_URL } from './config';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FamilyInfo = ({ darkMode, toggleDarkMode }) => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPasswordFields, setShowNewPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const token = localStorage.getItem('token');
        const userResponse = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const { address } = userResponse.data;

        const familyResponse = await axios.get(`${API_BASE_URL}/users/family`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { address }
        });

        setFamilyMembers(familyResponse.data);
      } catch (error) {
        console.error('Failed to fetch family members:', error);
        toast.error('Failed to fetch family members');
      }
    };

    fetchFamilyMembers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/users/family/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFamilyMembers(familyMembers.filter(member => member._id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleEdit = (member) => {
    setCurrentMember(member);
    setOpen(true);
  };

  const handleUpdate = async () => {
    if (showNewPasswordFields && newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const updateData = { ...currentMember };
      if (showNewPasswordFields) {
        updateData.password = newPassword;
      }

      await axios.put(`${API_BASE_URL}/users/family/${currentMember._id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFamilyMembers(familyMembers.map(member => member._id === currentMember._id ? currentMember : member));
      setOpen(false);
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
    }
  };

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#121212" : "#ffe4e1",
        minHeight: "100vh",
        transition: "0.3s",
        width: "100vw",
        paddingBottom: "100px",
      }}
    >
      <CustomAppBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Typography variant="h4" style={{ color: darkMode ? "#fff" : "#000", textAlign: "center", margin: "20px 0px", fontWeight: "bold", fontSize: "2rem" }}>
          Family Information
        </Typography>
        {familyMembers.length > 0 ? (
          <Grid container spacing={3}>
            {familyMembers.map((member, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper style={{ padding: '20px', backgroundColor: darkMode ? "#333" : "#add8e6", borderRadius: "10px", position: 'relative' }}>
                  <IconButton
                    style={{ position: 'absolute', top: 10, right: 40, outline: "none", boxShadow: "none" }}
                    onClick={() => handleEdit(member)}
                  >
                    <EditIcon style={{ color: darkMode ? "#fff" : "#000" }} />
                  </IconButton>
                  <IconButton
                    style={{ position: 'absolute', top: 10, right: 10, outline: "none", boxShadow: "none" }}
                    onClick={() => handleDelete(member._id)}
                  >
                    <DeleteIcon style={{ color: darkMode ? "#fff" : "#000" }} />
                  </IconButton>
                  <Typography variant="h6" style={{ fontWeight: "bold", color: darkMode ? "#fff" : "#000" }}>{member.name}</Typography>
                  <Typography variant="body1" style={{ color: darkMode ? "#fff" : "#000" }}>Email: {member.email}</Typography>
                  <Typography variant="body1" style={{ color: darkMode ? "#fff" : "#000" }}>Address: {member.address}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <Typography variant="h6" style={{ color: darkMode ? "#fff" : "#000", textAlign: "center" }}>
              No Family Members found. Login to see Members.
            </Typography>
          </Box>
        )}
      </Container>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            backgroundColor: darkMode ? "#333" : "#fff",
            padding: '20px',
            borderRadius: '10px',
            outline: "none",
            boxShadow: "none"
          }}
        >
          <IconButton
            style={{ position: 'absolute', top: 10, right: 10, outline: "none", boxShadow: "none" }}
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" style={{ marginBottom: '20px', color: darkMode ? "#fff" : "#000" }}>
            Edit Family Member
          </Typography>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={currentMember?.name || ''}
            onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
            style={{ marginBottom: '20px' }}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={currentMember?.email || ''}
            onChange={(e) => setCurrentMember({ ...currentMember, email: e.target.value })}
            style={{ marginBottom: '20px' }}
          />
          <TextField
            fullWidth
            label="Address"
            variant="outlined"
            value={currentMember?.address || ''}
            onChange={(e) => setCurrentMember({ ...currentMember, address: e.target.value })}
            style={{ marginBottom: '20px' }}
          />
          <TextField
            fullWidth
            label="Old Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={currentMember?.password || ''}
            disabled
            onChange={(e) => setCurrentMember({ ...currentMember, password: e.target.value })}
            style={{ marginBottom: '20px', outline: "none", boxShadow: "none" }}
            InputProps={{
              endAdornment: (
                <IconButton style={{ outline: "none", boxShadow: "none" }} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => setShowNewPasswordFields(true)}
            style={{ marginBottom: '20px', outline: "none", boxShadow: "none" }}
          >
            Change Password
          </Button>
          {showNewPasswordFields && (
            <>
              <TextField
                fullWidth
                label="New Password"
                variant="outlined"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ marginBottom: '20px', outline: "none", boxShadow: "none" }}
                InputProps={{
                  endAdornment: (
                    <IconButton style={{ outline: "none", boxShadow: "none" }} onClick={() => setShowNewPassword(!showNewPassword)}>
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                variant="outlined"
                type={showConfirmNewPassword ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                style={{ marginBottom: '20px', outline: "none", boxShadow: "none" }}
                InputProps={{
                  endAdornment: (
                    <IconButton style={{ outline: "none", boxShadow: "none" }} onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                      {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleUpdate}
            style={{outline: "none", boxShadow: "none"}}
          >
            Edit
          </Button>
        </Box>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default FamilyInfo;