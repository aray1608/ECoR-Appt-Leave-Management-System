import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AppointmentForm from "../../components/Appointment/components/AppointmentForm";
import AppointmentList from "../../components/Appointment/components/AppointmentList";
import DateFilter from "../../components/Appointment/components/DateFilterBox";
import "./Appointments.css";

function Appointment({ showLogin, isLoggedIn }) {
  const location = useLocation();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [fetchAppointmentsRef, setFetchAppointmentsRef] = useState(null);

  const handleFilter = (from, to) => {
    setFromDate(from);
    setToDate(to);
  };

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  useEffect(() => {
    if (location.state?.openForm) {
      setShowForm(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <>
      {!showLogin && (
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className={`blur-wrapper ${showForm ? "blurred" : ""}`}>
                  <DateFilter onFilter={handleFilter} />
                  <AppointmentList
                    fromDate={fromDate}
                    toDate={toDate}
                    isLoggedIn={isLoggedIn}
                    setFetchAppointmentsRef={setFetchAppointmentsRef}
                    onAddAppointmentClick={openForm}
                  />
                </div>

                {showForm && (
                  <div className="modal-overlay">
                    <div className="modal-box">
                      <AppointmentForm
                        showForm={showForm}
                        setShowForm={setShowForm}
                        onClose={closeForm}
                        fetchAppointments={fetchAppointmentsRef}
                      />
                    </div>
                  </div>
                )}
              </>
            }
          />
        </Routes>
      )}
    </>
  );
}

export default Appointment;
