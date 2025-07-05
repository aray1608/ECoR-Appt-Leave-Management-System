import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { GoClock } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LiaUserTieSolid } from "react-icons/lia";
import { MdDeleteOutline, MdOutlineDateRange } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import "./LeaveList.css";
import EditForm from "./EditForm";

const LeaveList = ({ fromDate, toDate, isLoggedIn, showLogin }) => {
  const [leaves, setLeaves] = useState([]);
  const [editingLeaveId, setEditingLeaveId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchLeaves = async () => {
    try {
      let url = "http://localhost:5000/api/leaves";
      const res = await fetch(url);
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Invalid response format:", data);
        setLeaves([]);
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filteredLeaves =
        fromDate && toDate
          ? data.filter((leave) => {
              const from = new Date(leave.from).setHours(0, 0, 0, 0);
              const to = new Date(leave.to).setHours(0, 0, 0, 0);
              const rangeStart = new Date(fromDate).setHours(0, 0, 0, 0);
              const rangeEnd = new Date(toDate).setHours(0, 0, 0, 0);
              return to >= rangeStart && from <= rangeEnd;
            })
          : data.filter((leave) => {
              const from = new Date(leave.from).setHours(0, 0, 0, 0);
              const to = new Date(leave.to).setHours(0, 0, 0, 0);
              return to >= today;
            });

      setLeaves(filteredLeaves);
    } catch (error) {
      console.error("Failed to load leaves:", error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [fromDate, toDate, location.pathname]);

  useEffect(() => {
    const handleRefresh = () => fetchLeaves();
    window.addEventListener("refreshLeaves", handleRefresh);
    return () => window.removeEventListener("refreshLeaves", handleRefresh);
  }, []);

  const getDateClass = (from, to) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(to);
    toDate.setHours(0, 0, 0, 0);

    if (fromDate <= today && toDate >= today) return "today"; // ongoing + starts today
    if (fromDate.getTime() === today.getTime() + 86400000) return "tomorrow";
    if (fromDate > today) return "future";
    if (toDate < today) return "past";
    return "";
  };

  const handleEdit = (leave) => {
    if (!isLoggedIn) {
      alert("Please login to edit leaves.");
      return;
    }
    setEditingLeaveId(leave._id);
    // navigate(`/leave/edit/${leave._id}`);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this leave?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/leaves/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Leave deleted successfully.");
        fetchLeaves(); // refresh list
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Failed to delete leave.");
    }
  };

  const renderCard = (leave) => {
    const category = getDateClass(leave.from, leave.to);
    const cardClass = `leave-card ${category}`;

    return (
      <div key={leave._id} className={cardClass}>
        {isLoggedIn && category !== "past" && (
          <div className="admin-controls">
            <CiEdit
              className="edit-icon"
              onClick={() => handleEdit(leave)}
              title="Edit Leave"
            />
            <MdDeleteOutline
              className="delete-icon"
              onClick={() => handleDelete(leave._id)}
              title="Delete Leave"
            />
          </div>
        )}
        <div className="col left">
          <div className="date">
            <MdOutlineDateRange className="icon" />
            From: {new Date(leave.from).toLocaleDateString("en-GB")} <br />
            To: {new Date(leave.to).toLocaleDateString("en-GB")}
          </div>
          <div className="time">
            <GoClock className="icon" />
            Out To: {leave.outTo}
          </div>
        </div>
        <div className="col middle">
          <div className="name">
            <LiaUserTieSolid className="icon" />
            <strong>{leave.officer}</strong>
          </div>
        </div>
        <div className="col right">
          <div className="purpose">
            <IoDocumentTextOutline className="icon" />
            {leave.purpose}
          </div>
          <span className={`badge ${leave.type === "Duty" ? "duty" : "leave"}`}>
            {leave.type}
          </span>
        </div>
        {editingLeaveId && (
          <div className="blurred-backdrop">
            <div className="floating-edit-form">
              <EditForm
                id={editingLeaveId}
                onClose={() => setEditingLeaveId(null)}
                onSave={() => {
                  fetchLeaves();
                  setEditingLeaveId(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  if (showLogin && !isLoggedIn) return null;

  const groupedLeaves = {
    today: [],
    tomorrow: [],
    future: [],
    past: [],
  };

  leaves.forEach((leave) => {
    const category = getDateClass(leave.from, leave.to);
    if (groupedLeaves[category]) {
      groupedLeaves[category].push(leave);
    }
  });

  return (
    <div className="centered-page">
      <h2 className="section-title">Leave Records</h2>

      <div className="leave-list">
        {(() => {
          const groupOrder =
            fromDate && toDate
              ? ["past", "today", "tomorrow", "future"]
              : ["today", "tomorrow", "future"];

          return groupOrder.map((key) => {
            const list = groupedLeaves[key] || [];
            return list.length > 0 ? (
              <div key={key}>
                <h3 className="group-heading">
                  {key.charAt(0).toUpperCase() + key.slice(1)} Leaves
                </h3>
                {list.map((leave) => renderCard(leave))}
              </div>
            ) : null;
          });
        })()}
      </div>

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
  );
};

export default LeaveList;
