// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";

// function EditForm() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     date: "",
//     time: "",
//     venue: "",
//   });

//   useEffect(() => {
//     // Load existing appointment
//     axios.get(`/api/appointments/${id}`)
//       .then(res => setFormData(res.data))
//       .catch(err => console.error("Failed to load appointment:", err));
//   }, [id]);

//   const handleChange = e => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       await axios.put(`/api/appointments/${id}`, formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`
//         }
//       });
//       navigate("/"); // go back to homepage
//     } catch (err) {
//       console.error("Update failed", err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
//       <h2>Edit Appointment</h2>
//       <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
//       <input name="date" type="date" value={formData.date} onChange={handleChange} required />
//       <input name="time" type="time" value={formData.time} onChange={handleChange} required />
//       <input name="venue" value={formData.venue} onChange={handleChange} placeholder="Venue" required />
//       <button type="submit">Update</button>
//     </form>
//   );
// }

// export default EditForm;


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditForm.css";

function EditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    meetingWith: "",
    designation: "",
    purpose: "",
    vip: false,
  });

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/appointments/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error("Failed to fetch appointment:", err);
      }
    };

    fetchAppointment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/appointments/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Appointment updated successfully!");
      navigate("/");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update appointment.");
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Appointment</h2>
      <form onSubmit={handleSubmit}>
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label>Time</label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />

        <label>Person Name</label>
        <input
          type="text"
          name="meetingWith"
          value={formData.meetingWith}
          onChange={handleChange}
          placeholder="Enter full name"
          required
        />

        <label>Designation</label>
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Enter designation"
        />

        <label>Purpose of Visit</label>
        <textarea
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          placeholder="Enter purpose details"
        />

        <label>
          <input
            type="checkbox"
            name="vip"
            checked={formData.vip}
            onChange={handleChange}
          />
          VIP Appointment
        </label>

        <button type="submit">Update Appointment</button>
      </form>
    </div>
  );
}

export default EditForm;


