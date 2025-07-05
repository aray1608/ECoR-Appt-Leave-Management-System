import { useEffect, useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";

import {
  FaCalendarCheck,
  FaRegClock,
  FaSuitcase,
  FaUsers,
} from "react-icons/fa";
import Navbar from "./components/Navbar/Navbar.jsx";
import Appointment from "./Pages/Appointments/Appointments.jsx";
import Leave from "./Pages/Leave/Leave.jsx";

function HomePageSelector() {
  const navigate = useNavigate();

  const sectionStyle = {
    marginTop: "100px",
    padding: "0 20px",
    maxWidth: "1200px",
    marginLeft: "auto",
    marginRight: "auto",
    fontFamily: "Segoe UI, sans-serif",
  };

  const cardStyle = {
    flex: "1",
    minWidth: "300px",
    padding: "35px 25px",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.25)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    color: "#333",
    textAlign: "center",
    transition: "transform 0.4s ease, box-shadow 0.4s ease",
    cursor: "pointer",
    margin: "10px",
  };

  const buttonStyle = {
    marginTop: "20px",
    padding: "12px 24px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #1976d2, #42a5f5)",
    color: "white",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        minHeight: "100vh",

        fontFamily: "Segoe UI, sans-serif",
        textAlign: "center",
      }}
    >
      <div style={sectionStyle}>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            color: "#333",
            marginTop: "150px",
          }}
        >
          Welcome to Admin Portal
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#555",
            maxWidth: "800px",
            margin: "0 auto",
            marginTop: "10px",
          }}
        >
          Efficiently manage all appointments and staff leaves and tours from
          one centralized platform.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "60px",
          }}
        >
          {/* Leave Management Card */}
          <div
            style={cardStyle}
            onClick={() => navigate("/leave")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow =
                "0 16px 32px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(31, 38, 135, 0.2)";
            }}
          >
            <FaSuitcase style={{ fontSize: "3rem", color: "#1976d2" }} />
            <h2 style={{ marginTop: "20px" }}>Leave and Tour Management</h2>
            <p style={{ color: "#555", margin: "10px 0 20px" }}>
              Monitor leave and tours easily.
            </p>
            <button style={buttonStyle}>Enter Leave System</button>
          </div>

          {/* Appointment Management Card */}
          <div
            style={cardStyle}
            onClick={() => navigate("/appointment")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow =
                "0 16px 32px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(31, 38, 135, 0.2)";
            }}
          >
            <FaCalendarCheck style={{ fontSize: "3rem", color: "#e91e63" }} />
            <h2 style={{ marginTop: "20px" }}>Appointment Management</h2>
            <p style={{ color: "#555", margin: "10px 0 20px" }}>
              Schedule and handle official appointments.
            </p>
            <button
              style={{
                ...buttonStyle,
                background: "linear-gradient(135deg, #e91e63, #f06292)",
              }}
            >
              Enter Appointment System
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        style={{ ...sectionStyle, marginTop: "100px", marginBottom: "60px" }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "40px", color: "#333" }}>
          Why Use Our System?
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "40px",
            marginTop: "20px",
          }}
        >
          <div style={{ maxWidth: "300px" }}>
            <FaRegClock style={{ fontSize: "2.5rem", color: "#0288d1" }} />
            <h3>Time Saving</h3>
            <p style={{ color: "#555" }}>
              Save hours of manual effort through a digital management solution.
            </p>
          </div>
          <div style={{ maxWidth: "300px" }}>
            <FaUsers style={{ fontSize: "2.5rem", color: "#d81b60" }} />
            <h3>Easy Coordination</h3>
            <p style={{ color: "#555" }}>
              Keep departments aligned through a centralized appointment & leave
              hub.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Navbar
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      <Routes>
        <Route path="/" element={<HomePageSelector />} />

        <Route
          path="/leave/*"
          element={
            <Leave
              showLogin={showLogin}
              isLoggedIn={isLoggedIn}
              setShowLogin={setShowLogin}
            />
          }
        />

        <Route
          path="/appointment/*"
          element={
            <Appointment
              showLogin={showLogin}
              isLoggedIn={isLoggedIn}
              setShowLogin={setShowLogin}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
