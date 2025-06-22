import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditForm.css";

function EditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    officer: "",
    designation: "",
    from: "",
    to: "",
    outTo: "",
    purpose: "",
    type: "Leave",
  });

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/leaves/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error("Failed to fetch leave:", err);
      }
    };

    fetchLeave();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5001/api/leaves/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Leave updated successfully!");
      navigate("/");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update leave.");
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Leave Record</h2>
      <form onSubmit={handleSubmit}>
        <label>Officer Name</label>
        <input
          type="text"
          name="officer"
          value={formData.officer}
          onChange={handleChange}
          required
        />

        <label>Designation</label>
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
        />

        <label>From Date</label>
        <input
          type="date"
          name="from"
          value={formData.from}
          onChange={handleChange}
          required
        />

        <label>To Date</label>
        <input
          type="date"
          name="to"
          value={formData.to}
          onChange={handleChange}
          required
        />

        <label>Out To (Location)</label>
        <input
          type="text"
          name="outTo"
          value={formData.outTo}
          onChange={handleChange}
          required
        />

        <label>Purpose</label>
        <textarea
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          required
        />

        <label>Leave Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="Leave">Leave</option>
          <option value="Duty">Duty</option>
        </select>

        <button type="submit">Update Leave</button>
      </form>
    </div>
  );
}

export default EditForm;




