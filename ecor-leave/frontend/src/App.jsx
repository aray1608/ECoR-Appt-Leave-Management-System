import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import DateFilterBox from "./components/DateFilterBox";
import LeaveList from "./components/LeaveList";
import LeaveForm from "./components/LeaveForm";
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

      <Routes>
        {/* <Route
          path="/"
          element={
            <>
              {!isLoggedIn && !showLogin && (
                <DateFilterBox onFilter={handleFilter} />
              )}
              <LeaveList
                fromDate={fromDate}
                toDate={toDate}
                isLoggedIn={isLoggedIn}
                showLogin={showLogin}
              />
            </>
          }
        /> */
        <Route
  path="/"
  element={
    <>
      {!showLogin && (
        <DateFilterBox onFilter={handleFilter} />
      )}
      <LeaveList
        fromDate={fromDate}
        toDate={toDate}
        isLoggedIn={isLoggedIn}
        showLogin={showLogin}
      />
    </>
  }
/>
}

        <Route
          path="/form"
          element={
            isLoggedIn ? <LeaveForm /> : <p>Please login to access this page.</p>
          }
        />
        <Route
          path="/edit/:id"
          element={
            isLoggedIn ? <EditForm /> : <p>Please login to access this page.</p>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
