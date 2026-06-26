"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

/* ─── Gold CTA Button ─────────────────────────────────────── */
function BuyButton({ size = "default" }: { size?: "default" | "large" }) {
  const sizes = size === "large" ? "px-12 py-5 text-base" : "px-7 py-3 text-sm";
  return (
    <Link href="/checkout" className={`btn-gold ${sizes} inline-block`}>
      Buy Now — ₱950
    </Link>
  );
}

/* ─── Navbar ──────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? "bg-[#04100a]/95 backdrop-blur-md border-b border-[#c9a84c]/30 shadow-2xl shadow-black/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-[#c9a84c] font-bold text-xs tracking-[0.22em] uppercase block">
            BrilliantLabs Bibliotech
          </span>
        </div>
        <BuyButton />
      </div>
    </nav>
  );
}

/* ─── Hero ────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_shine.png"
          alt="Warm reading scene"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Mobile/tablet overlay — even dark veil so centered text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#04100a]/98 via-[#08190f]/92 to-[#04100a]/68 lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04100a]/85 via-transparent to-[#04100a]/45 lg:hidden" />
        {/* Desktop overlay — heavy left for text legibility, fades right so open book shows */}
        <div className="absolute inset-0 hidden lg:block"
          style={{ background: "linear-gradient(to right, #04100a 0%, #04100af5 28%, #08190fcc 52%, transparent 75%)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04100a]/85 via-transparent to-[#04100a]/45 hidden lg:block" />
      </div>

      {/* Subtle gold radial glow */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)" }} />

      {/* ── Mobile / Tablet — centered column ── */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center px-6 pt-24 pb-16 gap-8 h-screen text-center lg:hidden">
        <Image
          src="/images/stillbroke.png"
          alt="Still Broke While Earning — book"
          width={220}
          height={286}
          className="book-float object-contain w-[150px] md:w-[185px] flex-shrink-0"
          priority
        />
        <div className="flex flex-col items-center max-w-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-gradient-to-r from-[#c9a84c] to-[#f5e642]" />
            <span className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase">
              BrilliantLabs Bibliotech — New Release
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-black text-[#f5f0e8] leading-[1.15] mb-4">
            You work hard.<br />
            <em className="not-italic text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #c9a84c, #f5e642)" }}>
              You earn.
            </em>{" "}And yet…<br />
            you&apos;re still broke.
          </h1>
          <p className="text-[#f5f0e8]/70 text-base leading-relaxed mb-2">
            The answer isn&apos;t more income.
          </p>
          <p className="text-[#f5e642]/90 text-base leading-relaxed mb-6 font-medium">
            It&apos;s the system you&apos;ve never been taught.
          </p>
          <div className="flex flex-col gap-2 items-center">
            <BuyButton size="large" />
            <p className="text-[#f5f0e8]/40 text-sm">Digital copy · Instant access</p>
          </div>
        </div>
      </div>

      {/* ── Desktop — text left over stacked books, floating book right over open book ── */}
      <div className="relative z-20 hidden lg:flex w-full h-screen items-center px-16 xl:px-24">
        {/* Text block — left column */}
        <div className="flex flex-col items-start max-w-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-gradient-to-r from-[#c9a84c] to-[#f5e642]" />
            <span className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase">
              BrilliantLabs Bibliotech — New Release
            </span>
          </div>
          <h1 className="font-display text-4xl xl:text-5xl font-black text-[#f5f0e8] leading-[1.15] mb-5">
            You work hard.<br />
            <em className="not-italic text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #c9a84c, #f5e642)" }}>
              You earn.
            </em>{" "}And yet…<br />
            you&apos;re still broke.
          </h1>
          <p className="text-[#f5f0e8]/70 text-xl leading-relaxed mb-2">
            The answer isn&apos;t more income.
          </p>
          <p className="text-[#f5e642]/90 text-lg leading-relaxed mb-8 font-medium">
            It&apos;s the system you&apos;ve never been taught.
          </p>
          <div className="flex flex-col gap-2 items-start">
            <BuyButton size="large" />
            <p className="text-[#f5f0e8]/40 text-sm">Digital copy · Instant access</p>
          </div>
        </div>

        {/* Floating book — right side, positioned over the open book in background */}
        <div className="absolute right-[18%] xl:right-[22%] top-1/2 -translate-y-1/2">
          <Image
            src="/images/stillbroke.png"
            alt="Still Broke While Earning — book"
            width={260}
            height={338}
            className="book-float object-contain"
            priority
          />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#04100a] to-transparent z-10" />

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-[#c9a84c]/50 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#c9a84c]/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

/* ─── The Problem ─────────────────────────────────────────── */
function TheProblem() {
  const pains = [
    { icon: "💸", title: "Paycheck to Paycheck", text: "You earn a decent income, but the money vanishes before the month is over — and you can't explain where it went." },
    { icon: "📊", title: "Budgets That Always Fail", text: "You've tried spreadsheets, apps, envelopes. Every system collapses within weeks. You blame yourself, not the system." },
    { icon: "🧠", title: "Emotional Spending Spirals", text: "Stress, sadness, celebration — emotions lead you to spend. Then comes the guilt, and you spend again to cope." },
    { icon: "🚫", title: "Income Isn't the Answer", text: "You told yourself a raise would fix it. It didn't. More money just means bigger versions of the same old problems." },
  ];

  return (
    <section id="problem" className="py-28 px-6" style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase">Sound Familiar?</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c9a84c]" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-[#f5f0e8] mb-6">
            The Struggle Is Real —{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #c9a84c, #f5e642)" }}>
              And It&apos;s Not Your Fault
            </span>
          </h2>
          <p className="text-[#f5f0e8]/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Millions of people earn a living wage and still feel financially trapped. The problem was never your income — it was the broken money narrative you were handed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pains.map((p) => (
            <div key={p.title} className="emerald-card rounded-xl p-8">
              <div className="text-4xl mb-5">{p.icon}</div>
              <h3 className="text-[#f5e642] font-bold text-xl mb-3">{p.title}</h3>
              <p className="text-[#f5f0e8]/60 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── What You'll Learn ───────────────────────────────────── */
function WhatYoullLearn() {
  const promises = [
    { number: "01", title: "Identify Your Emotional Spending Triggers", text: "Uncover the hidden emotions and beliefs driving your spending so you can finally break free from cycles that drain your wallet." },
    { number: "02", title: "Rebuild Your Self-Worth Around Money", text: "Your relationship with money is rooted in your sense of self. Learn how to heal it so finances no longer feel like a source of shame." },
    { number: "03", title: "Use the FlowPath Budget Method™", text: "A revolutionary, emotion-aware budgeting system that works with your psychology — not against it — so you actually stick to it." },
    { number: "04", title: "Reclaim Control Without Guilt", text: "Build a money life that feels empowering, not punishing. Spend with intention. Save with confidence. Live without financial dread." },
  ];

  return (
    <section id="learn" className="py-28 px-6" style={{ background: "linear-gradient(180deg, #08190f 0%, #04100a 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase">4 Transformative Promises</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c9a84c]" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-[#f5f0e8] mb-6">
            What You&apos;ll{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #c9a84c, #f5e642)" }}>
              Take Away
            </span>
          </h2>
          <p className="text-[#f5f0e8]/60 text-lg max-w-2xl mx-auto leading-relaxed">
            This isn&apos;t another budgeting book. It&apos;s a complete reimagining of your relationship with money.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {promises.map((p) => (
            <div key={p.number} className="group relative pl-8" style={{ borderLeft: "2px solid rgba(201,168,76,0.4)" }}>
              {/* Hover glow on border */}
              <div className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#c9a84c] to-[#f5e642] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute -left-px top-0 font-black text-7xl leading-none select-none"
                style={{ color: "rgba(201,168,76,0.08)", fontFamily: "'Playfair Display', serif" }}>
                {p.number}
              </span>
              <h3 className="text-[#f5f0e8] font-bold text-xl mb-3 mt-1 group-hover:text-[#f5e642] transition-colors duration-300">
                {p.title}
              </h3>
              <p className="text-[#f5f0e8]/55 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── What's Inside ───────────────────────────────────────── */
function WhatsInside() {
  const features = [
    { icon: "📖", label: "11 Parts", desc: "A complete journey from emotional diagnosis to sustainable financial freedom" },
    { icon: "📝", label: "13 Worksheets", desc: "Hands-on exercises that move you from insight to real action, step by step" },
    { icon: "🏆", label: "21-Day Challenge", desc: "A structured program to build lasting money habits that actually stick" },
    { icon: "🤖", label: "AI Assessment", desc: "A personalized AI-powered tool to assess and guide your financial journey" },
  ];

  return (
    <section id="inside" className="py-28 px-6" style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase">Inside the Book</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c9a84c]" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-[#f5f0e8]">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #c9a84c, #f5e642)" }}>
              Break the Cycle
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.label} className="emerald-card rounded-2xl p-8 text-center group">
              <div className="text-5xl mb-5">{f.icon}</div>
              <h3 className="font-bold text-2xl mb-3 text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #c9a84c, #f5e642)" }}>
                {f.label}
              </h3>
              <p className="text-[#f5f0e8]/55 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FlowPath Budget ─────────────────────────────────────── */
function FlowPath() {
  const steps = [
    { step: 1, title: "Know Your Emotional Triggers", text: "Map the feelings — stress, boredom, celebration — that consistently lead you to spend impulsively." },
    { step: 2, title: "Define Guilt-Free Zones", text: "Designate spending categories where you allow yourself joy without shame, removing the feast-or-famine cycle." },
    { step: 3, title: "Build Your Guardrails", text: "Set intelligent boundaries that protect your priorities without making you feel restricted or punished." },
    { step: 4, title: "Set Emotional Percentages", text: "Allocate your income using percentages tied to your emotional values, not generic rules that don't fit your life." },
    { step: 5, title: "Reflect Without Guilt", text: "Regular, compassionate check-ins replace judgment with curiosity — turning financial reviews into growth moments." },
    { step: 6, title: "Reset, Don't Restart", text: "When you slip (and you will), FlowPath gives you a simple reset process so you never have to start from zero again." },
  ];

  return (
    <section id="flowpath" className="py-28 px-6" style={{ background: "linear-gradient(180deg, #08190f 0%, #04100a 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase">The Core Method</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c9a84c]" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-[#f5f0e8] mb-4">
            The{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #c9a84c, #f5e642)" }}>
              FlowPath Budget
            </span>{" "}
            Method™
          </h2>
          <p className="text-[#f5f0e8]/60 text-lg max-w-2xl mx-auto">
            6 steps designed around how you actually think and feel about money — not how a finance textbook thinks you should.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="flex gap-5 items-start group">
              {/* Gold step number circle */}
              <div className="flex-shrink-0 w-[52px] h-[52px] rounded-full flex items-center justify-center font-black text-[#04100a] text-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ background: "#c9a84c", boxShadow: "0 4px 20px rgba(201,168,76,0.35)" }}>
                {s.step}
              </div>
              <div className="emerald-card rounded-xl p-6 flex-1">
                <h3 className="text-[#f5f0e8] font-bold text-lg mb-2 group-hover:text-[#f5e642] transition-colors duration-300">
                  {s.title}
                </h3>
                <p className="text-[#f5f0e8]/55 leading-relaxed text-sm">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── About the Author ────────────────────────────────────── */
function AboutAuthor() {
  return (
    <section id="author" className="py-28 px-6 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}>
      {/* Decorative gold blur */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase">Meet the Author</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c9a84c]" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Back cover */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-4 rounded-2xl blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.2) 0%, transparent 70%)" }} />
              {/* Gold frame border */}
              <div className="absolute -inset-[3px] rounded-xl"
                style={{ background: "linear-gradient(135deg, #c9a84c, #f5e642, #c9a84c)" }} />
              <Image
                src="/images/back_cover.jpg"
                alt="Back cover — Still Broke While Earning"
                width={300}
                height={400}
                className="relative rounded-xl shadow-2xl shadow-black/60 group-hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="flex-1">
            <h2 className="font-display text-4xl md:text-5xl font-black text-[#f5f0e8] mb-2">
              M.A. Jacinto
            </h2>
            <p className="text-transparent bg-clip-text font-semibold text-lg mb-8 tracking-wide"
              style={{ backgroundImage: "linear-gradient(135deg, #c9a84c, #f5e642)" }}>
              CSFP · Author · Founder · Entrepreneur
            </p>

            <p className="text-[#f5f0e8]/70 text-lg leading-relaxed mb-6">
              M.A. Jacinto is a single mother of three, entrepreneur, and founder of the FlowPath Budget method. She is the CEO of{" "}
              <strong className="text-[#f5f0e8]">Penfix Advertising and Business Solutions</strong> and the founder of{" "}
              <strong className="text-[#f5f0e8]">BrilliantLabs Solutions</strong> — a growing ecosystem of AI-powered business and knowledge solutions built in the heart of San Fernando, Pampanga.
            </p>

            <p className="text-[#f5f0e8]/70 text-lg leading-relaxed mb-10">
              <em className="not-italic font-semibold text-[#f5e642]">Still Broke While Earning</em> is her first book and the flagship publication of{" "}
              <strong className="text-[#f5f0e8]">BrilliantLabs Bibliotech</strong>.
            </p>

            <div className="flex flex-wrap gap-3">
              {["CSFP Certified", "FlowPath Founder", "AI Business Builder", "San Fernando, Pampanga"].map((tag) => (
                <span key={tag}
                  className="px-4 py-2 text-sm font-medium rounded-full border text-[#c9a84c] hover:border-[#f5e642] hover:text-[#f5e642] transition-colors duration-200"
                  style={{ borderColor: "rgba(201,168,76,0.45)", background: "rgba(201,168,76,0.06)" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ────────────────────────────────────────── */
function Testimonials() {
  const reviews = [
    { quote: "I've read dozens of finance books and none of them addressed the emotional side the way this one does. The FlowPath method completely changed how I think about my paycheck. I'm saving more now than I ever have.", name: "Maria C.", title: "Marketing Professional, Manila", stars: 5 },
    { quote: "I used to feel like I was broken when it came to money. This book made me realize I just had the wrong system. The 21-Day Challenge alone was worth the price. I'm finally in control.", name: "Jerome T.", title: "Freelance Designer, Cebu", stars: 5 },
    { quote: "As a solo parent, every peso matters. M.A. Jacinto writes like she understands exactly what it feels like to be financially stretched. The worksheets are practical and the AI assessment is incredibly eye-opening.", name: "Rowena M.", title: "Business Owner, Pampanga", stars: 5 },
  ];

  return (
    <section id="testimonials" className="py-28 px-6" style={{ background: "linear-gradient(180deg, #08190f 0%, #04100a 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase">What Readers Are Saying</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c9a84c]" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-[#f5f0e8]">
            Real Results,{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #c9a84c, #f5e642)" }}>
              Real People
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.name} className="emerald-card rounded-2xl p-8 relative overflow-hidden">
              {/* Decorative large quote */}
              <span className="absolute top-3 right-5 font-black text-9xl leading-none select-none pointer-events-none"
                style={{ color: "rgba(201,168,76,0.06)", fontFamily: "Georgia, serif" }}>
                &ldquo;
              </span>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: r.stars }).map((_, i) => (
                  <span key={i} className="text-[#f5e642] text-lg">★</span>
                ))}
              </div>

              <p className="text-[#f5f0e8]/65 leading-relaxed mb-6 relative z-10 italic text-[15px]">
                &ldquo;{r.quote}&rdquo;
              </p>

              <div style={{ borderTop: "1px solid rgba(201,168,76,0.2)" }} className="pt-4">
                <p className="text-[#f5f0e8] font-bold">{r.name}</p>
                <p className="text-[#c9a84c]/70 text-sm">{r.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing / Final CTA ─────────────────────────────────── */
function Pricing() {
  const includes = [
    "Digital copy of the full book",
    "13 printable worksheets",
    "21-Day Financial Challenge",
    "AI Financial Assessment tool",
  ];

  return (
    <section id="pricing" className="py-28 px-6 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}>
      {/* Bottom gold glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.1) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase">Get the Book</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c9a84c]" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-[#f5f0e8] mb-4">
            Start Your Journey for{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #c9a84c, #f5e642)" }}>
              ₱950
            </span>
          </h2>
          <p className="text-[#f5f0e8]/50 text-lg">One investment. A lifetime of financial clarity.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-14 items-center justify-center">
          {/* Cover */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-5 rounded-2xl blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.2) 0%, transparent 70%)" }} />
              <div className="absolute -inset-[3px] rounded-xl"
                style={{ background: "linear-gradient(135deg, #c9a84c, #f5e642, #c9a84c)" }} />
              <Image
                src="/images/front_cover.jpg"
                alt="Still Broke While Earning — book cover"
                width={280}
                height={380}
                className="relative rounded-xl shadow-2xl shadow-black/80 group-hover:scale-[1.04] transition-transform duration-500"
              />
            </div>
          </div>

          {/* Pricing card */}
          <div className="max-w-md w-full relative">
            {/* Gold gradient border */}
            <div className="absolute -inset-[2px] rounded-2xl"
              style={{ background: "linear-gradient(135deg, #c9a84c, #f5e642, #c9a84c)" }} />
            <div className="relative rounded-2xl px-12 py-10 shadow-2xl text-center" style={{ background: "#0a2114" }}>
              <div className="mb-8">
                <p className="text-[#f5f0e8]/35 text-sm mb-2 line-through">Regular Price ₱1,200</p>
                <div className="flex items-baseline gap-3 justify-center">
                  <span className="font-black text-6xl text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(135deg, #c9a84c, #f5e642)" }}>
                    ₱950
                  </span>
                  <span className="text-[#f5f0e8]/35 text-sm">launch price</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 inline-block text-left">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[#f5e642] font-bold text-lg leading-none mt-0.5">✓</span>
                    <span className="text-[#f5f0e8]/75">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-center">
                <BuyButton size="large" />
              </div>

              <p className="text-center text-[#f5f0e8]/28 text-xs mt-4">
                Secure checkout · Digital delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: "#020a05", borderTop: "1px solid rgba(201,168,76,0.2)" }} className="py-14 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <p className="text-transparent bg-clip-text font-bold text-sm tracking-[0.2em] uppercase mb-1"
            style={{ backgroundImage: "linear-gradient(135deg, #c9a84c, #f5e642)" }}>
            BrilliantLabs Bibliotech
          </p>
          <p className="text-[#f5f0e8]/28 text-xs">A division of BrilliantLabs Solutions</p>
        </div>

        <nav className="flex flex-wrap gap-6 justify-center">
          {[["problem","Problem"],["learn","Learn"],["inside","Inside"],["flowpath","FlowPath"],["author","Author"],["testimonials","Testimonials"],["pricing","Pricing"]].map(([id, label]) => (
            <a key={id} href={`#${id}`}
              className="text-[#f5f0e8]/40 text-sm hover:text-[#c9a84c] transition-colors duration-200">
              {label}
            </a>
          ))}
        </nav>

        <p className="text-[#f5f0e8]/28 text-xs text-center md:text-right">
          © 2026 M.A. Jacinto. All rights reserved.
          <br />BrilliantLabs Bibliotech
        </p>
      </div>
    </footer>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <hr className="gold-divider" />
        <TheProblem />
        <hr className="gold-divider" />
        <WhatYoullLearn />
        <hr className="gold-divider" />
        <WhatsInside />
        <hr className="gold-divider" />
        <FlowPath />
        <hr className="gold-divider" />
        <AboutAuthor />
        <hr className="gold-divider" />
        <Testimonials />
        <hr className="gold-divider" />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
