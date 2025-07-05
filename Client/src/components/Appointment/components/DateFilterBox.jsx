import { useEffect, useRef, useState } from "react";
import { SlCalender } from "react-icons/sl";
import "./DateFilterBox.css";

const DateFilterBox = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = () => {
    if (fromDate && toDate) {
      onFilter(fromDate, toDate);
      setIsOpen(false);
    } else {
      alert("Please select both dates.");
    }
  };

  const handleCancel = () => {
    setFromDate("");
    setToDate("");
    onFilter("", "");
    setIsOpen(false);
  };

  return (
    <div className={`date-filter-containerr ${isOpen ? "open" : ""}`} ref={containerRef}>
      <div className="header" onClick={() => setIsOpen(!isOpen)}>
        <SlCalender className="calendar-icon" />
        <h2>View Appointments</h2>
        <div className="dropdown-toggle">
          Select Date Range
          <span className={`arrow ${isOpen ? "up" : "down"}`}>▾</span>
        </div>
      </div>

      <div className="date-range-section">
        <div className="input-group">
          <label htmlFor="from-date">From Date:</label>
          <input
            type="date"
            id="from-date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="to-date">To Date:</label>
          <input
            type="date"
            id="to-date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="buttons">
          <button className="cancel-btn" onClick={handleCancel}>
            Clear
          </button>
          <button className="apply-btn" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateFilterBox;
