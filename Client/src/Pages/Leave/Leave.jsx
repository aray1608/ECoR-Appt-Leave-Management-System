import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import DateFilterBox from "../../components/Leave/components/DateFilterBox";
import EditForm from "../../components/Leave/components/EditForm";
import LeaveForm from "../../components/Leave/components/LeaveForm";
import LeaveList from "../../components/Leave/components/LeaveList";

function Leave({ showLogin, isLoggedIn }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [leaves, setLeaves] = useState([]);
  const fetchLeaves = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/leaves");
      const data = await res.json();

      if (Array.isArray(data)) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filtered =
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

        setLeaves(filtered);
      }
    } catch (err) {
      console.error("Failed to fetch leaves", err);
    }
  };
  useEffect(() => {
    fetchLeaves();
  }, [fromDate, toDate]);

  const handleFilter = (from, to) => {
    setFromDate(from);
    setToDate(to);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            {!showLogin && <DateFilterBox onFilter={handleFilter} />}
            <LeaveList
              leaves={leaves}
              fetchLeaves={fetchLeaves}
              fromDate={fromDate}
              toDate={toDate}
              isLoggedIn={isLoggedIn}
              showLogin={showLogin}
            />
          </>
        }
      />
      <Route
        path="leave/form"
        element={
          isLoggedIn ? <LeaveForm /> : <p>Please login to access this page.</p>
        }
      />
      <Route
        path="edit/:id"
        element={
          isLoggedIn ? <EditForm /> : <p>Please login to access this page.</p>
        }
      />
    </Routes>
  );
}

export default Leave;
