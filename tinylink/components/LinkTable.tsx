// components/LinkTable.tsx
import React from "react";

export type LinkItem = {
  code: string;
  longUrl: string;
  clicks?: number;
  lastClicked?: string | null;
};

type Props = {
  links: LinkItem[];
  onCopy: (code: string) => void;
  onOpen: (code: string) => void;
  onStats: (code: string) => void;
  onDelete: (code: string) => void;
};

export default function LinkTable({ links, onCopy, onOpen, onStats, onDelete }: Props) {
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
        <thead>
          <tr style={{ textAlign: "left", color: "#cce6ff" }}>
            <th style={{ padding: "12px 10px", fontSize: 13 }}>Code</th>
            <th style={{ padding: "12px 10px", fontSize: 13 }}>Target</th>
            <th style={{ padding: "12px 10px", width: 90, textAlign: "center", fontSize: 13 }}>Clicks</th>
            <th style={{ padding: "12px 10px", width: 200, fontSize: 13 }}>Last clicked</th>
            <th style={{ padding: "12px 10px", width: 260, textAlign: "center", fontSize: 13 }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {links.map((l) => (
            <tr key={l.code} style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "transparent" }}>
              <td style={{ padding: "12px 10px", fontFamily: "monospace", verticalAlign: "top", color: "#fff" }}>
                {l.code}
              </td>

              <td style={{ padding: "12px 10px", verticalAlign: "top" }}>
                <div
                  style={{
                    display: "inline-block",
                    maxWidth: "60ch",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: "#cfe8ff",
                  }}
                  title={l.longUrl}
                >
                  {l.longUrl}
                </div>
              </td>

              <td style={{ padding: "12px 10px", textAlign: "center", verticalAlign: "top", color: "#fff" }}>
                {l.clicks ?? 0}
              </td>

              <td style={{ padding: "12px 10px", verticalAlign: "top", color: "#cfe8ff" }}>
                {l.lastClicked ? new Date(l.lastClicked).toLocaleString() : "-"}
              </td>

              <td style={{ padding: "12px 10px", verticalAlign: "top", textAlign: "center" }}>
                {/* Copy */}
                <button
                  onClick={() => onCopy(l.code)}
                  style={{
                    marginRight: 8,
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "transparent",
                    color: "#e6f6ff",
                    cursor: "pointer",
                  }}
                >
                  Copy
                </button>

                {/* Open */}
                <button
                  onClick={() => onOpen(l.code)}
                  style={{
                    marginRight: 8,
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "transparent",
                    color: "#66c7ff",
                    cursor: "pointer",
                  }}
                >
                  Open
                </button>

                {/* Stats */}
                <button
                  onClick={() => onStats(l.code)}
                  style={{
                    marginRight: 8,
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "transparent",
                    color: "#9be4c8",
                    cursor: "pointer",
                  }}
                >
                  Stats
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    if (!confirm(`Delete ${l.code} ? This cannot be undone.`)) return;
                    onDelete(l.code);
                  }}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "#ff4e4e",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {links.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: 20, color: "#9fb8d4" }}>
                No links yet — create one using the form above.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
