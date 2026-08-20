import { Link, NavLink, useNavigate } from "react-router-dom";
import { Compass, LayoutDashboard, UserRound, ClipboardCheck, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <Link to="/dashboard" className="brand">
        <span className="brand-mark"><Compass size={20} /></span>
        <span>Career<span>Path</span></span>
      </Link>

      <nav>
        <NavLink to="/dashboard"><LayoutDashboard size={17}/> Dashboard</NavLink>
        <NavLink to="/profile"><UserRound size={17}/> Profile</NavLink>
        <NavLink to="/assessment"><ClipboardCheck size={17}/> Assessment</NavLink>
      </nav>

      <div className="nav-user">
        <div className="avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
        <span className="nav-name">{user?.name?.split(" ")[0]}</span>
        <button className="icon-btn" onClick={handleLogout} title="Logout"><LogOut size={18}/></button>
      </div>
    </header>
  );
}
