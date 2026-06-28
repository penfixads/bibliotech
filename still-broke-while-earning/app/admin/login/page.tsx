"use client";

import { useState } from "react";
import { adminLogin } from "../actions";

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const res = await adminLogin(fd);
    if (res?.error) { setError(res.error); setPending(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-brand text-[#c8a84b] mb-1" style={{ fontSize: "18px", letterSpacing: "4px", textTransform: "uppercase" }}>
            BrilliantLabsPh Bibliotech
          </p>
          <p style={{ color: "rgba(232,223,192,0.4)", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase" }}>
            Admin Access
          </p>
        </div>
        <div className="emerald-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(232,223,192,0.5)" }}>
                Password
              </label>
              <input name="password" type="password" required autoFocus placeholder="••••••••" className="checkout-input" />
            </div>
            {error && <p className="text-sm" style={{ color: "#fca5a5" }}>{error}</p>}
            <button type="submit" disabled={pending} className="btn-gold w-full py-3 text-sm disabled:opacity-60">
              {pending ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
