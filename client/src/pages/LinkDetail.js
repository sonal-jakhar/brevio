// client/src/pages/LinkDetail.js
import { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Navbar from "../components/Navbar";
import api from "../utils/api";

const COLORS = [
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
];

const LinkDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get(`/links/${id}/analytics`);
        setData(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [id]);

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />
        <p style={styles.msg}>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <Navbar />
        <p style={styles.msg}>{error}</p>
      </div>
    );
  }

  const { link, totalClicks, byCountry, byDevice, byBrowser } = data;

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <RouterLink to="/dashboard" style={styles.back}>
          ← Back to Dashboard
        </RouterLink>

        <div style={styles.header}>
          <h2 style={styles.title}>{link.shortCode}</h2>
          <p style={styles.original}>{link.originalUrl}</p>
          <div style={styles.totalBadge}>{totalClicks} total clicks</div>
        </div>

        {totalClicks === 0 ? (
          <p style={styles.msg}>
            No clicks yet. Share your link to start collecting data.
          </p>
        ) : (
          <div style={styles.grid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Clicks by Country</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={byCountry}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Clicks by Device</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={byDevice}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {byDevice.map((entry, i) => (
                      <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Clicks by Browser</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={byBrowser} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={90} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#7c3aed" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: "100vh", background: "#f9fafb" },
  container: { maxWidth: "960px", margin: "0 auto", padding: "2rem 1rem" },
  back: {
    color: "#2563eb",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  header: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "1.5rem",
    margin: "1rem 0 2rem",
  },
  title: {
    margin: "0 0 4px",
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#2563eb",
  },
  original: { margin: "0 0 12px", color: "#6b7280", fontSize: "0.9rem" },
  totalBadge: {
    display: "inline-block",
    background: "#eff6ff",
    color: "#2563eb",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: 600,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.25rem",
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "1.25rem",
  },
  cardTitle: { margin: "0 0 1rem", fontSize: "1rem", fontWeight: 600 },
  msg: { color: "#6b7280", textAlign: "center", marginTop: "3rem" },
};

export default LinkDetail;
