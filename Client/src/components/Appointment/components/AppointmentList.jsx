import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdWbTwilight } from "react-icons/md";

import { GoClock } from "react-icons/go";
import {
  IoBriefcaseOutline,
  IoDocumentTextOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { LiaUserTieSolid } from "react-icons/lia";
import {
  MdOutlineDateRange,
  MdToday,
  MdUpcoming,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./AppointmentList.css";



const AppointmentList = ({ fromDate, toDate, isLoggedIn, setFetchAppointmentsRef }) => {

  const [appointments, setAppointments] = useState([]);
  const [showingPast, setShowingPast] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchAppointments = async () => {
    try {
      let url = "http://localhost:5000/api/appointments/upcoming";
      if (fromDate && toDate) {
        url = `http://localhost:5000/api/appointments/past?from=${fromDate}&to=${toDate}`;
        setShowingPast(true);
      } else {
        setShowingPast(false);
      }
      const res = await fetch(url);
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to load appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [fromDate, toDate]);
  


  useEffect(() => {
  if (setFetchAppointmentsRef) {
    setFetchAppointmentsRef(() => fetchAppointments);
  }
}, []);

const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const isToday = (dateStr) => {
  const today = new Date();
  const input = new Date(dateStr);

  return (
    today.getFullYear() === input.getFullYear() &&
    today.getMonth() === input.getMonth() &&
    today.getDate() === input.getDate()
  );
};

 const isTomorrow = (dateStr) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const input = new Date(dateStr);

  return (
    tomorrow.getFullYear() === input.getFullYear() &&
    tomorrow.getMonth() === input.getMonth() &&
    tomorrow.getDate() === input.getDate()
  );
};


  const now = new Date();

 const filteredToday = appointments.filter((a) => {
  if (!isToday(a.date)) return false;

  const apptTime = new Date(`${a.date}T${a.time}`);
  return apptTime > new Date();
});


  const filteredTomorrow = appointments.filter((a) => isTomorrow(a.date));
  const getDayAfterTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date;
};

 const filteredUpcoming = appointments.filter((a) => {
  const apptDate = new Date(`${a.date}T${a.time}`);
  return apptDate > getDayAfterTomorrow();
});
  const handleDelete = async (id) => {
    if (!isLoggedIn) {
      alert("Please login to delete appointments.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setAppointments((prev) => prev.filter((appt) => appt._id !== id));
        alert("Appointment deleted successfully");
      } else {
        const errorData = await res.json();
        alert(`Failed to delete appointment: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting appointment");
    }
  };

  const openEditModal = (appt) => {
    if (!isLoggedIn) {
      alert("Please login to edit appointments.");
      return;
    }
    setEditingAppointment(appt);
    setEditFormData({
      date: appt.date,
      time: appt.time,
      meetingWith: appt.meetingWith,
      designation: appt.designation,
      purpose: appt.purpose,
      vip: appt.vip || false,
    });
  };

  const closeEditModal = () => {
    setEditingAppointment(null);
    setEditFormData({});
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitEdit = async () => {
    if (!editingAppointment) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/appointments/${editingAppointment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        const updated = await res.json();
        setAppointments((prev) =>
          prev.map((appt) =>
            appt._id === updated.updatedAppointment._id ? updated.updatedAppointment : appt
          )
        );
        closeEditModal();
        alert("Appointment updated successfully");
      } else {
        const errorData = await res.json();
        alert(`Failed to update appointment: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating appointment");
    }
  };

  const renderCard = (appt, type) => (
    <div key={appt._id || appt.date + appt.time} className={`appointment-card ${type}`}>
      <div className="icone-group">
        {isLoggedIn && type !== "past" && (
          <CiEdit
            className="edit-icon"
            onClick={() => openEditModal(appt)}
            title="Edit Appointment"
          />
        )}
        {isLoggedIn && (
          <IoTrashOutline
            className="delete-icon"
            onClick={() => handleDelete(appt._id)}
            title="Delete Appointment"
          />
        )}
      </div>

      <div className="col left">
        <div className="date">
          <MdOutlineDateRange className="icon" />
          {new Date(appt.date).toLocaleDateString()}
        </div>
        <div className="time">
          <GoClock className="icon" />
          {appt.time}
        </div>
      </div>
      <div className="col middle">
        <div className="name">
          <LiaUserTieSolid className="icon" />
          <strong>{appt.meetingWith}</strong> {appt.vip && <span className="vip">VIP</span>}
        </div>
        <div className="designation">
          <IoBriefcaseOutline className="icon" />
          {appt.designation}
        </div>
      </div>
      <div className="col right">
        <div className="purpose">
          <IoDocumentTextOutline className="icon" />
          {appt.purpose}
        </div>
        {type === "today" && <span className="badge today">Today</span>}
        {type === "tomorrow" && <span className="badge tomorrow">Tomorrow</span>}
      </div>
    </div>
  );

  return (
    <>
      <div className="appointment-wrapper">
        {!showingPast && filteredToday.length > 0 && (
          <>
            <h2 className="section-title">
              <MdToday className="icons" />
              Today's Appointments
            </h2>
            <div className="appointments-list">
              {filteredToday.map((a) => renderCard(a, "today"))}
            </div>
          </>
        )}

        {!showingPast && filteredTomorrow.length > 0 && (
          <>
            <h2 className="section-title">
              <MdWbTwilight className="iconsss" />
              Tomorrow's Appointments
            </h2>
            <div className="appointments-list">
              {filteredTomorrow.map((a) => renderCard(a, "tomorrow"))}
            </div>
          </>
        )}

        {!showingPast && filteredUpcoming.length > 0 && (
          <>
            <h2 className="section-title">
              <MdUpcoming className="iconss" />
              Upcoming Appointments
            </h2>
            <div className="appointments-list">
              {filteredUpcoming.map((a) => renderCard(a, "upcoming"))}
            </div>
          </>
        )}

        {showingPast && appointments.length > 0 && (
          <>
            <h2 className="section-title">All Appointments</h2>
            <div className="appointments-list">
              {appointments.map((a) => renderCard(a, "past"))}
            </div>
          </>
        )}

        {appointments.length === 0 && (
          <p className="no-appointments">No appointments to show.</p>
        )}
         <div className="legend">
        <div>
          <span className="color-box today"></span>Today
        </div>
        <div>
          <span className="color-box tomorrow"></span>Tomorrow
        </div>
        <div>
          <span className="color-box future"></span>Future
        </div>
       
      </div>
         <div className="back-btn-container">
          <button className="back-btn" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>
      </div>
      

      {editingAppointment && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Appointment</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitEdit();
              }}
            >
              <label>
                Date:
                <input
                  type="date"
                  name="date"
                  value={editFormData.date}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Time:
                <input
                  type="time"
                  name="time"
                  value={editFormData.time}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Meeting With:
                <input
                  type="text"
                  name="meetingWith"
                  value={editFormData.meetingWith}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Designation:
                <input
                  type="text"
                  name="designation"
                  value={editFormData.designation}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Purpose:
                <input
                  type="text"
                  name="purpose"
                  value={editFormData.purpose}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                VIP:
                <input
                  type="checkbox"
                  name="vip"
                  checked={editFormData.vip}
                  onChange={handleEditChange}
                />
              </label>

              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={closeEditModal}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this appointment?")) {
                      handleDelete(editingAppointment._id);
                      closeEditModal();
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
          
        </div>
        
      )}
    </>
  );
};

export default AppointmentList;
