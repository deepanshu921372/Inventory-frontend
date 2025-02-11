import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Paper,
  Box,
  Button,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomAppBar from "./CustomAppBar";
import axios from "axios";
import { API_BASE_URL, API_BASE_URL_IMAGE } from "./config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const InventoryList = ({ darkMode, toggleDarkMode }) => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showScroll, setShowScroll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchItems = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/items`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setItems(response.data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };

    fetchItems();
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target.result;
      let parsedData = [];

      if (file.type.includes("csv")) {
        Papa.parse(data, {
          header: true,
          complete: (results) => {
            parsedData = results.data;
            processFileData(parsedData);
          },
        });
      } else if (file.type.includes("sheet") || file.type.includes("excel")) {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        parsedData = XLSX.utils.sheet_to_json(sheet);
        processFileData(parsedData);
      }
    };

    if (file.type.includes("csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const processFileData = async (data) => {
    const token = localStorage.getItem("token");
    const top50Rows = data.slice(0, 50);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/items/bulk`,
        top50Rows,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setItems([...items, ...response.data]);
      toast.success("Top 50 items added successfully from file");
    } catch (error) {
      console.error("Failed to add items from file:", error);
      toast.error("Failed to add items from file");
    }
  };

  const downloadExcel = () => {
    const filteredItems = items.map(({ id, address, __v, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(filteredItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, "inventory.xlsx");
  };

  const handleDelete = async (itemId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(`${API_BASE_URL}/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.message === 'Item deleted successfully') {
        setItems(items.filter((item) => item._id !== itemId));
      } else if (response.data.message === 'Item quantity decreased') {
        const updatedItem = response.data.item;
        setItems(
          items.map((item) => (item._id === itemId ? updatedItem : item))
        );
      }

      toast.success(response.data.message);
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setOpen(true);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${API_BASE_URL}/items/${currentItem._id}`,
        {
          name: currentItem.name,
          quantity: currentItem.quantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        if (response.data.message === 'Item deleted successfully') {
          setItems(items.filter((item) => item._id !== currentItem._id));
        } else if (response.data.item) {
          setItems(
            items.map((item) =>
              item._id === currentItem._id ? response.data.item : item
            )
          );
        }
        toast.success(response.data.message);
        setOpen(false);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Failed to update item:", error.response?.data || error.message);
      toast.error("Failed to update item");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#121212" : "#ffe4e1",
        minHeight: "100vh",
        transition: "0.3s",
        width: "100vw",
        paddingBottom: "100px",
        position: "relative",
      }}
    >
      <CustomAppBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          style={{
            color: darkMode ? "#fff" : "#000",
            textAlign: "center",
            marginTop: "20px",
            fontWeight: "bold",
            fontSize: "2rem",
          }}
        >
          Inventory List
        </Typography>
        <Box display="flex" justifyContent="center" marginTop="20px">
          <Button
            variant="contained"
            style={{
              marginRight: "10px",
              backgroundColor: darkMode ? "#555" : "#1976d2",
              color: "#fff",
              outline: "none",
              boxShadow: "none",
            }}
            onClick={downloadExcel}
          >
            Download Inventory List
          </Button>
          <Button
            variant="contained"
            component="label"
            style={{
              backgroundColor: darkMode ? "#555" : "#1976d2",
              color: "#fff",
              outline: "none",
              boxShadow: "none",
            }}
          >
            Upload File to Add Items
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileUpload}
              hidden
            />
          </Button>
        </Box>
        {items.length > 0 ? (
          <Grid container spacing={4} style={{ marginTop: "20px" }}>
            {items
              .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
              .map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Paper
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      backgroundColor: darkMode ? "#333" : "#add8e6",
                      borderRadius: "15px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      transition: "transform 0.3s",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                    }}
                  >
                    {/* Display Item Image */}
                    {item.imageUrl ? (
                      <img
                        src={
                          item.imageUrl.startsWith("http")
                            ? item.imageUrl
                            : `${API_BASE_URL_IMAGE}/${item.imageUrl}`
                        }
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          marginBottom: "10px",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "200px",
                          borderRadius: "10px",
                          backgroundColor: "#ccc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="body2" style={{ color: "#000" }}>
                          No Image Available
                        </Typography>
                      </div>
                    )}

                    {/* Item Name */}
                    <Typography
                      variant="h5"
                      style={{
                        color: darkMode ? "#fff" : "#000",
                        fontWeight: "bold",
                      }}
                    >
                      {item.name}
                    </Typography>

                    {/* Item Quantity */}
                    <Typography
                      variant="body1"
                      style={{
                        color: darkMode ? "#fff" : "#000",
                      }}
                    >
                      Qty: {item.quantity}
                    </Typography>

                    {/* Date Added */}
                    <Typography
                      variant="body2"
                      style={{
                        color: darkMode ? "#fff" : "#000",
                        marginBottom: "10px",
                      }}
                    >
                      Date Added:{" "}
                      {new Date(item.dateAdded).toLocaleDateString()}
                    </Typography>

                    {/* Action Buttons */}
                    <Button
                      variant="contained"
                      color="primary"
                      style={{
                        marginTop: "10px",
                        marginRight: "5px",
                        outline: "none",
                        boxShadow: "none",
                      }}
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      style={{
                        marginTop: "10px",
                        outline: "none",
                        boxShadow: "none",
                      }}
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </Button>
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
            <Typography
              variant="h6"
              style={{ color: darkMode ? "#fff" : "#000", textAlign: "center" }}
            >
              No Items found in Inventory.
            </Typography>
          </Box>
        )}
      </Container>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: darkMode ? "#333" : "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <IconButton
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              outline: "none",
              boxShadow: "none",
            }}
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h6"
            style={{ marginBottom: "20px", color: darkMode ? "#fff" : "#000" }}
          >
            Edit Item
          </Typography>
          <TextField
            fullWidth
            label="Item Name"
            variant="outlined"
            value={currentItem?.name || ""}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, name: e.target.value })
            }
            style={{ marginBottom: "20px" }}
          />
          <TextField
            fullWidth
            label="Quantity"
            variant="outlined"
            type="number"
            value={currentItem?.quantity || ""}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, quantity: e.target.value })
            }
            style={{ marginBottom: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ outline: "none", boxShadow: "none" }}
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Box>
      </Modal>
      <ToastContainer />
      {showScroll && (
        <IconButton
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: darkMode ? "#8a2be2" : "#8a2be2",
            color: "#fff",
            zIndex: 1000,
            boxShadow: "none",
            outline: "none",
          }}
        >
          <KeyboardArrowUpIcon />
        </IconButton>
      )}
    </div>
  );
};

export default InventoryList;
