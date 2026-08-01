import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LinkCard from "../components/LinkCard";
import api from "../utils/api";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // fetch all links on mount
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const { data } = await api.get("/links");
        setLinks(data);
      } catch (err) {
        setError("Failed to load links");
      } finally {
        setPageLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    try {
      const payload = { originalUrl: url };
      if (alias.trim()) payload.customSlug = alias.trim();

      const { data } = await api.post("/links", payload);
      setLinks((prev) => [data, ...prev]);
      setUrl("");
      setAlias("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create link");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* Create link form */}
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Shorten a URL</h2>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleCreate} style={styles.form}>
            <input
              style={styles.input}
              type="url"
              placeholder="https://example.com/very-long-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Custom alias (optional)"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
            <button style={styles.button} type="submit" disabled={formLoading}>
              {formLoading ? "Shortening..." : "Shorten"}
            </button>
          </form>
        </div>

        {/* Links list */}
        <div style={styles.listHeader}>
          <h3 style={styles.listTitle}>Your Links</h3>
          <span style={styles.count}>{links.length} total</span>
        </div>

        {pageLoading ? (
          <p style={styles.msg}>Loading your links...</p>
        ) : links.length === 0 ? (
          <p style={styles.msg}>No links yet. Create your first one above.</p>
        ) : (
          links.map((link) => (
            <LinkCard key={link._id} link={link} baseUrl={BASE_URL} />
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: "100vh", background: "#f9fafb" },
  container: { maxWidth: "720px", margin: "0 auto", padding: "2rem 1rem" },
  formCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  formTitle: { margin: "0 0 1rem", fontSize: "1.1rem", fontWeight: 600 },
  error: {
    background: "#fff0f0",
    color: "#cc0000",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "12px",
    fontSize: "0.9rem",
  },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: {
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
  },
  button: {
    padding: "11px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  listTitle: { margin: 0, fontSize: "1rem", fontWeight: 600 },
  count: { fontSize: "0.85rem", color: "#6b7280" },
  msg: { color: "#6b7280", textAlign: "center", marginTop: "3rem" },
};

export default Dashboard;
