const LinkCard = ({ link, baseUrl }) => {
  const shortUrl = `${baseUrl}/${link.shortCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      alert("Copied!");
    } catch (err) {
      // fallback for browsers that block clipboard API
      const input = document.createElement("input");
      input.value = shortUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      alert("Copied!");
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <div style={styles.urls}>
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            style={styles.shortUrl}
          >
            {shortUrl}
          </a>
          <p style={styles.originalUrl}>{link.originalUrl}</p>
        </div>
        <button onClick={handleCopy} style={styles.copyBtn}>
          Copy
        </button>
      </div>

      <div style={styles.meta}>
        <span style={styles.badge}>
          {link.totalClicks ?? 0} {link.totalClicks === 1 ? "click" : "clicks"}
        </span>
        <span style={styles.date}>
          {new Date(link.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "1.25rem 1.5rem",
    marginBottom: "12px",
    transition: "box-shadow 0.2s",
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "1rem",
  },
  urls: { flex: 1, minWidth: 0 },
  shortUrl: {
    color: "#2563eb",
    fontWeight: 600,
    fontSize: "1rem",
    textDecoration: "none",
    display: "block",
    marginBottom: "4px",
  },
  originalUrl: {
    color: "#6b7280",
    fontSize: "0.85rem",
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  copyBtn: {
    padding: "6px 14px",
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 500,
    flexShrink: 0,
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "12px",
  },
  badge: {
    background: "#eff6ff",
    color: "#2563eb",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  date: {
    color: "#9ca3af",
    fontSize: "0.8rem",
  },
};

export default LinkCard;
