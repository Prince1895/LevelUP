import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import Login from './Pages/Login';       // Login page receives setUser
import Signup from './Pages/Signup';     // Signup page can also receive setUser
import Dashboard from './Pages/Dashboard';
import Navbar from "./components/Navbar"; // Navbar uses user & setUser

const App = () => {
  const [user, setUser] = useState(null); // User is set only after login/signup

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Signup setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
      </Routes>
    </Router>
  );
};

export default App;
