// components/NewLinkForm.tsx
import React, { useState } from "react";
import axios from "axios";

export default function NewLinkForm({ onCreated, setToast }: { onCreated: () => void; setToast: (t:any) => void }) {
  const [longUrl, setLongUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function validateUrl(v: string) {
    try { const u = new URL(v); return u.protocol === "http:" || u.protocol === "https:"; } catch { return false; }
  }

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    if (!longUrl.trim()) return setError("Please enter a URL.");
    if (!validateUrl(longUrl.trim())) return setError("URL must start with http:// or https://");
    if (code && !/^[A-Za-z0-9]{6,8}$/.test(code)) return setError("Custom code must be 6-8 chars alphanumeric.");
    setLoading(true);
    try {
      await axios.post("/api/links", { longUrl: longUrl.trim(), code: code || undefined });
      setLongUrl(""); setCode("");
      setToast({ id: Date.now().toString(), message: "Link created", type: "success" });
      onCreated();
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Failed to create link";
      setError(msg);
      setToast({ id: Date.now().toString(), message: msg, type: "error" });
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-8">
          <input value={longUrl} onChange={(e)=>setLongUrl(e.target.value)} placeholder="https://example.com/my-long-url" className="form-input" />
        </div>
        <div className="md:col-span-2">
          <input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Custom code (6-8 chars)" className="form-input" />
        </div>
        <div className="md:col-span-2">
          <button type="submit" disabled={loading} className="btn-primary w-full">{ loading ? "Creating..." : "Get your link for free" }</button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="small-muted">{ error ? <span className="text-red-500">{error}</span> : "Custom codes: A-Za-z0-9 (6-8 chars)" }</div>
        <div className="small-muted">Tip: leave code empty to auto-generate</div>
      </div>
    </form>
  );
}
