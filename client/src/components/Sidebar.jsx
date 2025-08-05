// components/Sidebar.js
import { Link } from "react-router-dom";

const Sidebar = ({ links }) => {
  return (
    <div className="w-64 h-screen bg-[#111] text-white fixed top-0 left-0 p-6 space-y-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className="block px-3 py-2 rounded hover:bg-gray-800 transition"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
