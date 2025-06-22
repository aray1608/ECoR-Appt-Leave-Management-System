import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { GoClock } from "react-icons/go";
import { IoBriefcaseOutline, IoDocumentTextOutline } from "react-icons/io5";
import { LiaUserTieSolid } from "react-icons/lia";
import { MdOutlineDateRange, MdToday, MdUpcoming } from "react-icons/md";
import "./AppointmentList.css";

const AppointmentList = ({ fromDate, toDate, isLoggedIn }) => {
  const [appointments, setAppointments] = useState([]);
  const [showingPast, setShowingPast] = useState(false);
  const navigate = useNavigate();

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

  const today = new Date().toISOString().split("T")[0];
  const isToday = (date) => date === today;

  const handleEdit = (appt) => {
    if (!isLoggedIn) {
      alert("Please login to edit appointments.");
      return;
    }
    navigate(`/edit/${appt._id}`);
  };

  const renderCard = (appt, type) => (
    <div key={appt._id || appt.date + appt.time} className={`appointment-card ${type}`}>
      <CiEdit
        className="edit-icon"
        onClick={() => handleEdit(appt)}
        title="Edit Appointment"
      />
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
          <strong>{appt.meetingWith}</strong>{" "}
          {appt.vip && <span className="vip">VIP</span>}
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
        {type === "today" && <span className="badge">Today</span>}
      </div>
    </div>
  );

  return (
    <div className="appointment-wrapper">
      {!showingPast && appointments.some((a) => isToday(a.date)) && (
        <>
          <h2 className="section-title">
            <MdToday className="icons" />
            Today's Appointments
          </h2>
          <div className="appointments-list">
            {appointments.filter((a) => isToday(a.date)).map((a) => renderCard(a, "today"))}
          </div>
        </>
      )}

      {!showingPast && appointments.some((a) => a.date > today) && (
        <>
          <h2 className="section-title">
            <MdUpcoming className="iconss" />
            Upcoming Appointments
          </h2>
          <div className="appointments-list">
            {appointments.filter((a) => a.date > today).map((a) => renderCard(a, "upcoming"))}
          </div>
        </>
      )}

      {showingPast && (
        <>
          <h2 className="section-title">Past Appointments</h2>
          <div className="appointments-list">
            {appointments.map((a) => renderCard(a, "past"))}
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentList;
