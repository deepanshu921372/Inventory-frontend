import React, { useState, useRef } from 'react';
import { Button, Box } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from './config';

const CameraCapture = ({ onCapture }) => {
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }, // Use 'environment' for back camera
      });
      videoRef.current.srcObject = stream;
      setCameraOpen(true);
    } catch (error) {
      toast.error("Camera permission denied!");
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob);

      try {
        await axios.post(`${API_BASE_URL}/items/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Image uploaded successfully!");
      } catch (error) {
        toast.error("Failed to upload image.");
      }
    }, 'image/jpeg');

    video.srcObject.getTracks().forEach(track => track.stop()); // Stop the camera
    setCameraOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={openCamera}>
        Open Camera
      </Button>
      {cameraOpen && (
        <Box sx={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: '#fff', padding: '10px' }}>
          <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto' }} />
          <Button variant="contained" color="secondary" onClick={captureImage}>
            Capture Image
          </Button>
        </Box>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default CameraCapture; 