// components/Sidebar.js
import { NavLink } from "react-router-dom";

const Sidebar = ({ links }) => {
  const activeLinkStyle = {
    backgroundColor: '#4f46e5', // indigo-600
    color: 'white',
  };

  return (
    <div className="w-64 h-screen bg-[#111] text-white fixed top-0 left-0 p-6 space-y-4 shadow-lg pt-24 ">
      <h2 className="text-2xl font-bold mb-6 px-3">Dashboard</h2>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              className="flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 hover:outline hover:outline-2 hover:outline-indigo-400"
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;