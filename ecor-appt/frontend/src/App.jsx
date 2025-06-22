import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AppointmentForm from "./components/AppointmentForm";
import AppointmentList from "./components/AppointmentList";
import DateFilter from "./components/DateFilterBox";
import Navbar from "./components/Navbar";
import EditForm from "./components/EditForm";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleFilter = (from, to) => {
    setFromDate(from);
    setToDate(to);
  };

  return (
    <Router>
      <Navbar
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      {!showLogin && (
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* Show filters only for public view */}
                {!isLoggedIn && <DateFilter onFilter={handleFilter} />}
                <AppointmentList
                  fromDate={fromDate}
                  toDate={toDate}
                  isLoggedIn={isLoggedIn}
                />
              </>
            }
          />

          {/* Admin Add & Edit Routes (wrapped in fragment) */}
          {isLoggedIn && (
            <>
              <Route path="/form" element={<AppointmentForm />} />
              <Route path="/edit/:id" element={<EditForm />} />
            </>
          )}
        </Routes>
      )}
    </Router>
  );
}

export default App;
