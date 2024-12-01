import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/images/Logo.png";

interface NavbarProps {
  user: string | null;
  role?: string; // เปลี่ยนเป็น optional
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, role, onLogout }) => {
  return (
    <nav>
      <ul>
        <li>
          {/* ใช้ Link สำหรับ Navigation ในแอป */}
          <Link to="/Home">
            <img src={logo} alt="Logo" className="navbar-logo" />
          </Link>
          {/* ใช้ <a> สำหรับเปิด URL ภายนอก */}
          <a
            href="https://cite.dpu.ac.th/ResumeDean.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            ResumeDean
          </a>
        </li>
        <li>
          <Link to="/aboutMe">About Me</Link>
        </li>
        <li>
          <Link to="/rules">Rules</Link>
        </li>
        {!user ? (
          <li>
            <Link to="/">Login Game</Link>
          </li>
        ) : (
          <li>
            <button onClick={onLogout}>Logout</button>
            {role && <span className="navbar-role">Role: {role}</span>}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
