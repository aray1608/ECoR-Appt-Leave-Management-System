// import { useState } from 'react';
// import { FaRegUser, FaUnlockAlt } from "react-icons/fa";
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import logo from '../assets/Logo.png';
// import './Navbar.css';

// const Navbar = ({ showLogin, setShowLogin, isLoggedIn, setIsLoggedIn }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();   // Initialize navigate

//   const toggleLogin = () => {
//     if (isLoggedIn) {
//       // Logging out
//       setIsLoggedIn(false);
//       setShowLogin(false);
//       navigate('/');   // Navigate back to home on logout
//     } else {
//       // Show login form
//       setShowLogin(prev => !prev);
//     }
//   };

//   const handleLoginSubmit = (e) => {
//     e.preventDefault();

//     // Hardcoded credentials
//     const OFFICIAL_USERNAME = "admin";
//     const OFFICIAL_PASSWORD = "1234";

//     if (username === OFFICIAL_USERNAME && password === OFFICIAL_PASSWORD) {
//       setIsLoggedIn(true);
//       setShowLogin(false); // Hide login form after success
//       navigate('/');       // Optionally redirect to home on login
//     } else {
//       alert("Invalid credentials");
//     }
//   };

//   // New handler for Add Appointment button click
//   const handleAddAppointment = () => {
//     if (isLoggedIn) {
//       navigate('/form');
//     } else {
//       alert('Please login as admin to add appointments');
//     }
//   };

//   return (
//     <>
//       <nav className="navbar">
//         <div className="navbar-left">
//           <img src={logo} alt="Logo" className="logo" />
//         </div>

//         <div className="navbar-center">
//           <h1 className="main-heading">पूर्व तट रेलवे</h1>
//           <h2 className="sub-heading">(EAST COAST RAILWAY)</h2>
//         </div>

//         <div className="navbar-right">
//           {isLoggedIn && (
//             <button
//               className="add-appointment-btn"
//               onClick={handleAddAppointment}
//               style={{ marginRight: '10px' }}
//             >
//               Add Appointment
//             </button>
//           )}

//           <button className="login-btn" onClick={toggleLogin}>
//             {isLoggedIn ? 'Logout' : 'Login'}
//           </button>
//         </div>
//       </nav>

//       {showLogin && !isLoggedIn && (
//         <div className="login-form-container">
//           <div className="text">
//             <h2 className='heading'>IRCTC official Login</h2>
//             <p className='para'>Access the appointment management system</p>
//           </div>
//           <form className="login-form" onSubmit={handleLoginSubmit}>
//             <label>
//               Username
//               <div className="input-wrapperr">
//                 <FaRegUser className="input-icon" />
//                 <input
//                   type="text"
//                   value={username}
//                   onChange={e => setUsername(e.target.value)}
//                   placeholder='Enter your Username'
//                   required
//                   className="login-inputt"
//                 />
//               </div>
//             </label>
//             <label>
//               Password
//               <div className="input-wrapperr">
//                 <FaUnlockAlt className="input-icon" />
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={e => setPassword(e.target.value)}
//                   placeholder='Enter your Password'
//                   required
//                   className="login-inputt"
//                 />
//               </div>
//             </label>
//             <button type="submit" className="submit-btn">Submit</button>
//           </form>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;



import { useState } from 'react';
import { FaRegUser, FaUnlockAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import './Navbar.css';

const Navbar = ({ showLogin, setShowLogin, isLoggedIn, setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const toggleLogin = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token'); // 🔐 remove token on logout
      setIsLoggedIn(false);
      setShowLogin(false);
      navigate('/');
    } else {
      setShowLogin(prev => !prev);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token); // ✅ Save token
        setIsLoggedIn(true);
        setShowLogin(false);
        navigate('/');
      } else {
        alert('Login failed: ' + data.message);
      }
    } catch (err) {
      alert('Server error. Please try again.');
      console.error(err);
    }
  };

  const handleAddAppointment = () => {
    if (isLoggedIn) {
      navigate('/form');
    } else {
      alert('Please login as admin to add appointments');
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <div className="navbar-center">
          <h1 className="main-heading">पूर्व तट रेलवे</h1>
          <h2 className="sub-heading">(EAST COAST RAILWAY)</h2>
        </div>

        <div className="navbar-right">
          {isLoggedIn && (
            <button
              className="add-appointment-btn"
              onClick={handleAddAppointment}
              style={{ marginRight: '10px' }}
            >
              Add Appointment
            </button>
          )}
          <button className="login-btn" onClick={toggleLogin}>
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
        </div>
      </nav>

      {showLogin && !isLoggedIn && (
        <div className="login-form-container">
          <div className="text">
            <h2 className='heading'>IRCTC official Login</h2>
            <p className='para'>Access the appointment management system</p>
          </div>
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <label>
              Username
              <div className="input-wrapperr">
                <FaRegUser className="input-icon" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder='Enter your Username'
                  required
                  className="login-inputt"
                />
              </div>
            </label>
            <label>
              Password
              <div className="input-wrapperr">
                <FaUnlockAlt className="input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder='Enter your Password'
                  required
                  className="login-inputt"
                />
              </div>
            </label>
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Navbar;
