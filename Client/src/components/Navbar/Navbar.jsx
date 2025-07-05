import { useState } from "react";
import { FaRegUser, FaUnlockAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png";
import LeaveForm from "../../components/Leave/components/LeaveForm";
import "./Navbar.css";

const Navbar = ({ showLogin, setShowLogin, isLoggedIn, setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isLeaveModule = location.pathname.startsWith("/leave");
  const isAppointmentModule = location.pathname.startsWith("/appointment");

  const toggleLogin = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setShowLogin(false);
      navigate("/");
    } else {
      setShowLogin((prev) => !prev);
    }
  };

  const handleAddAction = () => {
    if (!isLoggedIn) {
      alert("Please login as admin to proceed.");
      return;
    }

    if (isLeaveModule) {
      setShowLeaveForm(true);
      // navigate("/leave/leave/form");
    } else if (isAppointmentModule) {
      navigate("/appointment", { state: { openForm: true } });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        setShowLogin(false);
      } else {
        alert(data.message || "Invalid credentials.");
      }
    } catch (err) {
      alert("Server error during login.");
      console.error(err);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="logo"
              style={{ cursor: "pointer" }}
            />
          </Link>
        </div>

        <div className="navbar-center">
          <h1 className="main-heading">पूर्व तट रेलवे</h1>
          <h2 className="sub-heading">(EAST COAST RAILWAY)</h2>
        </div>

        <div className="navbar-right">
          {isLoggedIn && (isLeaveModule || isAppointmentModule) && (
            <button
              className="add-appointment-btn"
              onClick={handleAddAction}
              style={{ marginRight: "10px", border: "none" }}
            >
              {isLeaveModule ? "Add Leave" : "Add Appointment"}
            </button>
          )}

          <button className="login-btn" onClick={toggleLogin}>
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>
      </nav>

      {showLogin && !isLoggedIn && (
        <div className="login-modal-backdrop">
          <div className="login-form-container">
            <div className="login-form-container">
              <div className="text">
                <h2 className="heading">Admin official Login</h2>
                <p className="para">Access the management systems</p>
              </div>
              <form className="login-form" onSubmit={handleLoginSubmit}>
                <label>
                  Username
                  <div className="input-wrapperr">
                    <FaRegUser className="input-icon" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your Username"
                      required
                      className="login-inputt"
                    />
                  </div>
                </label>
                <label>
                  Password
                  <div className="input-wrapperr">
                    <FaUnlockAlt className="input-icon" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your Password"
                      required
                      className="login-inputt"
                    />
                  </div>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" className="submit-btn">
                    Submit
                  </button>
                  <button
                    style={{
                      flex: "1",
                      backgroundColor: "grey",
                      color: "white",
                    }}
                    onClick={() => setShowLogin(false)}
                    type="submit"
                    className="submit-btn1"
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showLeaveForm && isLeaveModule && (
        <div className="leave-popup-container">
          <LeaveForm
            onClose={() => setShowLeaveForm(false)}
            onSuccess={() => {
              setShowLeaveForm(false);
              const refreshEvent = new CustomEvent("refreshLeaves");
              window.dispatchEvent(refreshEvent);
            }}
          />
        </div>
      )}
    </>
  );
};

export default Navbar;
