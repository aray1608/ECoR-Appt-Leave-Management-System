import { useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./LeaveForm.css";

const LeaveForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    officer: "",
    from: "",
    to: "",
    outTo: "",
    purpose: "",
    type: "Leave",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/leaves/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Leave record added successfully!");
        handleReset();
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("Failed to connect to backend");
    }
  };

  const handleReset = () => {
    setFormData({
      officer: "",
      from: "",
      to: "",
      outTo: "",
      purpose: "",
      type: "Leave",
    });
  };

  const handleReturnHome = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/leave");
    }
  };

  return (
    <div className="appointment-form-container">
      <h2>Add Leave Record</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Officer Name
          <div className="input-wrapper">
            <FaUser className="iconse" />
            <input
              type="text"
              name="officer"
              value={formData.officer}
              onChange={handleChange}
              required
            />
          </div>
        </label>

        <label>
          From
          <div className="input-wrapper">
            <FaCalendarAlt className="iconse" />
            <input
              type="datetime-local"
              name="from"
              value={formData.from}
              onChange={handleChange}
              required
            />
          </div>
        </label>

        <label>
          To
          <div className="input-wrapper">
            <FaCalendarAlt className="iconse" />
            <input
              type="datetime-local"
              name="to"
              value={formData.to}
              onChange={handleChange}
              required
            />
          </div>
        </label>

        <label>
          Out To
          <div className="input-wrapper">
            <FaMapMarkerAlt className="iconse" />
            <input
              type="text"
              name="outTo"
              value={formData.outTo}
              onChange={handleChange}
              required
            />
          </div>
        </label>

        <label>
          Purpose
          <div className="input-wrapper">
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              rows="2"
              required
            />
          </div>
        </label>

        <label>
          Type
          <div className="input-wrapper">
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="Leave">Leave</option>
              <option value="Duty">Duty</option>
            </select>
          </div>
        </label>

        <div
          className="button-group"
          style={{ display: "flex", gap: "10px", marginTop: "20px" }}
        >
          <button type="reset" onClick={handleReset}>
            Clear
          </button>
          <button type="submit">Submit</button>
          <button
            type="button"
            onClick={handleReturnHome}
            className="secondary-btn"
          >
            Return to Homepage
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;
