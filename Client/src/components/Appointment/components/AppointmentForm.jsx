import { useState } from "react";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
  FaStar,
  FaUser,
} from "react-icons/fa";
import "./AppointmentForm.css";

const AppointmentForm = ({
  showForm,
  setShowForm,
  onClose,
  fetchAppointments,
}) => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    name: "",
    designation: "",
    purpose: "",
    vip: false,
  });

  if (!showForm) return null;

  const isToday = (dateString) => {
    const selected = new Date(dateString);
    const today = new Date();
    return (
      selected.getFullYear() === today.getFullYear() &&
      selected.getMonth() === today.getMonth() &&
      selected.getDate() === today.getDate()
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "time" && formData.date) {
      const now = new Date();
      const selectedDateTime = new Date(`${formData.date}T${value}`);

      if (isToday(formData.date) && selectedDateTime < now) {
        alert("You cannot select a past time for today's date.");
        return; // Don't update state with invalid time
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);

    if (selectedDateTime < now) {
      alert("You cannot select a past date or time.");
      return;
    }

    const payload = {
      date: formData.date,
      time: formData.time,
      meetingWith: formData.name,
      designation: formData.designation,
      purpose: formData.purpose,
      vip: formData.vip,
      venue: "IRCTC Office",
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to add appointments.");
        return;
      }

      const res = await fetch("http://localhost:5000/api/appointments/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Appointment added successfully!");

        handleReset();
        setShowForm(false);
        if (fetchAppointments) fetchAppointments();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Failed to connect to backend. Please try again.");
      console.error(error);
    }
  };

  const handleReset = () => {
    setFormData({
      date: "",
      time: "",
      name: "",
      designation: "",
      purpose: "",
      vip: false,
    });
  };

  const returnToHomepage = () => {
    setShowForm(false);
  };

  return (
    <div className="popup-overlay">
      <div className="appointment-form-container popup-box">
        <h2>Add New Appointment</h2>
      
        <form onSubmit={handleSubmit}>
          <label>
            Date
            <div className="input-wrapper">
              <FaCalendarAlt className="iconse" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </label>

          <label>
            Time
            <div className="input-wrapper">
              <FaClock className="iconse" />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                min={
                  isToday(formData.date)
                    ? (() => {
                        const now = new Date();
                        const hours = String(now.getHours()).padStart(2, "0");
                        const minutes = String(now.getMinutes()).padStart(
                          2,
                          "0"
                        );
                        return `${hours}:${minutes}`;
                      })()
                    : "00:00"
                }
                required
              />
            </div>
          </label>

          <label>
            Person Name
            <div className="input-wrapper">
              <FaUser className="iconse" />
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </label>

          <label>
            Designation
            <div className="input-wrapper">
              <FaBriefcase className="iconse" />
              <input
                type="text"
                name="designation"
                placeholder="Enter designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </div>
          </label>

          <label>
            Purpose of Visit
            <div className="input-wrapper">
              <textarea
                name="purpose"
                placeholder="Enter purpose details"
                value={formData.purpose}
                onChange={handleChange}
                rows="2"
                required
              />
            </div>
          </label>

          <div className="vip-checkbox">
            <input
              type="checkbox"
              name="vip"
              checked={formData.vip}
              onChange={handleChange}
              id="vip"
            />
            <label htmlFor="vip">
              <FaStar style={{ marginRight: "5px" }} className="iconse" /> VIP
              Appointment
            </label>
          </div>

          <div className="button-group">
            <button type="reset" onClick={handleReset}>
              Clear
            </button>
            <button type="submit">Add</button>
            <button type="button" onClick={returnToHomepage}>
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
