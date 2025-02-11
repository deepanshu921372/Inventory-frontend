import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, API_BASE_URL_IMAGE } from "./config";
import CustomAppBar from "./CustomAppBar";
import ScanImage from "./assets/scan.png";
import ShoppingList from "./assets/shoppingList.png";
import Family from "./assets/family.png";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const HomePage = () => {
  const storedDarkMode = localStorage.getItem("darkMode") === "true";
  const [darkMode, setDarkMode] = useState(storedDarkMode);
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      const fetchRecentItems = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/items/recent`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRecentItems(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error("Error fetching recent items:", error);
        }
      };

      fetchRecentItems();
    }

    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
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
      }}
    >
      <CustomAppBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Container maxWidth="lg">
        <Grid container spacing={3} style={{ marginTop: "20px" }}>
          <Grid
            item
            xs={12}
            sm={4}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Paper
              style={{
                padding: "20px",
                textAlign: "center",
                backgroundColor: darkMode ? "#333" : "#add8e6",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <img
                src={ScanImage}
                alt="Item"
                style={{ width: "100%", height: "auto", borderRadius: "10px" }}
              />
              <Typography
                variant="h6"
                style={{
                  color: darkMode ? "#fff" : "#000",
                  fontWeight: "bold",
                }}
              >
                Add Items
              </Typography>
              <Typography
                variant="body2"
                style={{ color: darkMode ? "#fff" : "#000" }}
              >
                Quickly add items to your inventory by scanning barcodes
              </Typography>
              <Button
                variant="contained"
                style={{
                  backgroundColor: darkMode ? "#8a2be2" : "#8a2be2",
                  color: "#fff",
                  border: "none",
                  position: "relative",
                  zIndex: 1,
                  outline: "none",
                  boxShadow: "none",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/scan")}
              >
                Add Items
              </Button>
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Paper
              style={{
                padding: "20px",
                textAlign: "center",
                backgroundColor: darkMode ? "#333" : "#add8e6",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <img
                src={ShoppingList}
                alt="Shopping List"
                style={{ width: "100%", height: "auto", borderRadius: "10px" }}
              />
              <Typography
                variant="h6"
                style={{
                  color: darkMode ? "#fff" : "#000",
                  fontWeight: "bold",
                }}
              >
                Inventory List
              </Typography>
              <Typography
                variant="body2"
                style={{ color: darkMode ? "#fff" : "#000" }}
              >
                View your inventory list and manage your items
              </Typography>
              <Button
                variant="contained"
                style={{
                  backgroundColor: darkMode ? "#8a2be2" : "#8a2be2",
                  color: "#fff",
                  position: "relative",
                  zIndex: 1,
                  outline: "none",
                  boxShadow: "none",
                }}
                onClick={() => navigate("/inventory")}
              >
                View List
              </Button>
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Paper
              style={{
                padding: "20px",
                textAlign: "center",
                backgroundColor: darkMode ? "#333" : "#add8e6",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <img
                src={Family}
                alt="Family"
                style={{ width: "100%", height: "auto", borderRadius: "10px" }}
              />
              <Typography
                variant="h6"
                style={{
                  color: darkMode ? "#fff" : "#000",
                  fontWeight: "bold",
                }}
              >
                Family Sharing
              </Typography>
              <Typography
                variant="body2"
                style={{ color: darkMode ? "#fff" : "#000" }}
              >
                Collaborate with family members to manage your household
              </Typography>
              <Button
                variant="contained"
                style={{
                  backgroundColor: darkMode ? "#8a2be2" : "#8a2be2",
                  color: "#fff",
                  position: "relative",
                  zIndex: 1,
                  outline: "none",
                  boxShadow: "none",
                }}
                onClick={() => navigate("/family")}
              >
                Manage Family
              </Button>
            </Paper>
          </Grid>
        </Grid>
        {isLoggedIn ? (
          <>
            <Typography
              variant="h5"
              style={{
                marginTop: "100px",
                color: darkMode ? "#fff" : "#000",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "24px",
              }}
            >
              Recently Added Items
            </Typography>
            <Grid container spacing={3} style={{ marginTop: "10px" }}>
              {recentItems
                .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
                .slice(0, 3)
                .map((item, index) => (
                  <Grid item xs={12} sm={4} key={index}>
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
                      <Typography
                        variant="h6"
                        style={{ color: darkMode ? "#fff" : "#000" }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ color: darkMode ? "#fff" : "#000" }}
                      >
                        Qty: {item.quantity}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ color: darkMode ? "#fff" : "#000" }}
                      >
                        Date Added:{" "}
                        {new Date(item.dateAdded).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
            </Grid>
          </>
        ) : (
          <Typography
            variant="h6"
            style={{
              marginTop: "100px",
              color: darkMode ? "#fff" : "#000",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            Login to show Recently Added Items
          </Typography>
        )}
      </Container>
      {showScroll && (
        <IconButton
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: darkMode ? "#8a2be2" : "#add8e6",
            color: darkMode ? "#fff" : "#000",
            outline: "none",
            boxShadow: "none",
            zIndex: 1000,
          }}
        >
          <ArrowUpwardIcon />
        </IconButton>
      )}
    </div>
  );
};

export default HomePage;
