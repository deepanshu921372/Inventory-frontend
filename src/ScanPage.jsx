import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import CustomAppBar from "./CustomAppBar";
import { API_BASE_URL } from "./config";
import Webcam from "react-webcam";

const ScanPage = ({ darkMode, toggleDarkMode }) => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDevices = useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  useEffect(() => {
    const fetchUserAddress = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUserAddress(response.data.address);
        } else {
          console.error("Failed to fetch user address, status code:", response.status);
        }
      } catch (error) {
        if (error.response) {
          console.error("Error response:", error.response.data);
        } else if (error.request) {
          console.error("Error request:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      }
    };

    fetchUserAddress();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to continue.", { position: "top-right" });
    }
  }, []);

  const videoConstraints = {
    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
  };

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  }, [webcamRef]);

  const handleRetake = () => {
    setImageSrc(null);
    setImage(null);
  };

  const handleDone = async () => {
    if (!imageSrc) return;
  
    try {
      setLoading(true);
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], `image_${Date.now()}.jpg`, { type: "image/jpeg" });
      setImage(file);
    } catch (error) {
      console.error("Error capturing image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to continue.", { position: "top-right" });
      return;
    }
    if (!itemName || !quantity || !image) {
      toast.error("Please fill all fields and capture an image.", { position: "top-right" });
      return;
    }

    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("quantity", quantity);
    formData.append("userAddress", userAddress);
    formData.append("image", image);

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/items/add-item`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Item added successfully!");
        setItemName("");
        setQuantity("");
        setImage(null);
        setImageSrc(null);
        window.location.reload();
      } else {
        throw new Error("Failed to add item");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized. Please log in again.", { position: "top-right" });
      } else {
        console.error("Error:", error);
        toast.error("Failed to add item. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <CustomAppBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Container
        maxWidth={false}
        sx={{
          bgcolor: darkMode ? "#121212" : "#ffe4e1",
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            bgcolor: darkMode ? "#333" : "#add8e6",
            padding: "20px",
            borderRadius: "10px",
            width: "100%",
            margin: "20px",
            maxWidth: "600px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              marginBottom: "20px",
              color: darkMode ? "#fff" : "#000",
              fontWeight: "bold",
            }}
          >
            Add New Item
          </Typography>

          <TextField
            label="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{
              marginBottom: "20px",
              width: "100%",
              input: { color: darkMode ? "#fff" : "#000" },
              label: { color: darkMode ? "#fff" : "#000" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: darkMode ? "#fff" : "#000",
                },
                "&:hover fieldset": {
                  borderColor: darkMode ? "#fff" : "#000",
                },
              },
            }}
          />
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            sx={{
              marginBottom: "20px",
              width: "100%",
              input: { color: darkMode ? "#fff" : "#000" },
              label: { color: darkMode ? "#fff" : "#000" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: darkMode ? "#fff" : "#000",
                },
                "&:hover fieldset": {
                  borderColor: darkMode ? "#fff" : "#000",
                },
              },
            }}
          />

          {!imageSrc && (
            <>
              <FormControl fullWidth sx={{ marginBottom: "20px" }}>
                <InputLabel sx={{ color: darkMode ? "#fff" : "#000" }}>
                  Select Camera
                </InputLabel>
                <Select
                  value={selectedDeviceId || ""}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  label="Select Camera"
                  sx={{
                    color: darkMode ? "#fff" : "#000",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#fff" : "#000",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#fff" : "#000",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select Camera</em>
                  </MenuItem>
                  {devices.map((device, index) => (
                    <MenuItem key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${index + 1}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedDeviceId && (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  style={{
                    width: "60%",
                    height: "auto",
                    marginBottom: "20px",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                />
              )}

              <Button
                variant="contained"
                onClick={captureImage}
                sx={{
                  marginBottom: "20px",
                  width: "100%",
                  bgcolor: darkMode ? "#1e90ff" : "blue",
                  color: "#fff",
                  "&:hover": {
                    bgcolor: darkMode ? "#1c86ee" : "darkblue",
                  },
                  boxShadow: "none",
                  border: "none",
                  outline: "none",
                  "&:focus": {
                    outline: "none",
                    boxShadow: "none",
                  },
                }}
              >
                Capture Image
              </Button>
            </>
          )}

          {imageSrc && (
            <Box sx={{ marginBottom: "20px" }}>
              <Typography
                variant="h6"
                sx={{ color: darkMode ? "#fff" : "#000", fontWeight: "bold" }}
              >
                Captured Image:
              </Typography>
              <img
                src={imageSrc}
                alt="Captured"
                style={{ width: "80%", height: "auto", display: "block", marginLeft: "auto", marginRight: "auto", marginBottom: "20px" }}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  marginBottom: "20px",
                }}
              >
                <Button
                  onClick={handleRetake}
                  sx={{
                    bgcolor: darkMode ? "#ff6347" : "#ff4500", 
                    color: "#fff",
                    "&:hover": {
                      bgcolor: darkMode ? "#ff7f50" : "#ff6347", 
                    },
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    borderRadius: "8px",
                    "&:focus": {
                      outline: "none",
                      boxShadow: "none",
                    },
                    transition: "background-color 0.3s, transform 0.3s",
                    "&:active": {
                      transform: "scale(0.95)", 
                    },
                  }}
                >
                  Retake
                </Button>
                <Button
                  onClick={handleDone}
                  sx={{
                    bgcolor: darkMode ? "#32cd32" : "#28a745", 
                    color: "#fff",
                    "&:hover": {
                      bgcolor: darkMode ? "#3cb371" : "#218838", 
                    },
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    "&:focus": {
                      outline: "none",
                      boxShadow: "none",
                    },
                    borderRadius: "8px",
                    transition: "background-color 0.3s, transform 0.3s",
                    "&:active": {
                      transform: "scale(0.95)", 
                    },
                  }}
                >
                  Done
                </Button>
              </Box>
            </Box>
          )}

          <Button
            variant="contained"
            onClick={handleAddItem}
            sx={{
              bgcolor: darkMode ? "#ff1493" : "deeppink",
              "&:hover": { bgcolor: darkMode ? "#ff69b4" : "hotpink" },
              width: "100%",
              color: "#fff",
              boxShadow: "none",
              border: "none",
              outline: "none",
              "&:focus": {
                outline: "none",
                boxShadow: "none",
              },
            }}
          >
            Add Item
          </Button>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Container>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </>
  );
};

export default ScanPage;
