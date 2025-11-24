import React, { useEffect, useState } from "react";
import axios from "axios";
import LinkTable, { LinkItem } from "../components/LinkTable";

export default function DashboardPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [longUrl, setLongUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [error, setError] = useState("");

  // --------------------------------------------------------------------
  // LOAD LINKS FROM DATABASE
  // --------------------------------------------------------------------
  async function fetchLinks() {
    setError("");
    try {
      const res = await axios.get<LinkItem[]>("/api/links");
      setLinks(res.data);
    } catch (err: any) {
      console.error("Failed to fetch links:", err);
      setError("Cannot load links right now.");
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  // --------------------------------------------------------------------
  // CREATE SHORT LINK
  // --------------------------------------------------------------------
  async function createLink() {
    setError("");
    try {
      await axios.post("/api/links", {
        longUrl,
        customCode: customCode || undefined,
      });

      setLongUrl("");
      setCustomCode("");
      fetchLinks();
    } catch (err: any) {
      console.error(err);
      setError("Failed to create link.");
    }
  }

  // --------------------------------------------------------------------
  // DELETE LINK
  // --------------------------------------------------------------------
  async function deleteLink(code: string) {
    try {
      await axios.delete(`/api/links/${code}`);
      fetchLinks();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  // --------------------------------------------------------------------
  // COPY SHORT URL
  // --------------------------------------------------------------------
  function copyLink(code: string) {
    const shortUrl = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(shortUrl);
  }

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #031630, #001122)",
        minHeight: "100vh",
        padding: "30px",
        color: "white",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ------------------- CENTERED DASHBOARD HEADER ------------------- */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
          TinyLink — Dashboard
        </h1>
        <p style={{ fontSize: "15px", opacity: 0.8 }}>
          Create short links, view clicks, open/delete links and see stats.
        </p>
      </div>

      {/* ---------------------- CENTERED CARD WRAPPER --------------------- */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "550px",
            background: "#ffffff",
            color: "#000",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0px 8px 25px rgba(0,0,0,0.25)",
          }}
        >
          <h2>Shorten a long link</h2>

          <p style={{ color: "#444", marginBottom: "10px" }}>
            Paste your long link and create a short code.
          </p>

          <input
            placeholder="https://example.com/my-long-url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "10px",
            }}
          />

          <input
            placeholder="Custom code (6-8 chars)"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "12px",
            }}
          />

          <button
            onClick={createLink}
            style={{
              background: "#0099ff",
              color: "white",
              padding: "12px 18px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              width: "100%",
              fontWeight: 600,
            }}
          >
            Get your shortend link
          </button>

          <p style={{ fontSize: "13px", marginTop: "12px", color: "#555" }}>
            Custom codes: A-Za-z0-9 (6-8 chars) <br />
            Tip: leave code empty to auto-generate
          </p>

          {error && (
            <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
          )}
        </div>
      </div>

      {/* ---------------- Links table (replaced with organized LinkTable component) ---------------- */}
      <section style={{ marginTop: 40, maxWidth: 1100, marginInline: "auto", paddingInline: 20 }}>
        <h3 style={{ color: "#fff", marginBottom: 12 }}>Links</h3>

        <LinkTable
          links={links as LinkItem[]}
          onCopy={(code) => {
            // copy implementation (same as before)
            const short = `${window.location.origin}/${code}`;
            navigator.clipboard.writeText(short);
          }}
          onOpen={(code) => {
            window.open(`/${code}`, "_blank");
          }}
          onStats={(code) => {
            // open stats page (change path if your stats route differs)
            window.location.href = `/code/${code}`;
          }}
          onDelete={(code) => {
            // call your delete function
            deleteLink(code);
          }}
        />
      </section>

      <footer style={{ textAlign: "center", marginTop: "80px", opacity: 0.4 }}>
        © {new Date().getFullYear()} TinyLink
      </footer>
    </div>
  );
}
