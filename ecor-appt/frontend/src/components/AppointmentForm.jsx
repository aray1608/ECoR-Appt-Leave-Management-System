import { useState } from 'react';
import {
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
  FaStar,
  FaUser
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AppointmentForm.css';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    name: '',
    designation: '',
    purpose: '',
    vip: false
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      date: formData.date,
      time: formData.time,
      meetingWith: formData.name,
      designation: formData.designation,
      purpose: formData.purpose,
      vip: formData.vip,
      venue: "IRCTC Office"
    };

    try {
      const token = localStorage.getItem('token'); // ✅ Get token
      const res = await fetch('http://localhost:5000/api/appointments/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ✅ Use token
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Appointment added successfully!');
        handleReset();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Failed to connect to backend. Please try again.');
      console.error(error);
    }
  };

  const handleReset = () => {
    setFormData({
      date: '',
      time: '',
      name: '',
      designation: '',
      purpose: '',
      vip: false
    });
  };

  const confirmReturnToHome = () => {
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    navigate('/');
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="appointment-form-container">
      <h2>Add New Appointment</h2>
      <p>Enter details to schedule a new appointment</p>
      <form onSubmit={handleSubmit}>

        <label>
          Date
          <div className="input-wrapper">
            <FaCalendarAlt className='iconse' />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </label>

        <label>
          Time
          <div className="input-wrapper">
            <FaClock className='iconse'/>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </label>

        <label>
          Person Name
          <div className="input-wrapper">
            <FaUser className='iconse' />
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
            <FaBriefcase className='iconse'/>
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
            <FaStar style={{ marginRight: '5px' }} className='iconse' /> VIP Appointment
          </label>
        </div>

        <div className="button-group">
          <button type="reset" onClick={handleReset}>Clear Form</button>
          <button type="submit">Add Appointment</button>
          <button type="button" onClick={confirmReturnToHome}>Return to Homepage</button>
        </div>
      </form>

      {showConfirmModal && (
        <div className="confirm-modal">
          <div className="modal-content">
            <p>Are you sure you want to go back? Unsaved data will be lost.</p>
            <div className="modal-buttons">
              <button onClick={handleConfirm}>Yes</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentForm;
