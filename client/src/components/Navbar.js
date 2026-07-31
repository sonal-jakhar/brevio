import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>
        Brevio
      </Link>
      <div style={styles.right}>
        {user && (
          <>
            <span style={styles.name}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 2rem",
    height: "60px",
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#2563eb",
    textDecoration: "none",
  },
  right: { display: "flex", alignItems: "center", gap: "16px" },
  name: { fontSize: "0.9rem", color: "#6b7280" },
  logoutBtn: {
    padding: "6px 14px",
    background: "transparent",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.85rem",
    color: "#374151",
  },
};

export default Navbar;
