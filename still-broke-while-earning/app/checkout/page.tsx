"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/* ─── Checkout Page ───────────────────────────────────────── */
export default function Checkout() {
  const [form, setForm] = useState({ name: "", email: "", method: "card" });
  const [submitted, setSubmitted] = useState(false);

  const includes = [
    "Digital copy of the full book (11 Parts)",
    "13 printable worksheets",
    "21-Day Financial Challenge",
    "AI Financial Assessment tool",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen">
      {/* ── Top bar ───────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: "rgba(4,16,10,0.95)", borderBottom: "1px solid rgba(201,168,76,0.28)" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-[#c9a84c] font-bold text-xs tracking-[0.22em] uppercase hover:text-[#f5e642] transition-colors"
          >
            BrilliantLabs Bibliotech
          </Link>
          <Link
            href="/"
            className="text-[#f5f0e8]/50 text-sm hover:text-[#c9a84c] transition-colors flex items-center gap-2"
          >
            ← Back to book
          </Link>
        </div>
      </header>

      {/* ── Hero strip ────────────────────────────────────── */}
      <section
        className="py-14 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-72 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)" }}
        />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase">
              Secure Checkout
            </span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c9a84c]" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black text-[#f5f0e8]">
            Complete Your{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #c9a84c, #f5e642)" }}
            >
              Order
            </span>
          </h1>
        </div>
      </section>

      {/* ── Body: form + summary ──────────────────────────── */}
      <section
        className="py-16 px-6"
        style={{ background: "linear-gradient(180deg, #08190f 0%, #04100a 100%)" }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 items-start">
          {/* ─── Left: Checkout form ─────────────────────── */}
          <div className="emerald-card rounded-2xl p-8 md:p-10">
            {submitted ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-5">✅</div>
                <h2 className="font-display text-2xl font-black text-[#f5f0e8] mb-3">
                  Thank you, {form.name || "friend"}!
                </h2>
                <p className="text-[#f5f0e8]/65 leading-relaxed max-w-md mx-auto mb-2">
                  Your order has been received. (This is a placeholder — payment
                  processing is not yet connected.)
                </p>
                <p className="text-[#c9a84c]/80 text-sm mb-8">
                  A download link would be sent to{" "}
                  <span className="text-[#f5e642]">{form.email || "your email"}</span>.
                </p>
                <Link href="/" className="btn-gold px-8 py-3 text-sm inline-block">
                  Back to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="font-display text-2xl font-black text-[#f5f0e8] mb-1">
                  Your Details
                </h2>
                <p className="text-[#f5f0e8]/50 text-sm mb-8">
                  Where should we send your digital book?
                </p>

                {/* Name */}
                <label className="block mb-5">
                  <span className="text-[#c9a84c] text-xs font-semibold tracking-wider uppercase mb-2 block">
                    Full Name
                  </span>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Juan Dela Cruz"
                    className="checkout-input"
                  />
                </label>

                {/* Email */}
                <label className="block mb-8">
                  <span className="text-[#c9a84c] text-xs font-semibold tracking-wider uppercase mb-2 block">
                    Email Address
                  </span>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@email.com"
                    className="checkout-input"
                  />
                </label>

                {/* Payment method */}
                <span className="text-[#c9a84c] text-xs font-semibold tracking-wider uppercase mb-3 block">
                  Payment Method
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  {[
                    { id: "card", label: "Card", icon: "💳" },
                    { id: "gcash", label: "GCash", icon: "📱" },
                    { id: "bank", label: "Bank Transfer", icon: "🏦" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setForm({ ...form, method: m.id })}
                      className={`rounded-xl p-4 text-center transition-all duration-200 ${
                        form.method === m.id
                          ? "border-2 text-[#f5e642]"
                          : "border text-[#f5f0e8]/60 hover:text-[#f5f0e8]"
                      }`}
                      style={{
                        borderColor:
                          form.method === m.id
                            ? "#c9a84c"
                            : "rgba(201,168,76,0.25)",
                        background:
                          form.method === m.id
                            ? "rgba(201,168,76,0.08)"
                            : "transparent",
                      }}
                    >
                      <div className="text-2xl mb-1">{m.icon}</div>
                      <div className="text-sm font-medium">{m.label}</div>
                    </button>
                  ))}
                </div>

                <button type="submit" className="btn-gold w-full px-8 py-5 text-base">
                  Pay ₱950 — Complete Order
                </button>

                <p className="text-center text-[#f5f0e8]/30 text-xs mt-4">
                  🔒 Placeholder checkout · No real payment is processed yet
                </p>
              </form>
            )}
          </div>

          {/* ─── Right: Order summary ────────────────────── */}
          <aside className="lg:sticky lg:top-28">
            <div className="emerald-card rounded-2xl p-8">
              <h3 className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase mb-6">
                Order Summary
              </h3>

              {/* Product row */}
              <div className="flex gap-4 mb-6 pb-6" style={{ borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
                <div className="relative flex-shrink-0">
                  <div
                    className="absolute -inset-[2px] rounded-lg"
                    style={{ background: "linear-gradient(135deg, #c9a84c, #f5e642, #c9a84c)" }}
                  />
                  <Image
                    src="/images/front_cover.jpg"
                    alt="Still Broke While Earning — cover"
                    width={70}
                    height={95}
                    className="relative rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-[#f5f0e8] font-bold leading-snug text-sm">
                    Still Broke While Earning
                  </p>
                  <p className="text-[#f5f0e8]/45 text-xs mb-1">
                    Why Earning More Won&apos;t Fix Your Money Problems
                  </p>
                  <p className="text-[#c9a84c]/70 text-xs">M.A. Jacinto, CSFP</p>
                </div>
              </div>

              {/* Includes */}
              <ul className="space-y-3 mb-6">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[#f5e642] font-bold text-sm leading-none mt-0.5">✓</span>
                    <span className="text-[#f5f0e8]/70 text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Totals */}
              <div className="space-y-2 pt-5" style={{ borderTop: "1px solid rgba(201,168,76,0.2)" }}>
                <div className="flex justify-between text-sm">
                  <span className="text-[#f5f0e8]/50">Regular price</span>
                  <span className="text-[#f5f0e8]/40 line-through">₱1,200</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#f5f0e8]/50">Launch discount</span>
                  <span className="text-[#f5e642]">−₱250</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 mt-2" style={{ borderTop: "1px solid rgba(201,168,76,0.15)" }}>
                  <span className="text-[#f5f0e8] font-bold">Total</span>
                  <span
                    className="font-black text-3xl text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(135deg, #c9a84c, #f5e642)" }}
                  >
                    ₱950
                  </span>
                </div>
              </div>
            </div>

            {/* Trust note */}
            <p className="text-center text-[#f5f0e8]/35 text-xs mt-5 leading-relaxed">
              Instant digital delivery · Lifetime access
              <br />
              Published by BrilliantLabs Bibliotech
            </p>
          </aside>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer
        className="py-10 px-6 text-center"
        style={{ background: "#020a05", borderTop: "1px solid rgba(201,168,76,0.2)" }}
      >
        <p
          className="text-transparent bg-clip-text font-bold text-xs tracking-[0.2em] uppercase mb-2 inline-block"
          style={{ backgroundImage: "linear-gradient(135deg, #c9a84c, #f5e642)" }}
        >
          BrilliantLabs Bibliotech
        </p>
        <p className="text-[#f5f0e8]/28 text-xs">
          © 2026 M.A. Jacinto. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
